// linea para probar

const readline = require('readline-sync');
const path = require('path');

// Import optimized modules
const config = require('./config');
const FileUtils = require('./utils/fileUtils');
const ZipProcessor = require('./processors/zipProcessor');
const BatchProcessor = require('./processors/batchProcessor');
const Common = require('./common');
const SearchRepeat = require('./searchRepeat');
const CIFrepeat = require('./CIFrepeat');

// Application state
class ApplicationState {
    constructor() {
        this.countFiles = 0;
        this.timeExtractZip = 0;
        this.timeParseXML2JSON = 0;
        this.timeMapJSON = 0;
        this.totalLines = 0;
        this.process = config.PROCESS_TYPES.LICITACIONES;
        this.jsonFinalProcces = [];
        this.pathResults = '';
    }

    reset() {
        this.countFiles = 0;
        this.timeExtractZip = 0;
        this.timeParseXML2JSON = 0;
        this.timeMapJSON = 0;
        this.totalLines = 0;
        // Don't reset jsonFinalProcces to preserve data across processes
        // this.jsonFinalProcces = [];
    }
}

// Create instances
const appState = new ApplicationState();
const zipProcessor = new ZipProcessor();
const batchProcessor = new BatchProcessor();
const commonInstance = new Common();
const searchRepeatInstance = new SearchRepeat();
const cifrepeatInstance = new CIFrepeat();

// Get user input
const responseMonth = readline.question('Ingresa el mes con dos cifras, por ejemplo 09-10-11...\n');
const respondeCreateFiles = readline.question('Desea crear los fichero? S/N\n');
const isTestMode = readline.question(
    'Es una prueba? (S/N - Si es S, todos los resultados se guardaran en una carpeta unica)\n'
);

/**
 * Main application class with optimized processing
 */
class OptimizedXml2JsonApp {
    constructor() {
        this.state = appState;
    }

    /**
     * Validates that all required files and directories exist before processing
     * @param {string} month - Month to process
     * @returns {Promise<boolean>} True if all validations pass
     */
    async validateRequiredFilesAndFolders(month) {
        console.log('************** VALIDANDO ARCHIVOS Y CARPETAS NECESARIOS ********************');

        const errors = [];
        const oldMonth = commonInstance.getOldMonth(month);

        // Check required directories
        const requiredDirs = [config.PATHS.APP_PATH, config.PATHS.SEARCH_REPEAT_PATH];

        if (isTestMode.toUpperCase() === 'S') {
            // Ensure test results directory exists
            try {
                await FileUtils.ensureDir(config.PATHS.TEST_RESULTS_BASE_PATH);
                console.log(`✅ Test results directory: ${config.PATHS.TEST_RESULTS_BASE_PATH}`);
            } catch (error) {
                errors.push(`❌ Cannot create test results directory: ${config.PATHS.TEST_RESULTS_BASE_PATH}`);
            }
        }

        for (const dir of requiredDirs) {
            if (!FileUtils.fileExists(dir)) {
                errors.push(`❌ Required directory missing: ${dir}`);
            } else {
                console.log(`✅ Directory found: ${dir}`);
            }
        }

        // Check ZIP files if creating files
        if (respondeCreateFiles.toUpperCase() === 'S') {
            const processTypes = [config.PROCESS_TYPES.LICITACIONES, config.PROCESS_TYPES.CONTRATOS_MENORES];

            for (const processType of processTypes) {
                const { zipPath } = this.buildPaths(processType, month);
                if (!FileUtils.fileExists(zipPath)) {
                    errors.push(`❌ Required ZIP file missing: ${zipPath}`);
                } else {
                    console.log(`✅ ZIP file found: ${zipPath}`);
                }
            }
        }

        // Check previous month data files (REQUIRED) - check both test and normal paths
        const previousMonthFiles = [
            `todo${oldMonth}${config.YEAR}NoRepeatOkCIFOK.json`,
            `todoAdjudicatarias${oldMonth}${config.YEAR}.json`,
        ];

        for (const fileName of previousMonthFiles) {
            const normalPath = path.join(config.PATHS.APP_PATH, fileName);
            const testPath = path.join(config.PATHS.TEST_RESULTS_BASE_PATH, fileName);

            let fileFound = false;
            if (FileUtils.fileExists(normalPath)) {
                console.log(`✅ Previous month file found in normal path: ${normalPath}`);
                fileFound = true;
            } else if (FileUtils.fileExists(testPath)) {
                console.log(`✅ Previous month file found in test path: ${testPath}`);
                fileFound = true;
            }

            if (!fileFound) {
                errors.push(
                    `❌ Required previous month file missing: ${fileName} (checked both ${normalPath} and ${testPath})`
                );
            }
        }

        // Report results
        if (errors.length > 0) {
            console.log('\n❌ ERRORES DE VALIDACIÓN ENCONTRADOS:');
            errors.forEach((error) => console.log(error));
            console.log('\n🛑 Proceso terminado. Resuelva los errores antes de continuar.');
            return false;
        }

        console.log('\n✅ VALIDACIÓN COMPLETADA - Todos los archivos y carpetas necesarios están disponibles');
        return true;
    }

    /**
     * Builds file paths based on process type and month
     */
    buildPaths(processType, month) {
        const isLicitaciones = processType === config.PROCESS_TYPES.LICITACIONES;
        const fileNames = isLicitaciones ? config.FILE_NAMES.LICITACIONES : config.FILE_NAMES.CONTRATOS_MENORES;

        const zipPath = config.PATHS.ZIP_TEMPLATE.replace('FOLDER', fileNames.FOLDER)
            .replace('PROCCESS', fileNames.PROCESS)
            .replace('MONTH', month);

        // Check if it's test mode
        let resultsPath;
        if (isTestMode.toUpperCase() === 'S') {
            // Create organized structure: resultados_prueba/2025/07/licitaciones or contratos_menores
            const processFolder = isLicitaciones ? 'licitaciones' : 'contratos_menores';
            resultsPath = `${config.PATHS.TEST_RESULTS_BASE_PATH}/${config.YEAR}/${month}/${processFolder}`;
        } else {
            resultsPath = config.PATHS.RESULTS_TEMPLATE.replace('FOLDER', fileNames.FOLDER) + `/${month}`;
        }

        return { zipPath, resultsPath };
    }

    /**
     * Extracts ZIP file asynchronously
     */
    async extractZip(processType, month) {
        console.log('************** extractZip inicio ********************');
        const start = Date.now();

        if (!month) {
            throw new Error('Month is required');
        }

        const { zipPath } = this.buildPaths(processType, month);

        try {
            this.state.countFiles = await zipProcessor.extractZip(zipPath, config.PATHS.EXTRACTED_DIR);
            this.state.timeExtractZip = ((Date.now() - start) / 60000).toFixed(2);

            console.log(`Extracted ${this.state.countFiles} files in ${this.state.timeExtractZip} minutes`);
            return true;
        } catch (error) {
            console.error('Error extracting ZIP:', error);
            throw error;
        }
    }

    /**
     * Parses XML to JSON using batch processing
     */
    async parseXML2JSON() {
        console.log('************** parseXML2JSON inicio ********************');
        const start = Date.now();

        const stats = await batchProcessor.processXmlToJsonBatch(
            config.PATHS.EXTRACTED_ATOM_DIR,
            config.PATHS.EXTRACTED_JSON_DIR,
            15 // Process 15 files at a time for better performance
        );

        this.state.totalLines = stats.totalLines;
        this.state.timeParseXML2JSON = ((Date.now() - start) / 60000).toFixed(2);

        console.log(`XML to JSON processing completed in ${this.state.timeParseXML2JSON} minutes`);
        console.log(`Total lines processed: ${new Intl.NumberFormat('es-ES').format(this.state.totalLines)}`);
    }

    /**
     * Maps JSON data to final format using batch processing
     */
    async mapJSON() {
        console.log('************** mapJSON inicio ********************');
        const start = Date.now();

        const arrayFinal = await batchProcessor.processJsonBatch(
            config.PATHS.EXTRACTED_JSON_DIR,
            config.FILTERS.ORGANIZATION_REGEX,
            25 // Process 25 files at a time
        );

        const { resultsPath } = this.buildPaths(this.state.process, responseMonth);
        this.state.pathResults = resultsPath;

        // Save final JSON and generate reports
        await this.saveFinalJson(arrayFinal);

        this.state.timeMapJSON = ((Date.now() - start) / 60000).toFixed(2);
        console.log(`JSON mapping completed in ${this.state.timeMapJSON} minutes`);
    }

    /**
     * Saves final JSON with optimized file operations
     */
    async saveFinalJson(arrayFinal) {
        try {
            // Clean up extracted files
            await FileUtils.removeDir(config.PATHS.EXTRACTED_DIR);

            // Ensure results directory exists
            await FileUtils.ensureDir(this.state.pathResults);

            // Add to final process array
            this.state.jsonFinalProcces.push(arrayFinal);

            // Process duplicates
            const result = this.searchRepeat(arrayFinal);

            // Save files asynchronously
            await Promise.all([
                FileUtils.writeJsonFile(`${this.state.pathResults}/final.json`, arrayFinal),
                FileUtils.writeJsonFile(`${this.state.pathResults}/repeat.json`, result.repeat),
                FileUtils.writeJsonFile(`${this.state.pathResults}/repeatMajor.json`, result.repeatMajor),
                FileUtils.writeJsonFile(`${this.state.pathResults}/finalNoRepeat.json`, result.noRepeat),
            ]);

            const totalRepeticiones = arrayFinal.length;
            const noRepetidos = result.noRepeat.length;
            const repetidos = result.repeat.length;
            const mayores = result.repeatMajor.length;
            const processDescription =
                this.state.process === config.PROCESS_TYPES.LICITACIONES ? 'licitaciones' : 'contratos menores';
            const ao = this.state.process === config.PROCESS_TYPES.LICITACIONES ? 'a' : 'o';

            console.log('************** TERMINADO ********************');
            console.log(`Tiempo para ejecutar extractZip()    = ${this.state.timeExtractZip} minutos`);
            console.log(`Tiempo para ejecutar parseXML2JSON() = ${this.state.timeParseXML2JSON} minutos`);
            console.log(`Tiempo para ejecutar mapJSON()       = ${this.state.timeMapJSON} minutos`);
            console.log(
                `Total líneas XML analizadas          = ${new Intl.NumberFormat('es-ES').format(this.state.totalLines)}`
            );
            console.log(`Total ${processDescription} encontrad${ao}s:      = ${totalRepeticiones}`);
            console.log(`Total ${processDescription} sin repeticiones: = ${noRepetidos}`);
            console.log(`Total ${processDescription} con repeticiones: = ${repetidos}`);
            console.log(`Total ${processDescription} repetid${ao}s más recientes:  = ${mayores}`);

            await this.logFinal(totalRepeticiones, noRepetidos, repetidos, mayores);
        } catch (error) {
            console.error('Error saving final JSON:', error);
            throw error;
        }
    }

    /**
     * Searches for repeated entries
     */
    searchRepeat(arrayFinal) {
        const objectRepeat = commonInstance.searchRepeat(arrayFinal);
        return {
            repeat: objectRepeat.repeat,
            repeatMajor: objectRepeat.repeatMajor,
            noRepeat: objectRepeat.noRepeat,
        };
    }

    /**
     * Creates final log with statistics
     */
    async logFinal(totalLicitaciones, sinRepeticion, repetidos, mayores) {
        const processDescription =
            this.state.process === config.PROCESS_TYPES.LICITACIONES ? 'licitaciones' : 'contratos menores';
        const ao = this.state.process === config.PROCESS_TYPES.LICITACIONES ? 'a' : 'o';

        const logFinal = {
            'Tiempo para ejecutar extractZip()': `${this.state.timeExtractZip} minutos`,
            'Tiempo para ejecutar parseXML2JSON()': `${this.state.timeParseXML2JSON} minutos`,
            'Tiempo para ejecutar mapJSON()': `${this.state.timeMapJSON} minutos`,
            'Total líneas XML analizadas': `${new Intl.NumberFormat('es-ES').format(this.state.totalLines)}`,
            [`Total ${processDescription} encontrad${ao}s:`]: totalLicitaciones,
            [`Total ${processDescription} sin repeticiones`]: sinRepeticion,
            [`Total ${processDescription} con repeticiones`]: repetidos,
            [`Total ${processDescription} repetid${ao}s más recientes`]: mayores,
        };

        await FileUtils.writeJsonFile(`${this.state.pathResults}/logFinal.json`, logFinal);
    }

    /**
     * Merges final JSON files with existing data
     */
    async mergeJsonFinal() {
        const month = commonInstance.getOldMonth(responseMonth);
        console.log('Merging with previous month:', month);

        // Check both test and normal paths for previous month file
        const fileName = `todo${month}${config.YEAR}NoRepeatOkCIFOK.json`;
        const normalPath = path.join(config.PATHS.APP_PATH, fileName);

        // For test mode, check in the organized structure
        let testPath;
        if (isTestMode.toUpperCase() === 'S') {
            testPath = path.join(config.PATHS.TEST_RESULTS_BASE_PATH, config.YEAR, month, 'finales', fileName);
        } else {
            testPath = path.join(config.PATHS.TEST_RESULTS_BASE_PATH, fileName);
        }

        let appPathFileData = normalPath;
        if (FileUtils.fileExists(testPath)) {
            appPathFileData = testPath;
            console.log('Using previous month file from test path:', testPath);
        } else {
            console.log('Using previous month file from normal path:', normalPath);
        }

        try {
            // File existence is guaranteed by validation - read directly
            console.log('Previous month file found, merging data...');
            const existingData = await FileUtils.readJsonFile(appPathFileData);

            // Add current month data to existing data
            this.state.jsonFinalProcces.forEach((array) => {
                existingData.push(...array);
            });

            const repeatJsonMerge = commonInstance.searchRepeat(existingData);

            let outputPath;
            if (isTestMode.toUpperCase() === 'S') {
                outputPath = path.join(config.PATHS.TEST_RESULTS_BASE_PATH, config.YEAR, responseMonth, 'finales');
                // Create the directory if it doesn't exist
                await FileUtils.ensureDir(outputPath);
            } else {
                outputPath = config.PATHS.APP_PATH;
            }

            searchRepeatInstance.saveResultRepeat(
                existingData.length,
                repeatJsonMerge.repeat,
                repeatJsonMerge.noRepeat,
                repeatJsonMerge.repeatMajor,
                responseMonth,
                outputPath
            );

            // For CIFrepeat, create adjudicatarias subfolder in test mode
            let cifOutputPath = outputPath;
            if (isTestMode.toUpperCase() === 'S') {
                cifOutputPath = path.join(
                    config.PATHS.TEST_RESULTS_BASE_PATH,
                    config.YEAR,
                    responseMonth,
                    'adjudicatarias'
                );
                await FileUtils.ensureDir(cifOutputPath);
            }

            cifrepeatInstance.question(repeatJsonMerge.noRepeat, responseMonth, config.PATHS.APP_PATH, cifOutputPath);
        } catch (error) {
            console.error('Error merging JSON files:', error);
            throw error;
        }
    }

    /**
     * Main execution method
     */
    async ejecutaTodo() {
        try {
            // Validate required files and folders before starting
            const validationPassed = await this.validateRequiredFilesAndFolders(responseMonth);
            if (!validationPassed) {
                process.exit(1);
            }

            if (respondeCreateFiles.toUpperCase() === 'S') {
                const processTypes = [config.PROCESS_TYPES.LICITACIONES, config.PROCESS_TYPES.CONTRATOS_MENORES];

                for (const processType of processTypes) {
                    console.log(`\n=== Processing ${processType === 1 ? 'LICITACIONES' : 'CONTRATOS MENORES'} ===`);

                    this.state.process = processType;

                    await this.extractZip(processType, responseMonth);
                    await this.parseXML2JSON();
                    await this.mapJSON();

                    // Reset state for next process
                    this.state.reset();
                }
            }

            await this.mergeJsonFinal();

            console.log('\n************** PROCESO COMPLETADO ********************');
        } catch (error) {
            console.error('Error en ejecución principal:', error);
            process.exit(1);
        }
    }
}

// Create and run application
const app = new OptimizedXml2JsonApp();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the application
app.ejecutaTodo().catch(console.error);

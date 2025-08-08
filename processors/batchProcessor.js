const fs = require('fs');
const path = require('path');
const FileUtils = require('../utils/fileUtils');
const XmlProcessor = require('./xmlProcessor');

class BatchProcessor {
    constructor() {
        this.xmlProcessor = new XmlProcessor();
        this.stats = {
            processedFiles: 0,
            totalLines: 0,
            startTime: 0,
            processingTime: 0,
        };
    }

    /**
     * Processes XML files in batches to convert to JSON
     * @param {string} inputDir - Directory containing XML files
     * @param {string} outputDir - Directory to save JSON files
     * @param {number} batchSize - Number of files to process in each batch
     * @returns {Promise<object>} Processing statistics
     */
    async processXmlToJsonBatch(inputDir, outputDir, batchSize = 10) {
        console.log('************** Batch XML to JSON processing started ********************');
        this.stats.startTime = Date.now();

        await FileUtils.ensureDir(outputDir);

        const files = FileUtils.listFiles(inputDir).filter((file) =>
            FileUtils.getStats(path.join(inputDir, file)).isFile()
        );

        console.log(`Processing ${files.length} files in batches of ${batchSize}`);

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            await this._processBatch(batch, inputDir, outputDir, i + 1);
        }

        this.stats.processingTime = ((Date.now() - this.stats.startTime) / 60000).toFixed(2);

        console.log(`Batch processing completed in ${this.stats.processingTime} minutes`);
        return this.stats;
    }

    /**
     * Processes a batch of files
     * @private
     */
    async _processBatch(batch, inputDir, outputDir, startIndex) {
        const promises = batch.map(async (file, index) => {
            const filePath = path.join(inputDir, file);
            const fileIndex = startIndex + index;

            try {
                const lineCount = await FileUtils.countLines(filePath);
                console.log(
                    `${fileIndex}/${this.stats.processedFiles + batch.length} ${file} / lines ${new Intl.NumberFormat('es-ES').format(lineCount)}`
                );

                this.stats.totalLines += lineCount;

                const xmlData = fs.readFileSync(filePath, 'utf8');
                const jsonResult = await this.xmlProcessor.parseXmlToJson(xmlData);

                const outputFile = file.replace('.atom', '.json');
                const outputPath = path.join(outputDir, outputFile);

                await FileUtils.writeJsonFile(outputPath, jsonResult);

                this.stats.processedFiles++;
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
                throw error;
            }
        });

        await Promise.all(promises);
    }

    /**
     * Processes JSON files to extract contract data
     * @param {string} inputDir - Directory containing JSON files
     * @param {RegExp} organizationFilter - Filter for organizations
     * @param {number} batchSize - Number of files to process in each batch
     * @returns {Promise<Array>} Array of extracted contract data
     */
    async processJsonBatch(inputDir, organizationFilter, batchSize = 20) {
        console.log('************** Batch JSON processing started ********************');
        const startTime = Date.now();

        const files = FileUtils.listFiles(inputDir);
        const allResults = [];

        console.log(`Processing ${files.length} JSON files in batches of ${batchSize}`);

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const batchResults = await this._processJsonBatch(batch, inputDir, organizationFilter, i + 1);
            allResults.push(...batchResults);
        }

        const processingTime = ((Date.now() - startTime) / 60000).toFixed(2);
        console.log(`JSON batch processing completed in ${processingTime} minutes`);

        return allResults;
    }

    /**
     * Processes a batch of JSON files
     * @private
     */
    async _processJsonBatch(batch, inputDir, organizationFilter, startIndex) {
        const results = [];

        const promises = batch.map(async (file, index) => {
            const filePath = path.join(inputDir, file);
            const fileIndex = startIndex + index;

            console.log(`${fileIndex}/${batch.length} ${file}`);

            try {
                const jsonData = await FileUtils.readJsonFile(filePath);
                const extractedData = this.xmlProcessor.extractContractData(jsonData, organizationFilter);
                return extractedData;
            } catch (error) {
                console.error(`Error processing JSON file ${file}:`, error);
                return [];
            }
        });

        const batchResults = await Promise.all(promises);
        batchResults.forEach((result) => results.push(...result));

        return results;
    }

    /**
     * Gets processing statistics
     * @returns {object} Processing statistics
     */
    getStats() {
        return { ...this.stats };
    }
}

module.exports = BatchProcessor;

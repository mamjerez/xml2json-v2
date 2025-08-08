const StreamZip = require('node-stream-zip');
const FileUtils = require('../utils/fileUtils');

class ZipProcessor {
    constructor() {
        this.extractedFiles = 0;
    }

    /**
     * Extracts ZIP file to specified directory
     * @param {string} zipFilePath - Path to ZIP file
     * @param {string} extractDir - Directory to extract to
     * @returns {Promise<number>} Number of extracted files
     */
    async extractZip(zipFilePath, extractDir) {
        console.log('************** extractZip inicio ********************');
        const start = Date.now();

        try {
            const zip = new StreamZip.async({ file: zipFilePath });

            // Ensure extraction directories exist
            await FileUtils.ensureDir(extractDir);
            await FileUtils.ensureDir(`${extractDir}/atom`);

            // Extract files
            this.extractedFiles = await zip.extract(null, `${extractDir}/atom`);

            await zip.close();

            const duration = ((Date.now() - start) / 60000).toFixed(2);
            console.log(`Extracted ${this.extractedFiles} files in ${duration} minutes`);

            return this.extractedFiles;
        } catch (error) {
            console.error('Error extracting ZIP:', error);
            throw error;
        }
    }

    /**
     * Gets the number of extracted files from last extraction
     * @returns {number} Number of extracted files
     */
    getExtractedFilesCount() {
        return this.extractedFiles;
    }
}

module.exports = ZipProcessor;

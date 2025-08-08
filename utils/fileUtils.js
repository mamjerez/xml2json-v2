const fs = require('fs').promises;
const fsSync = require('fs');

class FileUtils {
    /**
     * Ensures a directory exists, creates it if it doesn't
     * @param {string} dirPath - Path to directory
     */
    static async ensureDir(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    /**
     * Safely removes a directory and its contents
     * @param {string} dirPath - Path to directory
     */
    static async removeDir(dirPath) {
        try {
            if (fsSync.existsSync(dirPath)) {
                await fs.rm(dirPath, { recursive: true, force: true });
            }
        } catch (error) {
            console.error(`Error removing directory ${dirPath}:`, error);
        }
    }

    /**
     * Writes data to JSON file asynchronously
     * @param {string} filePath - Path to file
     * @param {any} data - Data to write
     */
    static async writeJsonFile(filePath, data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    /**
     * Reads and parses JSON file
     * @param {string} filePath - Path to file
     * @returns {Promise<any>} Parsed JSON data
     */
    static async readJsonFile(filePath) {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }

    /**
     * Checks if file exists
     * @param {string} filePath - Path to file
     * @returns {boolean} True if file exists
     */
    static fileExists(filePath) {
        return fsSync.existsSync(filePath);
    }

    /**
     * Lists files in directory
     * @param {string} dirPath - Path to directory
     * @returns {string[]} Array of file names
     */
    static listFiles(dirPath) {
        return fsSync.readdirSync(dirPath);
    }

    /**
     * Gets file stats
     * @param {string} filePath - Path to file
     * @returns {fs.Stats} File stats
     */
    static getStats(filePath) {
        return fsSync.lstatSync(filePath);
    }

    /**
     * Counts lines in a file asynchronously
     * @param {string} filePath - Path to file
     * @returns {Promise<number>} Number of lines
     */
    static async countLines(filePath) {
        return new Promise((resolve) => {
            const readLineFile = require('readline');
            const readInterface = readLineFile.createInterface({
                input: fsSync.createReadStream(filePath),
                console: false,
            });

            let count = 0;
            readInterface.on('line', () => count++);
            readInterface.on('close', () => resolve(count));
        });
    }
}

module.exports = FileUtils;

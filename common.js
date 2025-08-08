const FileUtils = require('./utils/fileUtils');

class Common {
    /**
     * Optimized search for repeated entries using Map for better performance
     * @param {Array} arrayData - Array of data to search for repeats
     * @returns {Object} Object containing repeat, repeatMajor, and noRepeat arrays
     */
    searchRepeat(arrayData) {
        const listRepeat = [];
        const listNoRepeat = [];
        const listRepeatMajor = [];
        const contractFolderMap = new Map();

        console.log('Resultados iniciales', arrayData.length);

        // First pass: group by ContractFolderID using Map for O(n) performance
        arrayData.forEach((item) => {
            const id = item.ContractFolderID;
            if (!contractFolderMap.has(id)) {
                contractFolderMap.set(id, []);
            }
            contractFolderMap.get(id).push(item);
        });

        // Second pass: classify items
        contractFolderMap.forEach((items, _contractFolderId) => {
            if (items.length > 1) {
                // Multiple items with same ID - they are repeats
                listRepeat.push(...items);

                // Find the most recent one
                const mostRecent = items.reduce((prev, current) => {
                    const dateItemPrev = new Date(prev.updated);
                    const dateItemCurrent = new Date(current.updated);
                    return dateItemPrev > dateItemCurrent ? prev : current;
                });

                listRepeatMajor.push(mostRecent);
                listNoRepeat.push(mostRecent);
            } else {
                // Single item - no repeat
                listNoRepeat.push(items[0]);
            }
        });

        console.log(
            `Found ${listRepeat.length} repeated items, ${listRepeatMajor.length} major repeats, ${listNoRepeat.length} unique items`
        );

        return {
            repeat: listRepeat,
            repeatMajor: listRepeatMajor,
            noRepeat: listNoRepeat,
        };
    }

    /**
     * Create file using FileUtils for consistent async operations
     * @param {string} filePath - Path to create file
     * @param {any} data - Data to write
     */
    async createFile(filePath, data) {
        await FileUtils.writeJsonFile(filePath, data);
    }

    /**
     * Create file synchronously (for backward compatibility)
     * @param {string} filePath - Path to create file
     * @param {any} data - Data to write
     */
    createFileSync(filePath, data) {
        const fs = require('fs');
        fs.writeFileSync(filePath, JSON.stringify(data), function (err) {
            if (err) throw err;
        });
    }

    /**
     * Get previous month with proper validation
     * @param {string|number} monthCurrent - Current month
     * @returns {string} Previous month as padded string
     */
    getOldMonth(monthCurrent) {
        let month = Number(monthCurrent);

        if (isNaN(month) || month < 1 || month > 12) {
            throw new Error(`Invalid month: ${monthCurrent}. Must be between 1 and 12.`);
        }

        console.log('Month before:', month);

        month = month - 1;
        if (month <= 0) {
            month = 12;
        }

        const paddedMonth = month < 10 ? `0${month}` : month.toString();
        console.log('Month after:', paddedMonth);

        return paddedMonth;
    }

    /**
     * Validates if a date string is valid
     * @param {string} dateString - Date string to validate
     * @returns {boolean} True if valid date
     */
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Formats number with Spanish locale
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }
}

module.exports = Common;

const path = require('path');
const fs = require('fs');

// Test script to verify file paths
const config = require('./config');

console.log('=== TESTING FILE PATHS ===');

const month = '06'; // Previous month
const year = config.YEAR; // Use year from config

// Test paths
const testPath = path.join(config.PATHS.TEST_RESULTS_BASE_PATH, `${year}-${month}`);
const normalPath = path.join(config.PATHS.APP_PATH, `${year}-${month}`);

console.log('Test path:', testPath);
console.log('Normal path:', normalPath);

// Check if directories exist
console.log('\nDirectory checks:');
console.log('Test dir exists:', fs.existsSync(testPath));
console.log('Normal dir exists:', fs.existsSync(normalPath));

// Check files - use year from config
const files = [`todo${month}${year}NoRepeatOkCIFOK.json`, `todoAdjudicatarias${month}${year}.json`];

console.log('\nFile checks:');
files.forEach((fileName) => {
    const testFilePath = path.join(testPath, fileName);
    const normalFilePath = path.join(normalPath, fileName);

    console.log(`${fileName}:`);
    console.log(`  Test: ${testFilePath} -> ${fs.existsSync(testFilePath)}`);
    console.log(`  Normal: ${normalFilePath} -> ${fs.existsSync(normalFilePath)}`);
});

console.log('\n=== END TEST ===');

# XML2JSON Copilot Instructions

This is a specialized Node.js application for processing Spanish public procurement data from XML (ATOM format) to optimized JSON with duplicate detection.

## Architecture Overview

- **Single-file orchestrator**: `index.js` contains the main `OptimizedXml2JsonApp` class with complete application logic
- **Modular processors**: `processors/` directory contains specialized batch processing for ZIP extraction, XML parsing, and JSON transformation
- **Centralized configuration**: All paths and constants in `config.js` with hardcoded Spanish data source paths
- **Dual-mode processing**: Handles both "licitaciones" (public tenders) and "contratos menores" (minor contracts) from separate ZIP files

## Essential Data Flow

1. **Input validation**: Upfront validation of all required files/directories before processing starts
2. **ZIP extraction** → **XML-to-JSON batch conversion** → **Organization filtering** → **Duplicate detection** → **Monthly merge**
3. **Test vs Production paths**: Application can save results to either test directory (`resultados_prueba/`) or production paths based on user input

## Key Development Patterns

### Batch Processing Convention

```javascript
// Standard batch processing pattern used throughout
await batchProcessor.processXmlToJsonBatch(inputDir, outputDir, 15); // 15 files at once
await batchProcessor.processJsonBatch(jsonDir, organizationFilter, 25); // 25 files at once
```

### Duplicate Detection Algorithm

- Uses `Map()` for O(n) performance instead of nested loops
- Groups by `ContractFolderID`, keeps most recent entry by `updated` field
- Returns three arrays: `repeat`, `repeatMajor`, `noRepeat`

### Error Handling Strategy

- **Validation-first**: All file dependencies validated before processing begins
- **Graceful degradation**: Missing files cause early exit with descriptive errors
- **Process-level handlers**: Uncaught exceptions and unhandled rejections terminate with exit code 1

### Path Resolution Logic

```javascript
// Dual-path priority system for finding previous month data
if (isTestMode) {
    primaryPath = testPath;
    secondaryPath = productionPath;
} else {
    primaryPath = productionPath;
    secondaryPath = testPath;
}
```

## Critical Configuration Points

- **Organization filtering**: Hardcoded regex in `config.js` for Jerez municipality entities
- **File naming convention**: `todo{month}{year}NoRepeatOkCIFOK.json` for main output files
- **ZIP file templates**: Parameterized paths with `FOLDER/PROCESS/MONTH` placeholders
- **Year constant**: Currently hardcoded to `2025` in config

## Interactive CLI Behavior

Application prompts for:

1. Month (2-digit format)
2. Create files (S/N) - determines whether to process ZIPs or just merge
3. Test mode (S/N) - controls output directory structure

## Performance Monitoring

- Built-in `PerformanceMonitor` class tracks timing and memory usage
- Reports processing time for each major phase (extractZip, parseXML2JSON, mapJSON)
- Line counting for XML files to track processing progress

## Common Gotchas

- **CIF processing**: `CIFrepeat.js` handles company identification normalization using previous month's data
- **Month dependencies**: Always requires previous month's data files to exist
- **Async file operations**: All FileUtils methods are Promise-based, avoid sync alternatives
- **State management**: `ApplicationState` class resets between process types but preserves `jsonFinalProcces`

## Key Files for Extension

- `processors/xmlProcessor.js`: Contains the XML-to-contract data extraction logic
- `common.js`: Core duplicate detection algorithm
- `config.js`: All hardcoded paths and organization filters
- `utils/fileUtils.js`: Async file operations wrapper

## Testing Strategy

Use test mode (`S` response) to save all outputs to `resultados_prueba/` directory without affecting production data paths.

## Samples best practices

https://medium.com/@priyanshu011109/%EF%B8%8F-node-js-in-2025-modern-practices-you-should-be-using-d5890f69f281

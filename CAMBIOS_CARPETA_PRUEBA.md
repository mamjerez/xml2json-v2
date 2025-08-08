# Modificación: Guardar Archivos en Carpeta de Prueba

## Cambios Realizados

### Problema Original

En modo de prueba, los archivos `todoAdjudicatarias[MES]2025.json` y `todo[MES]2025NoRepeatOkCIFOK.json` se guardaban siempre en `APP_PATH` independientemente del modo.

### Solución Implementada

#### 1. **index.js** - Modificación en `mergeJsonFinal()`

```javascript
// Determinar ruta de salida según modo de prueba
const outputPath = isTestMode.toUpperCase() === 'S' ? config.PATHS.TEST_RESULTS_PATH : config.PATHS.APP_PATH;

// Pasar ruta de salida a ambos métodos
searchRepeatInstance.saveResultRepeat(
    existingData.length,
    repeatJsonMerge.repeat,
    repeatJsonMerge.noRepeat,
    repeatJsonMerge.repeatMajor,
    responseMonth,
    outputPath // ← Nueva ruta dinámica
);

cifrepeatInstance.question(repeatJsonMerge.noRepeat, responseMonth, config.PATHS.APP_PATH, outputPath);
//                                                                                   ↑                    ↑
//                                                                              Leer desde            Escribir a
//                                                                              (siempre APP_PATH)    (según modo)
```

#### 2. **searchRepeat.js** - Modificación en `saveResultRepeat()`

```javascript
// Nuevo parámetro outputPath
saveResultRepeat(dataInitial, listRepeat, listNoRepeat, listRepeatMajor, monthSelected, outputPath) {
    // Usar outputPath si se proporciona, sino usar ruta por defecto
    const pathRepeat = outputPath
        ? `${outputPath}/${monthSelected}`
        : 'C:/Users/Usuario/OneDrive/.../searchRepeat.js/2025/' + monthSelected;

    // Crear directorio recursivamente si no existe
    if (!fs.existsSync(pathRepeat)) {
        fs.mkdirSync(pathRepeat, { recursive: true });
    }
}
```

#### 3. **CIFrepeat.js** - Separación de Rutas de Lectura y Escritura

```javascript
// Nuevo método con dos parámetros de ruta
question(dataInitial, monthSelected, readPath, writePath) {
    // Leer archivo del mes anterior desde readPath (siempre APP_PATH)
    const adjudicatariasFile = `${readPath}/todoAdjudicatarias${month}2025.json`;

    // Escribir archivos del mes actual en writePath (según modo de prueba)
    commonInstance.createFile(`${writePath}/todoAdjudicatarias${monthSelected}2025.json`, adjudicatarias);
    commonInstance.createFile(`${writePath}/todo${monthSelected}2025NoRepeatOkCIFOK.json`, dataInitial);
}
```

### Comportamiento Resultante

- **Leer archivos anteriores**: `D:/licitaciones/src/assets/data/` (siempre)
- **Guardar archivos nuevos**: `D:/licitaciones/src/assets/data/`

#### Modo Prueba (S)

- **Leer archivos anteriores**: `D:/licitaciones/src/assets/data/` (siempre)
- **Guardar archivos nuevos**: `D:/xml2json-v2/resultados_prueba/[MES]/`

### Archivos Afectados

1. **`todoAdjudicatarias[MES]2025.json`** - Se guarda en carpeta según modo
2. **`todo[MES]2025NoRepeatOkCIFOK.json`** - Se guarda en carpeta según modo
3. **`repeat[MES]2025.json`** - Se guarda en carpeta según modo
4. **`repeatMajor[MES]2025.json`** - Se guarda en carpeta según modo
5. **`todo[MES]2025NoRepeatOK.json`** - Se guarda en carpeta según modo

### Validación

- Los archivos del mes anterior siempre se leen desde `APP_PATH`
- La validación no cambia (sigue siendo estricta)
- Solo cambia dónde se guardan los archivos del mes actual

## Resultado Final

En modo de prueba, todos los archivos del mes actual se guardan en la carpeta unificada de prueba, facilitando la organización y limpieza posterior.

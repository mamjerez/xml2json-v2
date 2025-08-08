# Estructura de Resultados - XML2JSON App

## Estructura Simplificada

Se ha simplificado la estructura de directorios para que todos los resultados se guarden en una única carpeta nombrada con el formato **`año-mes`**.

### Estructura en Modo Prueba

Cuando selecciones **"¿Es una prueba? S"**, los archivos se organizarán en:

```
D:\xml2json-v2\resultados_prueba\
├── 2025-01/  # Enero 2025
│   ├── final.json
│   ├── repeat.json
│   ├── repeatMajor.json
│   ├── finalNoRepeat.json
│   ├── logFinal.json
│   ├── repeat012025.json
│   ├── repeatMajor012025.json
│   ├── todo012025NoRepeatOK.json
│   ├── logFinal012025.json
│   ├── todoAdjudicatarias012025.json
│   ├── todo012025NoRepeatOkCIFOK.json
│   └── nuevasAdjudicatarias012025.json
├── 2025-02/  # Febrero 2025
├── 2025-03/  # Marzo 2025
└── ...
```

### Estructura en Modo Normal

Cuando selecciones **"¿Es una prueba? N"**, los archivos se guardarán en:

```
D:\licitaciones\src\assets\data\
├── 2025-01/  # Enero 2025
│   ├── [mismos archivos que en modo prueba]
├── 2025-02/  # Febrero 2025
└── ...
```

## Descripción de Archivos por Carpeta año-mes

### Archivos de Procesamiento Individual por Tipo

- **final.json**: Resultados finales del último tipo procesado (licitaciones o contratos menores)
- **repeat.json**: Registros con duplicados encontrados
- **repeatMajor.json**: Registros duplicados con fecha más reciente
- **finalNoRepeat.json**: Registros sin duplicados
- **logFinal.json**: Estadísticas del procesamiento

### Archivos de Fusión Mensual

- **repeat[MM]2025.json**: Todos los duplicados del mes
- **repeatMajor[MM]2025.json**: Duplicados con fecha más reciente del mes
- **todo[MM]2025NoRepeatOK.json**: Todos los registros sin duplicados del mes
- **logFinal[MM]2025.json**: Log de estadísticas del mes completo

### Archivos de Adjudicatarias

- **todoAdjudicatarias[MM]2025.json**: Todas las adjudicatarias del mes
- **todo[MM]2025NoRepeatOkCIFOK.json**: Archivo final con CIFs procesados
- **nuevasAdjudicatarias[MM]2025.json**: Nuevas adjudicatarias encontradas en el mes

## Ventajas de la Nueva Estructura

1. **Simplificación máxima**: Una sola carpeta por mes
2. **Nomenclatura clara**: Formato `año-mes` fácil de identificar
3. **Menos subcarpetas**: Todo en el mismo nivel
4. **Fácil navegación**: No hay que buscar en múltiples subcarpetas
5. **Compatibilidad**: Funciona tanto en modo prueba como normal

## Funcionamiento

- Si es **modo normal**: Los archivos se guardan en `D:\licitaciones\src\assets\data\año-mes\`
- Si es **modo prueba (S)**: Los archivos se guardan en `D:\xml2json-v2\resultados_prueba\año-mes\`
- **Ambos tipos** de procesamiento (licitaciones y contratos menores) van a la **misma carpeta**
- **Todos los archivos** finales, de fusión y de adjudicatarias van a la **misma carpeta**

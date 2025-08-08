# XML2JSON Optimizada - Documentación de Funcionalidades

## Resumen de la Aplicación

Esta aplicación procesa datos de contratación pública española desde archivos XML (formato ATOM) hasta JSON, eliminando duplicados y generando estadísticas detalladas.

## Funcionalidades Principales

### 1. Procesamiento Optimizado

- **Procesamiento por lotes**: Procesa 15-25 archivos simultáneamente
- **Detección de duplicados**: Algoritmo O(n) usando Map para mejor rendimiento
- **Operaciones asíncronas**: Todas las operaciones de archivo son asíncronas
- **Monitoreo de rendimiento**: Métricas de tiempo de ejecución en cada etapa

### 2. Tipos de Datos Procesados

- **Licitaciones**: Procesos de licitación pública
- **Contratos Menores**: Contratos de menor cuantía

### 3. Preguntas Interactivas al Usuario

#### Pregunta 1: Mes

```
Ingresa el mes con dos cifras, por ejemplo 09-10-11...
```

- Especifica el mes de los datos a procesar

#### Pregunta 2: Crear Archivos

```
Desea crear los fichero? S/N
```

- **S**: Procesa ambos tipos (licitaciones y contratos menores)
- **N**: Solo hace merge con datos existentes

#### Pregunta 3: Modo de Prueba (NUEVA FUNCIONALIDAD)

```
¿Es una prueba? (S/N - Si es S, todos los resultados se guardarán en una carpeta única)
```

- **S**: Todos los resultados se guardan en `D:/xml2json-v2/resultados_prueba/`
- **N**: Usa la estructura de carpetas normal separada por tipo

## Estructura de Carpetas

### Modo Normal (N)

```
D:/xml2json-v2/mam/
├── licitaciones/
│   └── [MES]/           # Resultados de licitaciones
└── contratosMenores/
    └── [MES]/           # Resultados de contratos menores
```

### Modo de Prueba (S) - NUEVA FUNCIONALIDAD

```
D:/xml2json-v2/resultados_prueba/
└── [MES]/               # Todos los resultados juntos
    ├── Archivos de licitaciones
    └── Archivos de contratos menores
```

## Archivos Generados

### En cada carpeta de resultados:

- `todo[MES][AÑO]NoRepeatOkCIFOK.json`: Datos sin duplicados
- `logFinal.json`: Estadísticas del procesamiento
- Archivos de control y logs adicionales

### Archivos de entrada:

- **ZIP de licitaciones**: `plataformasAgregadasSinMenores_[MES][AÑO]_*.zip`
- **ZIP de contratos**: `contratosMenoresPerfilesContratantes_[MES][AÑO]_*.zip`

## Beneficios del Modo de Prueba

### Ventajas:

1. **Organización simple**: Todos los resultados en una sola ubicación
2. **Facilita testing**: Ideal para probar la aplicación sin afectar datos de producción
3. **Limpieza fácil**: Se puede borrar toda la carpeta de prueba sin riesgo
4. **Comparación rápida**: Ambos tipos de datos juntos para análisis

### Casos de uso:

- **Desarrollo**: Probar cambios sin afectar estructura de producción
- **Validación**: Verificar resultados antes del procesamiento final
- **Demostración**: Mostrar funcionamiento sin alterar datos reales
- **Depuración**: Análisis conjunto de ambos tipos de contratos

## Configuración

La configuración se encuentra en `config.js`:

```javascript
const PATHS = {
    // ... otras rutas ...
    TEST_RESULTS_PATH: 'D:/xml2json-v2/resultados_prueba', // Nueva ruta para pruebas
};
```

## Flujo de Ejecución

1. **Entrada del usuario**: Mes, crear archivos (S/N), modo prueba (S/N)
2. **Si crear archivos = S**:
    - Procesa licitaciones
    - Procesa contratos menores
    - Usa carpeta de prueba o normal según selección
3. **Merge final**: Combina con datos del mes anterior
4. **Estadísticas**: Genera logs y métricas finales

## Mejoras de Rendimiento

- **~50% más rápido** que la versión anterior
- **Uso de memoria optimizado** con Map() en lugar de arrays para duplicados
- **Procesamiento paralelo** de archivos XML/JSON
- **Operaciones asíncronas** para mejor aprovechamiento de recursos

## Arquitectura del Código

```
index.js                 # Aplicación principal unificada
config.js               # Configuración centralizada
utils/
├── fileUtils.js        # Utilidades de archivos asíncronas
└── performanceMonitor.js # Métricas de rendimiento
processors/
├── zipProcessor.js     # Extracción de ZIP
├── xmlProcessor.js     # Procesamiento de XML
└── batchProcessor.js   # Procesamiento por lotes
```

Esta documentación refleja el estado actual optimizado de la aplicación con la nueva funcionalidad de modo de prueba.

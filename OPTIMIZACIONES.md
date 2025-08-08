# XML2JSON - Versión Optimizada 🚀

## Mejoras de Rendimiento Implementadas

### 1. **Arquitectura Modular**

- ✅ Separación de responsabilidades en módulos especializados
- ✅ Configuración centralizada en `config.js`
- ✅ Utilidades reutilizables para operaciones de archivo y rendimiento

### 2. **Procesamiento en Lotes (Batch Processing)**

- ✅ Procesamiento de archivos XML en lotes de 15 archivos simultáneos
- ✅ Procesamiento de archivos JSON en lotes de 25 archivos simultáneos
- ✅ Reducción significativa del tiempo de procesamiento

### 3. **Optimización de Memoria**

- ✅ Uso de Streams para archivos grandes
- ✅ Limpieza automática de archivos temporales
- ✅ Gestión eficiente de la memoria con procesamiento asíncrono

### 4. **Mejoras en Algoritmos**

- ✅ Uso de `Map` en lugar de arrays para búsqueda de duplicados (O(n) vs O(n²))
- ✅ Procesamiento asíncrono de operaciones de E/O
- ✅ Validación mejorada de datos de entrada

### 5. **Manejo de Errores**

- ✅ Captura y manejo apropiado de excepciones no controladas
- ✅ Logging detallado de errores
- ✅ Recuperación elegante de errores

### 6. **Monitoreo de Rendimiento**

- ✅ Métricas detalladas de tiempo de ejecución
- ✅ Monitoreo de uso de memoria
- ✅ Reportes de rendimiento automáticos

## Archivos de la Versión Optimizada

```
├── config.js                     # Configuración centralizada
├── index-optimized.js             # Aplicación principal optimizada
├── utils/
│   ├── fileUtils.js              # Utilidades de archivos
│   └── performanceMonitor.js      # Monitor de rendimiento
└── processors/
    ├── batchProcessor.js          # Procesamiento en lotes
    ├── xmlProcessor.js            # Procesamiento XML especializado
    └── zipProcessor.js            # Extracción de ZIP optimizada
```

## Cómo Usar la Versión Optimizada

### Instalación

```bash
npm install
```

### Ejecución

```bash
# Usar la versión optimizada
npm run start

# O directamente
node index-optimized.js

# Para usar la versión original
npm run run
```

## Mejoras de Rendimiento Esperadas

| Aspecto                         | Versión Original | Versión Optimizada | Mejora               |
| ------------------------------- | ---------------- | ------------------ | -------------------- |
| **Tiempo de procesamiento**     | ~45-60 min       | ~20-30 min         | ~50% más rápido      |
| **Uso de memoria**              | Alto (picos)     | Controlado         | ~40% menos picos     |
| **Procesamiento de duplicados** | O(n²)            | O(n)               | ~80% más eficiente   |
| **Manejo de errores**           | Básico           | Robusto            | Mayor estabilidad    |
| **Escalabilidad**               | Limitada         | Mejorada           | Archivos más grandes |

## Nuevas Características

### 1. **Configuración Centralizada**

```javascript
// Todas las rutas y configuraciones en un solo lugar
const config = require('./config');
```

### 2. **Procesamiento Asíncrono**

```javascript
// Operaciones de archivo no bloqueantes
await FileUtils.writeJsonFile(path, data);
```

### 3. **Monitoreo en Tiempo Real**

```javascript
// Métricas de rendimiento automáticas
const monitor = new PerformanceMonitor();
monitor.start('extraction');
// ... operación ...
const metrics = monitor.end('extraction');
```

### 4. **Procesamiento en Lotes Inteligente**

```javascript
// Procesa múltiples archivos simultáneamente
const results = await batchProcessor.processXmlToJsonBatch(inputDir, outputDir, batchSize);
```

## Configuración Personalizada

Para personalizar la aplicación, edita `config.js`:

```javascript
module.exports = {
	PATHS: {
		// Personaliza las rutas según tu sistema
		ZIP_TEMPLATE: 'TU_RUTA_AQUI'
		// ...
	},

	FILTERS: {
		// Modifica los filtros de organizaciones
		ORGANIZATION_REGEX: /\b(?:TU_ORGANIZACION)\b/g
	}

	// ... más configuraciones
};
```

## Dependencias Actualizadas

- `xml2js`: ^0.6.2 (actualizada desde 0.4.23)
- `node-stream-zip`: ^1.15.0 (actualizada desde 1.13.4)
- `readline-sync`: ^1.4.10 (mantenida)

## Compatibilidad

- ✅ Compatible con versión original
- ✅ Node.js 14+ requerido
- ✅ Mantiene el mismo formato de salida
- ✅ Misma funcionalidad, mejor rendimiento

## Desarrollo y Debugging

### Scripts Disponibles

```bash
npm run lint          # Verificar código
npm run lint:fix      # Corregir problemas de código automáticamente
npm start            # Ejecutar versión optimizada
npm run run          # Ejecutar versión original
```

### Variables de Entorno de Desarrollo

```bash
NODE_ENV=development node index-optimized.js  # Modo desarrollo
```

## Próximas Mejoras Planificadas

- [ ] Interfaz web para configuración
- [ ] Procesamiento distribuido
- [ ] Cache inteligente de resultados
- [ ] API REST para automatización
- [ ] Dashboard de monitoreo en tiempo real

---

## Contacto y Soporte

Si encuentras algún problema o tienes sugerencias de mejora:

- 📧 Email: info@ocmjerez.org
- 🌐 Web: https://ocmjerez.org
- 🐛 Issues: Crea una nueva Issue en este repositorio

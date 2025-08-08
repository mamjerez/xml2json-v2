# 📁 Guía de Carpetas y Archivos - XML2JSON

## 🎯 **Resumen de Ubicaciones**

### **Archivos de Entrada:**

- **ZIP Licitaciones:** `C:/Users/Usuario/OneDrive/OCM/.../licitaciones/2025/licitacionesPerfilesContratanteCompleto3_2025[MES].zip`
- **ZIP Contratos:** `C:/Users/Usuario/OneDrive/OCM/.../contratos menores/2025/contratosMenoresPerfilesContratantes_2025[MES].zip`

### **Resultados Intermedios:**

- **Carpeta:** `C:/Users/Usuario/OneDrive/OCM/.../[licitaciones|contratos menores]/2025/resultados/[MES]/`
- **Archivos generados:**
  - `final.json` - Todos los datos procesados
  - `finalNoRepeat.json` - Datos sin duplicados
  - `repeat.json` - Duplicados encontrados
  - `repeatMajor.json` - Duplicados más recientes
  - `logFinal.json` - Estadísticas del proceso

### **Resultados Finales de la App:**

- **Carpeta:** `D:/licitaciones/src/assets/data/`
- **Archivos generados:**
  - `todo[MES]2025NoRepeatOkCIFOK.json` - Datos finales sin duplicados
  - `todoAdjudicatarias[MES]2025.json` - Lista completa de adjudicatarios
  - `nuevasAdjudicatarias[MES]2025.json` - Nuevos adjudicatarios del mes

### **Análisis de Duplicados:**

- **Carpeta:** `C:/Users/Usuario/OneDrive/OCM/.../Tratados con searchRepeat.js/2025/[MES]/`
- **Archivos generados:**
  - `repeat[MES]2025.json` - Duplicados encontrados
  - `repeatMajor[MES]2025.json` - Duplicados más recientes
  - `todo[MES]2025NoRepeatOK.json` - Datos sin duplicados
  - `logFinal[MES]2025.json` - Log del proceso

## ⚙️ **Personalizar Ubicaciones**

Para cambiar las rutas, edita el archivo `config.js`:

```javascript
module.exports = {
	PATHS: {
		// Cambia estas rutas según tu estructura de carpetas
		ZIP_TEMPLATE: 'TU_RUTA_ZIPS/FOLDER/2025/PROCCESS_2025MONTH.zip',
		RESULTS_TEMPLATE: 'TU_RUTA_RESULTADOS/FOLDER/2025/resultados',
		APP_PATH: 'TU_RUTA_APP/src/assets/data',
		SEARCH_REPEAT_PATH: 'TU_RUTA_ANALISIS/2025',

		// Estas no necesitan cambios (carpetas temporales)
		EXTRACTED_DIR: './extracted',
		EXTRACTED_ATOM_DIR: './extracted/atom',
		EXTRACTED_JSON_DIR: './extracted/json'
	},

	// Personaliza los filtros de organizaciones
	FILTERS: {
		ORGANIZATION_REGEX: /\b(?:TU_ORGANIZACION|OTRA_ORG)\b/g
	}
};
```

## 📝 **Notas Importantes:**

1. **[MES]** se reemplaza por el mes que introduzcas (ej: 01, 02, 03...)
2. **Las carpetas temporales** (`./extracted/`) se crean y eliminan automáticamente
3. **Los archivos finales** se guardan en tres ubicaciones diferentes para diferentes propósitos
4. **Todas las rutas** son configurables en `config.js`

## 🔍 **Ejemplo para Enero (MES=01):**

```
Resultados generados:
├── C:/Users/Usuario/OneDrive/OCM/.../licitaciones/2025/resultados/01/final.json
├── C:/Users/Usuario/OneDrive/OCM/.../contratos menores/2025/resultados/01/final.json
├── D:/licitaciones/src/assets/data/todo012025NoRepeatOkCIFOK.json
└── C:/Users/Usuario/OneDrive/OCM/.../Tratados con searchRepeat.js/2025/01/repeat012025.json
```

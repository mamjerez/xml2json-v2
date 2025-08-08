# Sistema de Validación de Archivos y Carpetas

## Descripción

Se ha agregado un sistema de validación completo que verifica la existencia de todos los archivos y carpetas necesarios **antes** de iniciar el procesamiento. Esto evita errores después de haber procesado durante minutos u horas.

## ¿Cuándo se ejecuta?

La validación se ejecuta **inmediatamente después** de que el usuario responde las tres preguntas:

1. Mes a procesar
2. ¿Crear archivos? (S/N)
3. ¿Es una prueba? (S/N)

## Validaciones Realizadas

### 1. 📁 Directorios Obligatorios

- `APP_PATH`: `D:/licitaciones/src/assets/data`
- `SEARCH_REPEAT_PATH`: Carpeta para archivos tratados con searchRepeat.js

### 2. 📦 Archivos ZIP (solo si "Crear archivos" = S)

- ZIP de licitaciones: `plataformasAgregadasSinMenores_[MES]2025_*.zip`
- ZIP de contratos menores: `contratosMenoresPerfilesContratantes_[MES]2025_*.zip`

### 3. 📄 Archivos del Mes Anterior (OBLIGATORIOS)

- `todo[MES_ANTERIOR]2025NoRepeatOkCIFOK.json` (principal)
- `todoAdjudicatarias[MES_ANTERIOR]2025.json` (adjudicatarias)

**Importante**: Estos archivos son **OBLIGATORIOS**. Si cualquiera de ellos no existe, el proceso se detiene completamente.

### 4. 📁 Carpeta de Prueba (solo en modo prueba)

- Se crea automáticamente si no existe: `D:/xml2json-v2/resultados_prueba`

## Resultados de la Validación

### ✅ Validación Exitosa

```
************** VALIDANDO ARCHIVOS Y CARPETAS NECESARIOS ********************
✅ Directory found: D:/licitaciones/src/assets/data
✅ Directory found: C:/Users/Usuario/OneDrive/.../searchRepeat.js/2025
✅ ZIP file found: C:/Users/Usuario/.../licitaciones/2025/plataformasAgregadas...
✅ ZIP file found: C:/Users/Usuario/.../contratos menores/2025/contratosMenores...
✅ Previous month file found: D:/licitaciones/.../todo062025NoRepeatOkCIFOK.json
✅ Previous month file found: D:/licitaciones/.../todoAdjudicatarias062025.json

✅ VALIDACIÓN COMPLETADA - Todos los archivos y carpetas necesarios están disponibles
```

### ❌ Validación con Errores

```
************** VALIDANDO ARCHIVOS Y CARPETAS NECESARIOS ********************
✅ Directory found: D:/licitaciones/src/assets/data
❌ Required directory missing: C:/Users/Usuario/OneDrive/.../searchRepeat.js/2025
❌ Required ZIP file missing: C:/Users/Usuario/.../licitaciones/2025/plataformas...
❌ Required previous month file missing: D:/licitaciones/.../todo062025NoRepeatOkCIFOK.json

❌ ERRORES DE VALIDACIÓN ENCONTRADOS:
❌ Required directory missing: C:/Users/Usuario/OneDrive/.../searchRepeat.js/2025
❌ Required ZIP file missing: C:/Users/Usuario/.../licitaciones/2025/plataformas...
❌ Required previous month file missing: D:/licitaciones/.../todo062025NoRepeatOkCIFOK.json

🛑 Proceso terminado. Resuelva los errores antes de continuar.
```

## Beneficios

### 🚀 Detección Temprana

- Los errores se detectan **antes** del procesamiento
- No se pierden minutos/horas de trabajo
- Feedback inmediato al usuario

### 🔧 Información Detallada

- Lista exacta de archivos faltantes
- Rutas completas para facilitar la resolución
- Diferencia entre errores críticos y advertencias

### 🛡️ Proceso Robusto

- El procesamiento solo inicia si todo está correcto
- Manejo graceful de archivos del mes anterior faltantes
- Creación automática de carpetas necesarias

## Archivos Modificados

### `index.js`

- ✅ Agregado método `validateRequiredFilesAndFolders()`
- ✅ Validación automática en `ejecutaTodo()`
- ✅ Terminación controlada en caso de errores

### `CIFrepeat.js`

- ✅ Verificación de existencia antes de leer `todoAdjudicatarias[MES].json`
- ✅ Manejo graceful cuando el archivo no existe
- ✅ Mensajes informativos sobre el estado del archivo

## Casos de Uso

### Primer Mes del Año

- Los archivos del mes anterior (diciembre del año pasado) pueden no existir
- El sistema inicia con datos vacíos y continúa normalmente
- Se muestran advertencias informativas

### Archivos ZIP Faltantes

- Error crítico que detiene el proceso
- Usuario debe localizar/descargar los archivos ZIP necesarios
- Rutas exactas mostradas en el error

### Directorios Faltantes

- Error crítico que detiene el proceso
- Usuario debe crear los directorios o verificar la configuración
- Especialmente importante para `APP_PATH` y `SEARCH_REPEAT_PATH`

Este sistema garantiza que todos los recursos necesarios estén disponibles antes de iniciar el procesamiento, evitando fallos tardíos y ahorrando tiempo valioso del usuario.

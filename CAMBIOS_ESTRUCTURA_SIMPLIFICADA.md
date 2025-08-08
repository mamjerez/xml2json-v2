# Cambios en la Estructura de Directorios

## Resumen de los Cambios

Se ha simplificado la estructura de directorios para guardar todos los resultados en una única carpeta nombrada con formato `año-mes`.

## Estructura ANTERIOR (compleja)

### Modo Prueba

```
resultados_prueba/
├── 2025/
│   ├── 01/
│   │   ├── licitaciones/
│   │   ├── contratos_menores/
│   │   ├── finales/
│   │   └── adjudicatarias/
```

### Modo Normal

```
[Rutas originales configuradas]/
├── licitaciones/2025/resultados/01/
├── contratos menores/2025/resultados/01/
```

## Estructura NUEVA (simplificada)

### Modo Prueba

```
resultados_prueba/
├── 2025-01/  # Todos los archivos aquí
├── 2025-02/  # Todos los archivos aquí
```

### Modo Normal

```
D:/licitaciones/src/assets/data/
├── 2025-01/  # Todos los archivos aquí
├── 2025-02/  # Todos los archivos aquí
```

## Archivos Modificados

### 1. `index.js`

- **Método `buildPaths()`**: Simplificado para generar una única carpeta `año-mes`
- **Método `validateRequiredFilesAndFolders()`**: Actualizado para buscar archivos en la nueva estructura
- **Método `mergeJsonFinal()`**: Simplificado para usar una sola carpeta de salida

### 2. `searchRepeat.js`

- **Método `saveResultRepeat()`**: Eliminada la creación de subcarpetas, usa directamente la carpeta proporcionada

### 3. `CIFrepeat.js`

- **Método `logFinal()`**: Actualizado para usar la ruta proporcionada en lugar de rutas hardcodeadas

### 4. `ESTRUCTURA_RESULTADOS.md`

- Reescrito completamente para reflejar la nueva estructura simplificada

## Ventajas de los Cambios

1. **Máxima simplicidad**: Una sola carpeta por mes
2. **Menos navegación**: No hay que buscar en subcarpetas
3. **Nomenclatura clara**: `2025-01`, `2025-02`, etc.
4. **Uniformidad**: Tanto modo prueba como normal usan la misma lógica
5. **Mantenibilidad**: Menos complejidad en el código

## Compatibilidad

- ✅ **Mantiene compatibilidad** con archivos existentes
- ✅ **Busca archivos del mes anterior** en ambas estructuras (anterior y nueva)
- ✅ **Funciona en modo prueba y normal**
- ✅ **Procesa licitaciones y contratos menores** en la misma carpeta

## Ejemplo de Ejecución

Para el mes `07` (julio) y año `2025`:

**Antes:**

- `resultados_prueba/2025/07/licitaciones/`
- `resultados_prueba/2025/07/contratos_menores/`
- `resultados_prueba/2025/07/finales/`
- `resultados_prueba/2025/07/adjudicatarias/`

**Ahora:**

- `resultados_prueba/2025-07/` ← **Todo aquí**

## Testing

Para verificar que los cambios funcionan correctamente:

1. Ejecutar la aplicación en modo prueba (`S`)
2. Verificar que se crean las carpetas con formato `año-mes`
3. Comprobar que todos los archivos se generan en la misma carpeta
4. Validar que la fusión con el mes anterior funciona correctamente

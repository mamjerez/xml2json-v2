# Estructura de Resultados - XML2JSON App

## Estructura Organizacional en Modo Prueba

Cuando selecciones **"¿Es una prueba? S"**, los archivos se organizarán automáticamente en la siguiente estructura:

```
D:\xml2json-v2\resultados_prueba\
├── 2025/
│   ├── 01/  # Enero
│   │   ├── licitaciones/
│   │   │   ├── 2025enero_licitacionesPerfilesContratanteCompleto3.json
│   │   │   └── otros archivos de licitaciones...
│   │   ├── contratos_menores/
│   │   │   ├── 2025enero_contratosMenoresPerfilesContratantes.json
│   │   │   └── otros archivos de contratos menores...
│   │   ├── finales/
│   │   │   ├── todo012025NoRepeatOkCIFOK.json
│   │   │   └── todoAdjudicatarias012025.json
│   │   └── adjudicatarias/
│   │       └── nuevasAdjudicatarias012025.json
│   ├── 02/  # Febrero
│   ├── 03/  # Marzo
│   └── ...
```

## Descripción de Carpetas

### Por Mes (01, 02, 03, etc.)

- **licitaciones/**: Contiene todos los archivos JSON procesados de licitaciones
- **contratos_menores/**: Contiene todos los archivos JSON procesados de contratos menores
- **finales/**: Archivos finales fusionados sin duplicados
- **adjudicatarias/**: Archivos de adjudicatarias procesadas

## Ventajas de esta Organización

1. **Separación clara** por tipo de proceso (licitaciones vs contratos menores)
2. **Organización temporal** por mes y año
3. **Fácil localización** de archivos específicos
4. **No mezcla** de archivos de diferentes meses
5. **Estructura escalable** para múltiples años

## Funcionamiento

- Si es **modo normal**: Los archivos se guardan en las carpetas originales configuradas
- Si es **modo prueba (S)**: Los archivos se organizan automáticamente en `resultados_prueba/` con la estructura mostrada arriba

## Archivos Clave por Carpeta

### finales/

- `todoXXXXXNoRepeatOkCIFOK.json`: Archivo final consolidado sin duplicados
- `todoAdjudicatariasXXXXX.json`: Archivo de adjudicatarias consolidado

### adjudicatarias/

- `nuevasAdjudicatariasXXXXX.json`: Nuevas adjudicatarias del mes procesado

### licitaciones/ y contratos_menores/

- Archivos JSON individuales procesados de cada tipo
- Mantienen la nomenclatura original del sistema

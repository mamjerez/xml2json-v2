// Configuration constants to avoid hardcoded paths and values
module.exports = {
    PATHS: {
        ZIP_TEMPLATE:
            'C:/Users/Usuario/OneDrive/OCM/Plataforma de contratacion del sector publico/Datos abiertos/FOLDER/2025/PROCCESS_2025MONTH.zip',
        RESULTS_TEMPLATE:
            'C:/Users/Usuario/OneDrive/OCM/Plataforma de contratacion del sector publico/Datos abiertos/FOLDER/2025/resultados',
        APP_PATH: 'D:/licitaciones/src/assets/data',
        SEARCH_REPEAT_PATH:
            'C:/Users/Usuario/OneDrive/OCM/Plataforma de contratacion del sector publico/Datos abiertos/Tratados con searchRepeat.js/2025',
        // Nueva carpeta unificada para pruebas con estructura organizacional
        TEST_RESULTS_BASE_PATH: 'D:/xml2json-v2/resultados_prueba',
        EXTRACTED_DIR: './extracted',
        EXTRACTED_ATOM_DIR: './extracted/atom',
        EXTRACTED_JSON_DIR: './extracted/json',
    },

    FILTERS: {
        // Regular expression for filtering organizations
        ORGANIZATION_REGEX:
            /\b(?:Junta de Gobierno Local del Ayuntamiento de Jerez|Patronato de la Fundación Centro de Acogida San José|Empresa Municipal de la Vivienda de Jerez|COMUJESA|FUNDARTE|MERCAJEREZ)\b/g,
    },

    PROCESS_TYPES: {
        LICITACIONES: 1,
        CONTRATOS_MENORES: 2,
    },

    FILE_NAMES: {
        LICITACIONES: {
            FOLDER: 'licitaciones',
            PROCESS: 'licitacionesPerfilesContratanteCompleto3',
        },
        CONTRATOS_MENORES: {
            FOLDER: 'contratos menores',
            PROCESS: 'contratosMenoresPerfilesContratantes',
        },
    },

    YEAR: '2025',
};

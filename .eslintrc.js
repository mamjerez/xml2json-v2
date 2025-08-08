module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        // Code quality
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off', // Allow console for this CLI app
        'prefer-const': 'error',
        'no-var': 'error',

        // Async/await best practices
        'prefer-promise-reject-errors': 'error',
        'no-async-promise-executor': 'error',

        // Performance
        'no-loop-func': 'error',

        // Prettier integration
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                tabWidth: 4,
                useTabs: false,
                semi: true,
                trailingComma: 'es5',
                printWidth: 120,
            },
        ],
    },
    overrides: [
        {
            files: ['config.js'],
            rules: {
                'no-unused-vars': 'off', // Config file may have unused exports
            },
        },
    ],
};

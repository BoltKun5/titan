module.exports = {
    // Global ESLint Settings
    // =================================
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },

    // ===========================================
    // Set up ESLint for .js / .jsx files
    // ===========================================
    // .js / .jsx uses babel-eslint
    parser: 'babel-eslint',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },

    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            typescript: {},
            "babel-module": {
                root: ["."],
                alias: {
                    "~/static": "./public/static/",
                    "~": "./",
                },
            },
        },
    },

    // Extend Other Configs
    // =================================
    extends: [
        "prettier"
    ],
    rules: {
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },

    // =================================
    // Overrides for Specific Files
    // =================================
    overrides: [
        // Match TypeScript Files
        // =================================
        {
            globals: {
                Atomics: "readonly",
                SharedArrayBuffer: "readonly"
            },

            files: ['*.ts', '*.tsx'],

            // Parser Settings
            // =================================
            // allow ESLint to understand TypeScript syntax
            // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L10
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },

            settings: {
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".tsx"],
                },
                "import/resolver": {
                    typescript: {
                        project: "./tsconfig.json",
                    },
                },
            },
            // Plugins
            // =================================
            plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint', 'prettier'],

            // Extend Other Configs
            // =================================
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
            ],
            rules: {
                "@typescript-eslint/indent": ["error", 2],
                'react/react-in-jsx-scope': 'off',
                'react/prop-types': [0],
                "@typescript-eslint/no-explicit-any": "off"
            },
        },
    ],
};
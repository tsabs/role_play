import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginImport from 'eslint-plugin-import';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                __DEV__: true,
            },
        },
        plugins: {
            // js,
            '@typescript-eslint': tseslint.plugin,
            react: pluginReact,
            // 'react-native': pluginReactNative,
            'react-hooks': pluginReactHooks,
            import: pluginImport,
            // 'unused-imports': pluginUnusedImports,
        },
        rules: {
            // '@typescript-eslint/no-unused-vars': [
            //     'warn',
            //     { argsIgnorePattern: '^_' },
            // ],
            // '@typescript-eslint/explicit-module-boundary-types': 'off',
            // '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-shadow': 'error',
            'react/prop-types': 'off',
            // 'react/react-in-jsx-scope': 'off', // ✅ Disable outdated JSX scope rule
            'react/jsx-boolean-value': ['error', 'never'],
            'react/jsx-no-useless-fragment': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            // 'react-native/no-inline-styles': 'warn',
            // 'react-native/split-platform-components': 'warn',
            // 'react-native/no-color-literals': 'warn',
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                },
            ],
            // 'unused-imports/no-unused-imports': 'error',
            // 'no-console': 'warn',
            'no-debugger': 'error',
        },
    },
    // // Base config
    // js.configs.recommended,
    //
    // // TypeScript recommended
    // tseslint.configs.recommended,

    // React recommended (flat config)
    // pluginReact.configs.flat.recommended,

    // Prettier for formatting (optional but recommended)
    {
        rules: {
            ...prettier.rules,
        },
    },
]);

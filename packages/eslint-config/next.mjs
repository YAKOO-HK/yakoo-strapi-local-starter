import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import pluginQuery from '@tanstack/eslint-plugin-query';
import onlyWarn from 'eslint-plugin-only-warn';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwind from 'eslint-plugin-tailwindcss';
import turbo from 'eslint-plugin-turbo';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...tailwind.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  {
    plugins: {
      turbo: turbo,
      'react-hooks': reactHooks,
      'only-warn': onlyWarn,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        React: true,
        JSX: true,
      },
      sourceType: 'module',
    },
    settings: {
      tailwindcss: {
        callees: ['cn', 'clsx', 'cva'],
      },
    },
    rules: {
      ...turbo.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'tailwindcss/no-custom-classname': 'off',
    },
    files: ['**/*.js?(x)', '**/*.ts?(x)'],
    ignores: ['.next/*'],
  }
);

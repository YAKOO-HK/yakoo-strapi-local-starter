import eslint from '@eslint/js';
import onlyWarn from 'eslint-plugin-only-warn';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  plugins: {
    'react-hooks': reactHooks,
    'only-warn': onlyWarn,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      React: true,
      JSX: true,
    },
    sourceType: 'module',
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
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
  },
  files: ['**/*.js?(x)', '**/*.ts?(x)'],
  ignores: ['.next/*'],
});

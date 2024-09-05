const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'next',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier',
    'turbo',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'no-redeclare': 'off',
    'no-unused-vars': 'off',
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
  plugins: ['only-warn', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
    tailwindcss: {
      callees: ['cn', 'clsx', 'cva'],
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
};

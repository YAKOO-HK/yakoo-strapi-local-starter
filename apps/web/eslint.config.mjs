import nextJs from '@repo/eslint-config/next.mjs';

export default [
  ...nextJs,
  {
    ignores: ['**/*.config.js', '**/*.cjs', '**/node_modules/'],
  },
];

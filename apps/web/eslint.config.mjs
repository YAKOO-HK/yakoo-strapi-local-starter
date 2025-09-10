import nextJs from '@repo/eslint-config/next.mjs';

const eslintConfig = [
  ...nextJs,
  {
    ignores: ['next-env.d.ts', '.next', '**/*.config.js', '**/*.cjs', '**/node_modules/'],
  },
];
export default eslintConfig;

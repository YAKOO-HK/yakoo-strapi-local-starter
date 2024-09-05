/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  ignorePatterns: ['*.config.js', '*.cjs', 'node_modules/'],
  settings: {
    next: {
      rootDir: true,
    },
  },
};

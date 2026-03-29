const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = [
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/no-unused-vars': ['error'],
      quotes: ['error', 'single'],
      semi: 'error',
      'comma-dangle': ['error', { arrays: 'always' }],
      'arrow-parens': ['error', 'as-needed'],
    },
  },
];

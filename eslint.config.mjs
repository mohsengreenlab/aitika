// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default {
  ...eslint.configs.recommended,
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended'],
  rules: {
    // Prettier formatting only, no annoying TS strict rules
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        printWidth: 79,
        tabWidth: 2,
        endOfLine: 'auto'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
  }
};
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier/flat'
import importAccess from 'eslint-plugin-import-access'

const config = [
  ...coreWebVitals,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'import-access': { rules: importAccess.rules },
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'import-access/jsdoc': ['error'],
    },
  },
]

export default config

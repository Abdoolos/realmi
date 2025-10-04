import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', '.next', 'node_modules'] },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      // تخفيف جميع القواعد المسببة للمشاكل
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off', 
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-prototype-builtins': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': 'off'
    },
  },
]

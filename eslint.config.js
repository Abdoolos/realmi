export default [
  { 
    ignores: [
      'dist', 
      '.next', 
      'node_modules', 
      'public', 
      '**/*.config.js',
      '**/*.ts',
      '**/*.tsx',
      'src/server/**/*',
      'app/api/**/*',
      'src/utils/**/*',
      'prisma/**/*',
      'docs/**/*'
    ] 
  },
  
  // تعطيل جميع قواعد ESLint لجميع الملفات
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      // تعطيل كامل لجميع القواعد
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]

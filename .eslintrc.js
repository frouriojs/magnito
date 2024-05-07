module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "TSAsExpression[typeAnnotation.type='TSTypeReference'] > TSAsExpression[typeAnnotation.type='TSUnknownKeyword']",
        message: 'No type assertion by unknown',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    eqeqeq: 'error',
    'no-param-reassign': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-template': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    complexity: ['error', 5],
    'max-depth': ['error', 2],
    'max-nested-callbacks': ['error', 3],
    'max-lines': ['error', 200],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { '@typescript-eslint/no-var-requires': ['off'] },
    },
    {
      files: ['server/**/*.ts'],
      rules: { '@typescript-eslint/explicit-function-return-type': ['error'] },
    },
    {
      files: ['server/api/**/controller.ts', 'server/api/**/hooks.ts'],
      rules: { '@typescript-eslint/explicit-function-return-type': ['off'] },
    },
  ],
};

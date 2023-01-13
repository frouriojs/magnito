module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-styled-components',
    'stylelint-config-prettier',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'value-keyword-case': null,
    'unit-no-unknown': null,
  },
  customSyntax: '@stylelint/postcss-css-in-js',
}

const config = require('./config.common');

module.exports = Object.assign(config, {
  watch: true,
  define: {
    'process.env.NODE_ENV': `"development"`,
  },
});

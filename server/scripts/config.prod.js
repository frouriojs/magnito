const config = require('./config.common')

module.exports = Object.assign(config, {
  minify: true,
  define: {
    'process.env.NODE_ENV': `"production"`,
  },
})

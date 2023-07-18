const { build } = require('esbuild');
const config = require('./config.common');

build({
  ...config,
  watch: true,
  define: { 'process.env.NODE_ENV': `"development"` },
});

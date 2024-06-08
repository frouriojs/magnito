const { build } = require('esbuild');
const config = require('./config.common');

build({
  ...config,
  minify: true,
  sourcemap: 'linked',
  define: { 'process.env.NODE_ENV': `"production"`, 'import.meta.vitest': 'false' },
}).catch(() => process.exit(1));

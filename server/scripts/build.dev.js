const { context } = require('esbuild');
const config = require('./config.common');

context({
  ...config,
  define: { 'process.env.NODE_ENV': `"development"`, 'import.meta.vitest': 'false' },
}).then((ctx) => ctx.watch());

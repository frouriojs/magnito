const { context } = require('esbuild');
const path = require('path');
const config = require('./config.common');

context({
  ...config,
  entryPoints: [path.resolve(__dirname, '../index.ts')],
  define: { 'process.env.NODE_ENV': `"development"`, 'import.meta.vitest': 'false' },
}).then((ctx) => ctx.watch());

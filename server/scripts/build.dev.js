const { context } = require('esbuild');
const config = require('./config.common');

context({ ...config, define: { 'process.env.NODE_ENV': `"development"` } }).then((ctx) =>
  ctx.watch()
);

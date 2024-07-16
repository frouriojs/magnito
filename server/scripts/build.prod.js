const { build } = require('esbuild');
const path = require('path');
const config = require('./config.common');

build({
  ...config,
  entryPoints: [
    path.resolve(__dirname, '../index.ts'),
    path.resolve(__dirname, '../prisma/seed.ts'),
  ],
  minify: true,
  define: { 'process.env.NODE_ENV': `"production"`, 'import.meta.vitest': 'false' },
}).catch(() => process.exit(1));

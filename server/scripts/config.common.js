const { nodeExternalsPlugin } = require('esbuild-node-externals');
const path = require('path');

module.exports = {
  entryPoints: [path.resolve(__dirname, '../entrypoints/index.ts')],
  outdir: path.resolve(__dirname, '../'),
  platform: 'node',
  target: 'node18',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info',
};

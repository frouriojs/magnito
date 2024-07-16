const { nodeExternalsPlugin } = require('esbuild-node-externals');
const path = require('path');

module.exports = {
  outdir: path.resolve(__dirname, '../'),
  platform: 'node',
  target: 'node20',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info',
  sourcemap: 'linked',
};

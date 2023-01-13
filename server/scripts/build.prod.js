const { build } = require('esbuild')
const config = require('./config.prod.js')

build(config).catch(() => process.exit(1))

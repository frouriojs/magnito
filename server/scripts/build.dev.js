const { build } = require('esbuild')
const config = require('./config.dev.js')

build(config)

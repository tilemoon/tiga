const path = require('path')

const { paramRequired } = require('../util')
const { lessLoader } = require('esbuild-plugin-less')
const helperPaths = require('../helper/paths')
const { configStore } = require('../config')

const createEsbuildConfig = ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  mode = paramRequired('mode'),
}) => {
  /** @type {import('esbuild').BuildOptions} */
  let config = {
    entryPoints: [entry],
    bundle: true,
    target: 'es6',
    tsconfig: helperPaths.appTsConfig,
    plugins: [lessLoader()],
    define: configStore.define,
  }

  if (mode === 'development') {
    config.sourcemap = true
    config.outfile = path.resolve(outDir, 'dev-main.js')
    config.banner = {
      js: '(() => new EventSource("/esbuild-hot").onmessage = () => location.reload())();',
    }
  } else {
    config.minify = true
    config.outdir = outDir
    config.entryNames = '[dir]/[name]-[hash]'
  }

  config = configStore.esbuildConfigCallbackList.reduce((acc, callback) => {
    return callback(acc) ?? acc
  }, config)

  return config
}

module.exports = createEsbuildConfig

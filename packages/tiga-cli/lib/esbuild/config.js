const { paramRequired } = require('../util')
const { lessLoader } = require('esbuild-plugin-less')
const helperPaths = require('../helper/paths')
const { configStore } = require('../config')

const createEsbuildConfig = ({
  entry = paramRequired('entry'),
  mode = paramRequired('mode'),
  outDir,
}) => {
  /** @type {import('esbuild').BuildOptions} */
  let config = {
    entryPoints: [entry],
    entryNames: '[dir]/[name]-[hash]',
    outdir: outDir,
    bundle: true,
    target: 'es6',
    tsconfig: helperPaths.appTsConfig,
    plugins: [lessLoader()],
    define: configStore.define,
    write: false,
  }

  if (mode === 'development') {
    config.sourcemap = true
    config.banner = {
      js: '(() => new EventSource("/esbuild-hot").onmessage = () => location.reload())();',
    }
  } else {
    config.minify = true
  }

  config = configStore.esbuildConfigCallbackList.reduce((acc, callback) => {
    return callback(acc) ?? acc
  }, config)

  return config
}

module.exports = createEsbuildConfig

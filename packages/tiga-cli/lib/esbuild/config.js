const { paramRequired, logger } = require('../util')
const { lessLoader } = require('esbuild-plugin-less')
const helperPaths = require('../helper/paths')
const { configStore } = require('../config')

const createEsbuildConfig = ({
  entry = paramRequired('entry'),
  mode = paramRequired('mode'),
  outDir,
  hotReloadClients,
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
    config.watch = {
      onRebuild(error) {
        hotReloadClients.forEach((res) => res.write('data: update\n\n'))

        if (error) {
          logger.error(error)
        } else {
          logger.success('rebuild successed.')
        }
      },
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

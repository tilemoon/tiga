const webpack = require('webpack')
const fs = require('fs-extra')

const { paramRequired, logger } = require('../util')
const createWebpackConfig = require('./config')

const webpackBuild = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  mode,
}) => {
  fs.emptyDirSync(outDir)

  const chain = createWebpackConfig({ entry, outDir, mode })

  const compiler = webpack(chain.toConfig())

  compiler.run(() => {
    logger.success('build finished')
  })
}

module.exports = webpackBuild

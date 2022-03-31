const webpack = require('webpack')
const fs = require('fs-extra')

const { paramRequired, logger } = require('../util')
const createWebpackChain = require('./config')

const webpackBuild = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
}) => {
  fs.emptyDirSync(outDir)

  const chain = createWebpackChain({ entry, outDir, mode: 'production' })

  const compiler = webpack(chain.toConfig())

  compiler.run(() => {
    logger.success('build finished')
  })
}

module.exports = webpackBuild

const webpack = require('webpack')

const { paramRequired } = require('../util')
const createWebpackConfig = require('./config')

const webpackBuild = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  mode,
}) => {
  const chain = createWebpackConfig({ entry, outDir, mode })

  const compiler = webpack(chain.toConfig())

  return new Promise((resolve, reject) => {
    compiler.run((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = webpackBuild

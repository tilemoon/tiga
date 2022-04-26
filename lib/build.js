const esBuild = require('./esbuild/build')
const webpackBuild = require('./webpack/build')
const { logger } = require('./util')
const helperPaths = require('./helper/paths')

const { runConfigScript } = require('./config')

const parseBuildOptions = (options) => {
  options.entry = helperPaths.resolveBaseApp(options.entry)
  options.outDir = helperPaths.resolveBaseApp(options.outDir)
  options.config = helperPaths.resolveBaseApp(options.config)
  options.mode = 'production'

  return options
}

const build = (options) => {
  parseBuildOptions(options)

  runConfigScript(options)

  try {
    if (options.esbuild) {
      esBuild(options)
    } else {
      webpackBuild(options)
    }
  } catch(err) {
    logger.error('build failed')
    logger.fatalByError(err)
  }
}

module.exports = build

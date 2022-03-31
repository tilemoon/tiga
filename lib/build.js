const path = require('path')

const esBuild = require('./esbuild/build')
const webpackBuild = require('./webpack/build')
const { logger } = require('./util')
const helperPaths = require('./helper/paths')

const parseBuildOptions = (options) => {
  if (!path.isAbsolute(options.entry)) {
    options.entry = helperPaths.resolveBaseApp(options.entry)
  }

  if (!path.isAbsolute(options.outDir)) {
    options.outDir = helperPaths.resolveBaseApp(options.outDir)
  }

  return options
}

const build = (options) => {
  parseBuildOptions(options)

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

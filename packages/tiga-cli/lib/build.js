const ora = require('ora')
const fs = require('fs-extra')

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

const build = async (options) => {
  const spinner = ora('Building').start()

  parseBuildOptions(options)

  runConfigScript(options)

  spinner.text = 'Clearing out dir'
  fs.emptyDirSync(options.outDir)
  spinner.succeed('Out dir cleared')

  spinner.start('Building')

  try {
    if (options.esbuild) {
      await esBuild(options)
    } else {
      await webpackBuild(options)
    }
    spinner.succeed('Build Successed')
  } catch(err) {
    spinner.stop().clear()
    logger.error('Build failed')
    logger.fatalByError(err)
  }
}

module.exports = build

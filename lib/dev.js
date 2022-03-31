const chalk = require('chalk')
const path = require('path')

const esbuildServer = require('./esbuild/dev-server')
const webpackDevServer = require('./webpack/dev-server')
const { logger, openBrowser, isPortBusy } = require('./util')
const helperPaths = require('./helper/paths')
const ora = require('ora')

const parseDevOptions = (options) => {
  if (!Number.isInteger(options.port)) {
    logger.fatal(`port ${options.port} is not a integer.`)
  }

  if (!path.isAbsolute(options.entry)) {
    options.entry = helperPaths.resolveBaseApp(options.entry)
  }

  if (!path.isAbsolute(options.outDir)) {
    options.outDir = helperPaths.resolveBaseApp(options.outDir)
  }

  return options
}

const dev = async (options) => {
  parseDevOptions(options)

  let server
  const originalPort = options.port
  const startTime = Date.now()

  // 找到可以使用的 port 为止
  while(await isPortBusy(options.port)) {
    options.port++
  }

  const spinner = ora('').start()

  try {
    if (options.esbuild) {
      spinner.text = 'app is bundling with esbuild.'
      server = await esbuildServer(options)
    } else {
      server = await webpackDevServer(options)
    }
  } catch(err) {
    spinner.stop().clear()

    logger.fatalByError(err)
  }


  /**
   * Dev server is successfully created.
   */
  if (server) {
    spinner.stop().clear()
    logger.success('Dev server created successfully.')

    if (originalPort !== options.port) {
      logger.warn(`port ${originalPort} is busy, switched to ${options.port}`)
    }

    logger.info(`running at:
      > ${chalk.blue(`http://localhost:${options.port}`)}

      completed in ${chalk.green(Date.now() - startTime)}ms.
    `)

    openBrowser(`http://localhost:${options.port}`)
  }
}

module.exports = dev

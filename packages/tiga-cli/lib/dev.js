const chalk = require('chalk')
const ora = require('ora')

const esbuildServer = require('./esbuild/dev-server')
const webpackDevServer = require('./webpack/dev-server')
const { logger, openBrowser, isPortBusy } = require('./util')
const helperPaths = require('./helper/paths')
const { runConfigScript } = require('./config')

const parseDevOptions = (options) => {
  if (!Number.isInteger(options.port)) {
    logger.fatal(`port ${options.port} is not a integer.`)
  }

  options.entry = helperPaths.resolveBaseApp(options.entry)
  options.outDir = helperPaths.resolveBaseApp(options.outDir)
  options.config = helperPaths.resolveBaseApp(options.config)
  options.mode = 'development'

  return options
}

const dev = async (options) => {
  const spinner = ora('').start()

  parseDevOptions(options)

  runConfigScript(options)

  let server
  const originalPort = options.port
  const startTime = Date.now()

  // 找到可以使用的 port 为止
  while(await isPortBusy(options.port)) {
    options.port++
  }

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

    logger.success(`running at:
      > ${chalk.blue(`http://localhost:${options.port}`)}

      completed in ${chalk.green(Date.now() - startTime)}ms.
    `)

    openBrowser(`http://localhost:${options.port}`)
  }
}

module.exports = dev

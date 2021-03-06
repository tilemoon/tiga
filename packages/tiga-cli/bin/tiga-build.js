const { Command } = require('commander')

const build = require('../lib/build')
const { logger } = require('../lib/util')

process.on('unhandledRejection', (err) => {
  logger.error(err)
})

const flags = new Command()

flags
  .option('--entry <path>', 'app entry', 'src/main.tsx')
  .option('--outDir <path>', 'output all files to this directory', 'dist')
  .option('--esbuild', 'use esbuild to bundle app')
  .option('-c,--config <path>', 'specific config file for more configuration', 'tiga.config.js')
  .action((options) => {
    build(options)
  })

flags.parse(process.argv)

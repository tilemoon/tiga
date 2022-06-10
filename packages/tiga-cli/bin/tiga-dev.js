const { Command } = require('commander')

const dev = require('../lib/dev')
const { logger } = require('../lib/util')

process.on('unhandledRejection', (err) => {
  logger.error(err)
})

const flags = new Command()

flags
  .option('-p, --port <port>', 'specific the listening port for dev server', 3000)
  .option('--entry <path>', 'app entry', 'src/main.tsx')
  .option('--outDir <path>', 'output all files to this directory', 'dist')
  .option('-c,--config <path>', 'specific config file for more configuration', 'tiga.config.js')
  .option('--esbuild', 'use esbuild for dev bundle')
  .action((options) => {
    dev(options)
  })

flags.parse(process.argv)

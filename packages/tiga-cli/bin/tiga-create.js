const { Command } = require('commander')
const create = require('../lib/create')
const { logger } = require('../lib/util')

process.on('unhandledRejection', (err) => {
  logger.error(err)
})

const flags = new Command()

flags
  .argument('project-name', 'project name')
  .option('-f,--force', 'force to create project directory even path exists.')
  .option('--template <template>', 'choose a template to create.')
  .action((projectName, options) => {
    create(projectName, options)
  })

flags.parse(process.argv)

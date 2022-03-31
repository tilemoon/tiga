#!/usr/local/bin/node

const { Command } = require('commander')
const path = require('path')

const flags = new Command()

flags.version(require(path.resolve(__dirname, '../package.json')).version)

flags
  .command('dev', 'bundle files and create a dev server')
  .command('build', 'bundle files for production')
  .command('create', 'create a new project')

flags.parse(process.argv)

const chalk = require('chalk')
const util = require('util')

const log = (prefix, format, ...fArgs) => {
  const msg = util.format(format, ...fArgs)

  console.log(`${prefix} ${msg}`)
}

const info = (format, ...args) => {
  log(chalk.blue('  [tiga]'), format, ...args)
}

const warn = (format, ...args) => {
  log(chalk.yellow('  [tiga warn]'), format, ...args)
}

const success = (format, ...args) => {
  log(chalk.green('✔ [tiga]'), format, ...args)
}

const error = (format, ...args) => {
  log(chalk.red('✘ [tiga error]'), format, ...args)
}

const fatal = (format, ...args) => {
  log(chalk.red('✘ [tiga fatal]'), format, ...args)
  process.exit(1)
}

const fatalByError = (err) => {
  if (err instanceof Error) {
    err = `${err.toString()} \n${err.stack}`
  } else {
    err = err.toString()
  }

  log(chalk.red('✘ [tiga fatal]'), err)
  process.exit(1)
}

module.exports = {
  info,
  warn,
  success,
  error,
  fatal,
  fatalByError,
}

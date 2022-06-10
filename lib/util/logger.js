const chalk = require('chalk')
const util = require('util')

const log = (prefix, format, ...fArgs) => {
  const msg = util.format(format, ...fArgs)

  console.log(`${prefix} ${msg}`)
}

const info = (format, ...args) => {
  log(chalk.blue('[INFO]'), format, ...args)
}

const warn = (format, ...args) => {
  log(chalk.yellow('[WARN]'), format, ...args)
}

const success = (format, ...args) => {
  log(chalk.green('[DONE]'), format, ...args)
}

const error = (format, ...args) => {
  log(chalk.red('[ERROR]'), format, ...args)
}

const fatal = (format, ...args) => {
  log(chalk.red('[FATAL]'), format, ...args)
  process.exit(1)
}

const fatalByError = (err) => {
  if (err instanceof Error) {
    err = `${err.toString()} \n${err.stack}`
  } else {
    err = err.toString()
  }

  log(chalk.red('[FATAL]'), err)
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

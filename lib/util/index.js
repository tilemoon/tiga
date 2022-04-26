const fs = require('fs-extra')
const path = require('path')
const net = require('net')
const { spawn } = require('child_process')

const logger = require('./logger')

const utils = {
  logger,
}
// ===============================
// Helper Functions
// ===============================

utils.paramRequired = (paramName) => {
  const stack = (new Error()).stack

  logger.fatal(`param \`${paramName}\` is required, but got undefined \n ${stack}`)
}

utils.readAllFiles = (dir) => {
  const files = []

  const stats = fs.statSync(dir)
  if (!stats.isDirectory()) {
    files.push(dir)

    return files
  }

  fs.readdirSync(dir)
    .forEach((filepath) => {
			const fullpath = path.join(dir, filepath)
      const stats = fs.statSync(fullpath)

      if (stats.isDirectory()) {
        files.push(...utils.readAllFiles(fullpath, files))
      } else {
        files.push(path.resolve(dir, filepath))
      }
    })

  return files
}

utils.isPortBusy = (port) => {
  return new Promise((resolve) => {
    const testServer = net.createServer()

    testServer.once('error', (err) => {
      testServer.close()

      if (err.code === 'EADDRINUSE') {
        resolve(true)
      }
      resolve(false)
    })

    testServer.once('listening', () => {
      testServer.close()
      resolve(false)
    })

    testServer.listen(port)
  })
}

// ===============================
// Dev Utils in browser
// ===============================

utils.openBrowser = (url) => {
  const ops = {
    darwin: ['open'],
    linux: ['xdg-open'],
    win32: ['cmd', '/c', 'start'],
  }[process.platform]

  if (ops) {
    spawn(ops[0], [...ops.slice(1), url])
  }
}

module.exports = utils

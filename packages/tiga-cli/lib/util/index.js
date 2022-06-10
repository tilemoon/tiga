const fs = require('fs-extra')
const path = require('path')
const net = require('net')
const { spawn } = require('child_process')

const logger = require('./logger')

// ===============================
// Helper Functions
// ===============================

const paramRequired = (paramName) => {
  const stack = (new Error()).stack

  logger.fatal(`param \`${paramName}\` is required, but got undefined \n ${stack}`)
}

const isPortBusy = (port) => {
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

const openBrowser = (url) => {
  const ops = {
    darwin: ['open'],
    linux: ['xdg-open'],
    win32: ['cmd', '/c', 'start'],
  }[process.platform]

  if (ops) {
    spawn(ops[0], [...ops.slice(1), url])
  }
}

module.exports = {
  logger,
  paramRequired,
  isPortBusy,
  openBrowser,
}

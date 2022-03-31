const webpack = require('webpack')
const Koa = require('koa')

const c2k = require('koa2-connect')

// middlewares
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const historyMiddleware = require('connect-history-api-fallback')

const { paramRequired } = require('../util')
const createWebpackChain = require('./config')

const createDevServer = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  port = paramRequired('port'),
}) => {
  // create webpack config first
  const chain = createWebpackChain({ entry, outDir })

  const compiler = webpack(chain.toConfig())
  const server = new Koa()

  const devMiddlewareInstance = devMiddleware(compiler, {
    publicPath: chain.output.get('publicPath'),
    stats: 'errors-only',
  })

  server.use(c2k(devMiddlewareInstance))
  server.use(c2k(hotMiddleware(compiler)))
  server.use(c2k(historyMiddleware()))

  server.listen(port)

  return new Promise((resolve) => {
    devMiddlewareInstance.waitUntilValid(() => {
      resolve(server)
    })
  })
}

module.exports = createDevServer

const webpack = require('webpack')
const Koa = require('koa')

const c2k = require('koa2-connect')

// middlewares
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const historyMiddleware = require('connect-history-api-fallback')

const { paramRequired } = require('../util')
const createWebpackConfig = require('./config')

const createDevServer = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  port = paramRequired('port'),
  mode,
}) => {
  // create webpack config first
  const config = createWebpackConfig({ entry, outDir, mode })

  const compiler = webpack(config.toConfig())
  const server = new Koa()

  const devMiddlewareInstance = devMiddleware(compiler, {
    publicPath: config.output.get('publicPath'),
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

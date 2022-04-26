const path = require('path')
const { build } = require('esbuild')
const Koa = require('koa')
const static = require('koa-static')
const fs = require('fs-extra')

const { createHtml } = require('../html/html')
const { logger, paramRequired } = require('../util')

const createConfig = require('./config')

const createDevServer = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  port = paramRequired('port'),
  mode,
}) => {
  const clients = []
  const config = createConfig({
    entry,
    outDir,
    mode,
  })

  config.watch = {
    onRebuild(error) {
      clients.forEach((res) => res.write('data: update\n\n'))

      if (error) {
        logger.error(error)
      } else {
        logger.success('rebuild successed.')
      }
    },
  }

  try {
    await build(config)
  } catch(err) {
    logger.fatalByError(err)
  }

  createHtml({
    assets: {
      js: ['./dev-main.js'],
      css: ['./dev-main.css'],
    },
    outDir,
  })

  const server = new Koa()

  server.use(static(outDir))

  server.use((ctx) => {
    if (ctx.req.url === '/esbuild-hot') {
      ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })
      ctx.status = 200

      clients.push(ctx.res)

      return new Promise(() => {})
    }

    if (ctx.status === 404) {
      ctx.type = 'html'
      ctx.body = fs.readFileSync(path.resolve(outDir, 'index.html'))
    }
  })

  server.listen(port)

  return server
}

module.exports = createDevServer

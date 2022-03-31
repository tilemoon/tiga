const path = require('path')
const { build } = require('esbuild')
const { lessLoader } = require('esbuild-plugin-less')
const Koa = require('koa')
const static = require('koa-static')
const fs = require('fs-extra')

const { createHtml } = require('../html/html')
const { logger, paramRequired } = require('../util')
const helperPaths = require('../helper/paths')

const createDevServer = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  port = paramRequired('port'),
}) => {
  const clients = []

  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      sourcemap: true,
      outfile: path.resolve(outDir, 'dev-main.js'),
      tsconfig: helperPaths.appTsConfig,
      plugins: [lessLoader()],
      banner: {
        js: '(() => new EventSource("/esbuild-hot").onmessage = () => location.reload())();',
      },
      watch: {
        onRebuild(error) {
          clients.forEach((res) => res.write('data: update\n\n'))

          if (error) {
            logger.error(error)
          } else {
            logger.success('rebuild successed.')
          }
        },
      },
    })
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

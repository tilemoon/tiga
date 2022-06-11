const { build } = require('esbuild')
const Koa = require('koa')
const path = require('path')

const { createEsbuildHtml } = require('../html/html')
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

  try {
    const server = new Koa()
    let result, htmlString

    config.watch = {
      onRebuild(error, buildResult) {
        result = buildResult
        htmlString = createEsbuildHtml({ outDir, outputFiles: result.outputFiles })

        clients.forEach((res) => res.write('data: update\n\n'))

        if (error) {
          logger.error(error)
        } else {
          logger.success('rebuild successed.')
        }
      },
    }

    result = await build(config)
    htmlString = createEsbuildHtml({ outDir, outputFiles: result.outputFiles })

    server.use((ctx) => {
      const targetFile = result.outputFiles.find(
        (f) => path.relative(outDir, f.path) === ctx.req.url.slice(1)
      )

      if (targetFile) {
        if (targetFile.path.endsWith('css')) {
          ctx.type = 'css'
        }
        ctx.body = Buffer.from(targetFile.contents).toString()
        return
      }

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
        ctx.body = htmlString
      }
    })

    server.listen(port)

    return server
  } catch(err) {
    logger.fatalByError(err)
  }

  return null
}

module.exports = createDevServer

const { build }= require('esbuild')
const fs = require('fs-extra')

const { createHtml } = require('../html/html')
const { paramRequired, readAssets } = require('../util')

const createConfig = require('./config')

const esBuild = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  mode,
}) => {
  const config = createConfig({
    entry,
    outDir,
    mode,
  })

  fs.emptyDirSync(outDir)

  await build(config)

  createHtml({ assets: readAssets(outDir), outDir })
}

module.exports = esBuild

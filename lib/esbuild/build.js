const { build }= require('esbuild')
const fs = require('fs-extra')
const path = require('path')

const { createEsbuildHtml } = require('../html/html')
const { paramRequired } = require('../util')

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

  const result = await build(config)

  result.outputFiles.forEach(({ path: fpath, contents }) => {
    fs.writeFileSync(fpath, Buffer.from(contents).toString())
  })

  fs.writeFileSync(path.resolve(outDir, 'index.html'), createEsbuildHtml({
    outDir,
    outputFiles: result.outputFiles,
  }))
}

module.exports = esBuild

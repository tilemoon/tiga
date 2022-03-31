const { build }= require('esbuild')
const { lessLoader } = require('esbuild-plugin-less')
const fs = require('fs-extra')

const { createHtml } = require('../html/html')
const { paramRequired, readAssets } = require('../util')
const helperPaths = require('../helper/paths')

const esBuild = async ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
}) => {
  fs.emptyDirSync(outDir)

  await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    outdir: outDir,
    entryNames: '[dir]/[name]-[hash]',
    tsconfig: helperPaths.appTsConfig,
    target: 'es6',

    plugins: [lessLoader()],
  })

  createHtml({ assets: readAssets(outDir), outDir })
}

module.exports = esBuild

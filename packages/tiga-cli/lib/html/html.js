const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const { paramRequired } = require('../util')

const readHtml = (filename) => fs.readFileSync(path.resolve(__dirname, filename), { encoding: 'utf-8' })

const createEsbuildHtml = ({
  title = 'Tiga Template',
  outDir = paramRequired('outDir'),
  outputFiles,
}) => {
  const $ = cheerio.load(readHtml('index.html'))

  $('head title').text(title)

  outputFiles.forEach(({ path: fpath }) => {
    const rpath = path.relative(outDir, fpath)

    if (fpath.endsWith('js')) {
      $('body').append(`<script src="${rpath}"></script>`)
    }
    if (fpath.endsWith('css')) {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${rpath}">`)
    }
  })

  return $.html()
}

/**
 *
 * @param { import('webpack-chain') } chain
 */
const confWebpackHtml = (chain) => {
  chain.plugin('html')
    .use(HtmlWebpackPlugin, [
      {
        templateContent: readHtml('index.html'),
        filename: 'index.html',
      },
    ])
    .end()

  return chain
}

module.exports = {
  createEsbuildHtml,
  confWebpackHtml,
}

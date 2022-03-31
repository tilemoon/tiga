const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const { paramRequired } = require('../util')

const readHtml = (filename) => fs.readFileSync(path.resolve(__dirname, filename), { encoding: 'utf-8' })

const createHtml = ({
  title = 'Tiga Template',
  assets = paramRequired('assets'),
  outDir = paramRequired('outDir'),
}) => {
  const $ = cheerio.load(readHtml('index.html'))

  $('head title').text(title)

  if (assets.js) {
    assets.js.forEach((jsfile) => {
      $('body').append(`<script src="${jsfile}"></script>`)
    })
  }

  if (assets.css) {
    assets.css.forEach((cssfile) => {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${cssfile}">`)
    })
  }

  fs.writeFileSync(path.resolve(outDir, 'index.html'), $.html())
  fs.writeFileSync(path.resolve(outDir, 'ie.html'), readHtml('ie.html'))
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
  createHtml,
  confWebpackHtml,
}

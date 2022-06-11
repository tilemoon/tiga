const Config = require('webpack-chain')
const Webpack = require('webpack')
const path = require('path')

const { paramRequired } = require('../util')
const helperPaths = require('../helper/paths')
const { confWebpackHtml } = require('../html/html')
const { configStore } = require('../config')

/**
 * @param { import('webpack-chain') } chain
 */
const confEntry = (chain, entry) => {
  chain.entry('app')
    .add(entry)
}

/**
 * @param { import('webpack-chain') } chain
 */
const confOutput = (chain, outDir) => {
  chain.output
    .publicPath('/')
    .path(outDir)
    .filename('[name].[contenthash].js')
}

/**
 * @param { import('webpack-chain') } chain
 */
const confResolve = (chain) => {
  const { paths } = require(helperPaths.appTsConfig).compilerOptions
  const alias = {}

  // set tsconfig paths to webpack alias
  if (paths) {
    Object.keys(paths).forEach((key) => {
      const aliasKey = key.replace('/*', '')

      if (Array.isArray(paths[key])) {
        alias[aliasKey] = paths[key].map((p) => {
          return helperPaths.resolveBaseApp(p.replace('/*', ''))
        })
      } else {
        alias[aliasKey] = helperPaths.resolveBaseApp(paths[key].replace('/*', ''))
      }
    })
  }

  chain.resolve
    .extensions
      .merge(['.ts', '.tsx', '.js', '.jsx'])
      .end()
    .modules
      .add(helperPaths.appNodeModules)
      // for monorepo like: root/packages/app
      .add(path.resolve(helperPaths.app, '../../node_modules'))
      .end()
    .alias
      .merge(alias)
      .end()
}

/**
 * @param { import('webpack-chain') } chain
 */
const confOptimization = (chain) => {
  chain.optimization
    .splitChunks({
      chunks: 'all',
    })
}

/**
 * @param { import('webpack-chain') } chain
 */
const confJsCompile = (chain) => {
  chain.module
    .rule('ts-compile')
      .test(/\.tsx?$/)
      .use('esbuild')
        .loader(require.resolve('esbuild-loader'))
        .options({
          loader: 'tsx',
          target: 'es2015',
          tsconfigRaw: require(helperPaths.appTsConfig),
        })

  chain.module
    .rule('js-compile')
      .test(/\.jsx?$/)
      .use('esbuild')
        .loader(require.resolve('esbuild-loader'))
        .options({
          loader: 'jsx',
          target: 'es2015',
        })
}

/**
 * @param { import('webpack-chain') } chain
 */
const confCssCompile = (chain) => {
  chain.module
    .rule('less')
      .test(/\.less/i)
      .use('style')
        .loader(require.resolve('style-loader'))
        .end()
      .use('css')
        .loader(require.resolve('css-loader'))
        .end()
      .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .end()
      .use('less')
        .loader(require.resolve('less-loader'))
        .end()

  chain.module
    .rule('css')
      .test(/\.css/i)
      .use('style')
        .loader(require.resolve('style-loader'))
        .end()
      .use('css')
        .loader(require.resolve('css-loader'))
        .end()
      .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .end()
}

/**
 * @param { import('webpack-chain') } chain
 */
const confDefine = (chain) => {
  chain.plugin('define')
    .use(Webpack.DefinePlugin, [configStore.define])
    .end()

  return chain
}
const createWebpackConfig = ({
  entry = paramRequired('entry'),
  outDir = paramRequired('outDir'),
  mode = paramRequired('mode'),
}) => {
  const chain = new Config()
  chain.mode(mode)

  confEntry(chain, entry)

  confOutput(chain, outDir)

  confResolve(chain)

  confOptimization(chain)

  confJsCompile(chain)

  confCssCompile(chain)

  confWebpackHtml(chain)

  confDefine(chain)

  configStore.webpackChainCallbackList.forEach((callback) => {
    callback(chain)
  })

  return chain
}

module.exports = createWebpackConfig

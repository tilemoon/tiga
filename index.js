const {
  chainWebpack,
  configEsbuild,
  define,
  whenDev,
  whenBuild,
} = require('./lib/config')

module.exports = {
  dev: require('./lib/dev'),
  build: require('./lib/build'),
  chainWebpack,
  configEsbuild,
  define,
  whenDev,
  whenBuild,
}

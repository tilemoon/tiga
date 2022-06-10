const {
  chainWebpack,
  configEsbuild,
  define,
  whenDev,
  whenBuild,
} = require('../packages/tiga-cli')

chainWebpack(chain => {

})

configEsbuild(config => {
  return config
})

whenDev(() => {
  define('__DEV__', JSON.stringify(true))
})

whenBuild(() => {
  define('__DEV__', JSON.stringify(false))
})

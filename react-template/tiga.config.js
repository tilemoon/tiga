const {
  chainWebpack,
  configEsbuild,
  define,
  whenDev,
  whenBuild,
} = require('@tilemoon/tiga')

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

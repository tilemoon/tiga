const fs = require('fs-extra')
const { logger, paramRequired } = require('../util')

const configStore = {
  webpackChainCallbackList: [],
  esbuildConfigCallbackList: [],
  devModeCallbackList: [],
  buildModeCallbackList: [],
  define: {},
}

const chainWebpack = (chainCallback) => {
  if (typeof chainCallback !== 'function') {
    logger.fatal('chainWebpack only accept a function.')
  }

  configStore.webpackChainCallbackList.push(chainCallback)
}

const configEsbuild = (configCallback) => {
  if (typeof configCallback !== 'function') {
    logger.fatal('configEsbuild only accept a function.')
  }

  configStore.esbuildConfigCallbackList.push(configCallback)
}

const runConfigScript = ({
  mode = paramRequired('mode'),
  config = paramRequired('config'),
}) => {
  if (fs.existsSync(config)) {
    require(config)
  } else {
    logger.warn('no config file detected, running on default config')
  }

  if (mode === 'development') {
    configStore.devModeCallbackList.forEach((callback) => callback())
  } else {
    configStore.buildModeCallbackList.forEach((callback) => callback())
  }
}

const whenDev = (callback) => {
  if (typeof callback !== 'function') {
    logger.fatal('callback must be a function.')
  }

  configStore.devModeCallbackList.push(callback)
}

const whenBuild = (callback) => {
  if (typeof callback !== 'function') {
    logger.fatal('callback must be a function.')
  }

  configStore.buildModeCallbackList.push(callback)
}

const define = (name, value) => {
  configStore.define[name] = value
}

module.exports = {
  chainWebpack,
  configEsbuild,
  runConfigScript,
  whenDev,
  whenBuild,
  define,

  configStore,
}

const path = require('path')
const fs = require('fs-extra')
const helperPaths = require('./helper/paths')
const { logger } = require('./util')

const create = async (projectName, {
  force = false,
})=> {
  const targetDir = path.resolve(helperPaths.app, projectName)

  // 创建目录
  if (fs.existsSync(targetDir)) {
    if (!force) {
      logger.fatal(`directory ${projectName} exists, please deleted first.`)
    }
    fs.rmdirSync(targetDir)
  }

  fs.copySync(helperPaths.templateDir, targetDir)
}

module.exports = create

const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')
const axios = require('axios')
const zlib = require('zlib')
const tar = require('tar')
const helperPaths = require('./helper/paths')
const { logger } = require('./util')

const reactTemplate = '@tilemoon/react-template'

const create = async (projectName, {
  force = false,
})=> {
  const version = require(helperPaths.cliPackage).version
  const targetDir = path.resolve(helperPaths.app, projectName)

  // 创建目录
  if (fs.existsSync(targetDir)) {
    if (!force) {
      logger.fatal(`directory ${projectName} exists, please deleted first.`)
    }
    fs.rmdirSync(targetDir)
  }
  fs.mkdirSync(targetDir)

  const currentReactTemplate = `${reactTemplate}@${version}`
  const result = spawn.sync('npm', ['view', currentReactTemplate, 'dist.tarball'], {stdio: 'pipe'})

  if (result.stdout) {
    const pkgUrl = result.stdout.toString().trim()
    const res = await axios.get(pkgUrl, { responseType: 'stream' })

    res.data
      .on('error', logger.fatal)
      .pipe(zlib.Unzip())
      .pipe(tar.x({
        C: targetDir,
        strip: 1
      }))
  } else {
    logger.fatal(`can't find ${currentReactTemplate} npm package.`)
  }
}

module.exports = create

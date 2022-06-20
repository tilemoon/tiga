const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')
const axios = require('axios')
const zlib = require('zlib')
const tar = require('tar')
const helperPaths = require('./helper/paths')
const { logger } = require('./util')
const chalk = require('chalk')
var inquirer = require('inquirer')

const reactTemplate = '@tilemoon/react-template'
const viteReactTemplate = '@tilemoon/vite-react-template'

const templates = {
  'tiga-react-ts': reactTemplate,
  'vite-react-ts': viteReactTemplate,
}

const create = async (projectName, {
  force = false,
  template,
})=> {
  if (template && !templates[template]) {
    logger.fatal(`unknown template, choose one from below:
${Object.keys(templates).map((tpl, i) => chalk.blue(`${i + 1}. ${tpl}`)).join('\n')}
`)
  } else {
    const templateQsName = 'choose one template to create'
    await inquirer
      .prompt([{
        name: templateQsName,
        type: 'list',
        choices: Object.keys(templates),
      }])
      .then((answers) => {
        template =  answers[templateQsName]
      })
      .catch(logger.fatalByError)
  }

  const templateName = templates[template]

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

  const currentTemplate = `${templateName}@${version}`
  const result = spawn.sync('npm', ['view', currentTemplate, 'dist.tarball'], {stdio: 'pipe'})

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
    logger.fatal(`can't find ${currentTemplate} npm package.`)
  }
}

module.exports = create

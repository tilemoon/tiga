const path = require('path')

const appDir = process.cwd()
const cliDir = path.resolve(__dirname, '../..')

module.exports = {
  // paths in app
  app: appDir,
  appSrc: path.resolve(appDir, 'src'),
  appTsConfig: path.resolve(appDir, 'tsconfig.json'),
  appNodeModules: path.resolve(appDir, 'node_modules'),

  // paths in cli package
  cli: cliDir,
  cliPackage: path.resolve(cliDir, 'package.json'),
  nodeModules: path.resolve(cliDir, 'node_modules'),

  resolveBaseApp: (p) => path.resolve(appDir, p),
}

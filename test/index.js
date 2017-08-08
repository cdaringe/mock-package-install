import test from 'ava'
var path = require('path')
var modMocker = require('../')
var fs = require('fs-extra')

test.before(t => {
  clean()
})

test.after(t => {
  clean()
})

function clean () {
  return [
    `${__dirname}/node_modules`,
    `${__dirname}/TEST_TARGET`
  ].forEach(pkg => fs.removeSync(pkg))
}

test('install/remove mock module', function (t) {
  var mock1 = modMocker.install()
  var mock1Dir = path.resolve(process.cwd(), 'node_modules', mock1.name)
  t.truthy(fs.statSync(mock1Dir), 'mock install dir exists')
  t.truthy(fs.statSync(path.resolve(mock1Dir, 'package.json')), 'mock install package.json exists')
  modMocker.remove({ name: mock1.name })
  t.throws(function () { fs.statSync(mock1Dir) }, Error, 'removes node_modules/mock_package_xyz')

  var mock2 = modMocker.install({ nodeModulesDir: path.resolve(process.cwd(), 'test/node_modules') })
  var mock2Dir = path.resolve(process.cwd(), 'test/node_modules', mock2.name)
  t.truthy(fs.statSync(mock2Dir), 'mock install dir exists w/ custom node_modules path')
  t.truthy(fs.statSync(path.resolve(mock2Dir, 'package.json')), 'mock install package.json exists w/ custom node_modules path')
  t.throws(() => modMocker.remove(), Error, 'remove requires opts')
  modMocker.remove({
    nodeModulesDir: path.resolve(process.cwd(), 'test/node_modules'),
    name: mock2.name
  })
  t.throws(function () { fs.statSync(mock2Dir) }, Error, 'removes package in custom node_modules/ path')
})

test('updates target package.json', function (t) {
  var targetRoot = path.join(__dirname, 'TEST_TARGET')
  var targetPackage = path.join(targetRoot, 'package.json')
  var targetNodeModulesDir = path.join(targetRoot, 'node_modules')
  var conf = {
    package: { name: 'TEST_NAME', version: 'TEST_VERSION' },
    nodeModulesDir: targetNodeModulesDir,
    targetPackage: targetPackage,
    isDev: true
  }
  fs.mkdirpSync(path.dirname(targetPackage))
  fs.writeFileSync(
    targetPackage,
    JSON.stringify({
      name: 'TEST_PARENT_PACKAGE',
      version: 'TEST_PARENT_VERSION'
    }, null, 2)
  )
  var mock1 = modMocker.install(conf)
  var mock1Dir = path.resolve(targetNodeModulesDir, mock1.name)
  t.truthy(fs.statSync(mock1Dir), 'mock install dir exists')
  t.truthy(fs.statSync(path.resolve(mock1Dir, 'package.json')), 'mock install package.json exists')
  var patchedTargetPackageJson = JSON.parse(fs.readFileSync(targetPackage))
  t.is(patchedTargetPackageJson.devDependencies.TEST_NAME, 'TEST_VERSION', 'target package.json updated')

  modMocker.remove(conf)
  patchedTargetPackageJson = JSON.parse(fs.readFileSync(targetPackage))
  t.is(patchedTargetPackageJson.devDependencies.TEST_NAME, undefined, 'target package.json updated on removal')
})

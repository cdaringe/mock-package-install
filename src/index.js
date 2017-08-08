/**
 * mock-package-install
 * @module mock-package-install
 */

var fs = require('fs-extra')
var path = require('path')
var defaults = require('lodash.defaults')
var rpkg = require('./random-package')

module.exports = {

/**
 * Installs mock package into node_modules & updates the corresponding package.json file
 * @param {object} opts
 * @param {object} [opts.package] JS object package.json. random package used if none provided
 * @param {string} [opts.nodeModulesDir] path to node_modules dir to install mock package into. looks for cwd/node_modules by default
 * @param {string} [opts.targetPackage] path to package.json file to update with the newly installed dependency's metadata
 * @param {boolean} [opts.isDev] put into devDependencies vs dependencies. used only with targetPackage
 * @example
 * mock.install({
 *   package: { name: 'TEST_NAME', version: 'TEST_VERSION' },
 *   nodeModulesDir: '/path/to/target/node_modules',
 *   targetPackage: '/path/to/target/package.json',
 *   isDev: true
 * })
 * @return {object} JS object package.json
 */
  install: function (opts) {
    opts = opts || {}
    opts = defaults(opts, {
      nodeModulesDir: path.resolve(process.cwd(), 'node_modules'),
      package: rpkg.gen(opts.package)
    })
    fs.mkdirpSync(path.resolve(opts.nodeModulesDir, opts.package.name))
    fs.writeFileSync(
      path.resolve(opts.nodeModulesDir, opts.package.name, 'package.json'),
      JSON.stringify(opts.package, null, 2)
    )
    if (opts.targetPackage) {
      var key = opts.isDev ? 'devDependencies' : 'dependencies'
      var targetPackage = JSON.parse(fs.readFileSync(opts.targetPackage))
      targetPackage[key] = targetPackage[key] || {}
      targetPackage[key][opts.package.name] = opts.package.version
      fs.writeFileSync(opts.targetPackage, JSON.stringify(targetPackage, null, 2))
    }
    return opts.package
  },

  /**
   * remove mock package
   * @param {object} opts
   * @param {string} opts.name package name to remove
   * @param {string} [opts.package.name] may be used instead of opts.name for consistency w/ install API
   * @param {string} [opts.nodeModulesDir] path to node_modules dir
   * @param {string} [opts.targetPackage] path to package.json file to update with the newly installed dependency's metadata
   * @param {boolean} [opts.isDev] put into devDependencies vs dependencies. used only with targetPackage
   */
  remove: function (opts) {
    var name
    if (opts && opts.name) name = opts.name
    if (opts && opts.package && opts.package.name) name = opts.package.name
    if (!name) throw new TypeError('package name missing')
    opts = defaults(opts, {
      nodeModulesDir: path.resolve(process.cwd(), 'node_modules')
    })
    fs.removeSync(path.resolve(opts.nodeModulesDir, name))
    if (opts.targetPackage) {
      var key = opts.isDev ? 'devDependencies' : 'dependencies'
      var targetPackage = JSON.parse(fs.readFileSync(opts.targetPackage))
      delete targetPackage[key][name]
      fs.writeFileSync(opts.targetPackage, JSON.stringify(targetPackage, null, 2))
    }
  }
}

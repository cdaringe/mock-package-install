[ ![Codeship Status for cdaringe/mock-package-install](https://app.codeship.com/projects/92d90090-5e18-0135-9f7a-4e783b460597/status?branch=master)](https://app.codeship.com/projects/238450) [![Coverage Status](https://coveralls.io/repos/github/cdaringe/mock-package-install/badge.svg?branch=master)](https://coveralls.io/github/cdaringe/mock-package-install?branch=master)

# mock-package-install

Generate a mock npm-like package installation.

You can also update a package.json as you add/remove packages.  See [the docs](http://cdaringe.github.io/mock-package-install)!

## usage

```js
var mockPackage = require('mock-package-install')
var mock1 = mockPackage.install() //=> node_modules/mock_package_1 now exists w/ package.json
mockPackage.remove({ name: mock1.name }) //=> removes the pkg folder
```

Of course this is all configurable.  Full API docs [live here](http://cdaringe.github.io/mock-package-install)

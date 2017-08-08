[ ![Codeship Status for cdaringe/mock-npm-install](https://codeship.com/projects/f54aa580-578b-0133-e7da-36edf9c92862/status?branch=master)](https://codeship.com/projects/109534)

# mock-package-install

Generate a mock npm-like package installation.

## usage

```js
var mockPackage = require('mock-npm-install')
var mock1 = mockPackage.install() //=> node_modules/mock_package_1 now exists w/ package.json
mockPackage.remove({ name: mock1.name }) //=> removes the pkg folder
```

Of course this is all configurable.  Full API docs [live here](http://cdaringe.github.io/mock-npm-install/index.html)

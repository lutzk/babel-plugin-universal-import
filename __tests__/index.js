const pluginTester = require('babel-plugin-tester')
const createBabylonOptions = require('babylon-options')
const plugin = require('../index')
const babel = require('babel-core')
const dynamicSyntax = require('babel-plugin-syntax-dynamic-import')
const stage2 = require('babel-preset-stage-2')
const es2015 = require('babel-preset-es2015')

const babelOptions = {
  filename: 'currentFile.js',
  parserOpts: createBabylonOptions({
    stage: 2
  })
}

pluginTester({
  plugin,
  babelOptions,
  snapshot: true,
  tests: {
    'static import': 'import("./Foo")',
    'static import (with relative paths)': 'import("../../Foo")',
    'static import (with file extension)': 'import("./Foo.js")',
    'static import (string template)': 'import(`./base`)',
    'static import (string template + relative paths)': 'import(`../../base`)',
    'dynamic import (string template)': 'import(`./base/${page}`)',
    'dynamic import (string template - dynamic at 1st segment)':
      'import(`./${page}`)',
    'dynamic import (string template + relative paths)':
      'import(`../../base/${page}`)',
    'await import() should receive a thennable without calling .then':
      'async ({ page }) => await import(`../components/${page}`);'
  }
})

// toggle from test.skip to test.only when working on the plugin using Wallaby
test.skip('wallaby-live-coding', () => {
  const input = 'async ({ page }) => await import(`../components/${page}`);'
  // const input = 'import("../../Foo.js")'

  const output = babel.transform(input, {
    filename: 'currentFile.js',
    plugins: [dynamicSyntax, plugin],
    presets: [es2015, stage2]
  })

  output.code /*? */
})

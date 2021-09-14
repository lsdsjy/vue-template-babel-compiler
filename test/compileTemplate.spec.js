const templateCompiler = require('../lib')
const Vue = require('vue')

// TODO enable esm `import {}` for jest
function toFunction(code) {
  return new Function(code)
}

test('template compile should work', () => {
  const msg = 'Hello vue-template-babel-compiler'
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`<div>${msg}</div>`)

  const vm = new Vue({
    render: toFunction(render)
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(msg)
  expect(errors.length === 0).toBeTruthy()
})

test('should extend template compile', () => {
  const functionType = 'function'
  expect(typeof templateCompiler).toMatch(functionType)
  expect(typeof templateCompiler.compile).toMatch(functionType)
  expect(typeof templateCompiler.parseComponent).toMatch(functionType)
  expect(typeof templateCompiler.compileToFunctions).toMatch(functionType)
  expect(typeof templateCompiler.ssrCompile).toMatch(functionType)
  expect(typeof templateCompiler.ssrCompileToFunctions).toMatch(functionType)
  expect(typeof templateCompiler.generateCodeFrame).toMatch(functionType)

  // use same compiler for ssr and non-ssr, fix: https://github.com/JuniorTour/vue-template-babel-compiler/issues/7
  expect(templateCompiler.ssrCompile).toEqual(templateCompiler.compile)
})

test('should work for functional component', () => {
  const msg = 'Functional Component'

  const {render} = templateCompiler.compile(
    `<div>${msg}</div>`,
    {filename: 'foo.functional.js'})

  expect(render).toMatch('var _c=_vm._c')
})

test('should use object.assign for object rest spread', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/9
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
    <h3 v-if="{...a}">object rest spread</h3>
`)

  expect(errors.length === 0).toBeTruthy()
  expect(render).toMatch(`Object.assign({}, _vm.a) ? _c('h3', [_vm._v("object rest spread")]) : _vm._e()`)
})

test('should use simple assign for computed properties', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/13
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(
    '<div :class="{[`${foo}_bar`]: true}"></div>'
  )

  expect(errors.length === 0).toBeTruthy()
  expect(render).toMatch('class: (_class = {}, _class[`${_vm.foo}_bar`] = true, _class)')
})

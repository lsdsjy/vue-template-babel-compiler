const transpile = require('./dist/index.js')
const Vue = require('vue')
const {compile} = require('vue-template-compiler')

function addWrapperForTranspile(code) {
  return `var __render__ = function (){${code}}`
}

const toFunction = code => {
  code = transpile(addWrapperForTranspile(code))
  code = code.replace(/var __render__ = function \(\) \{/g, '').slice(0, -2)
  return new Function(code)
}

const compileAsFunctions = template => {
  const {render, staticRenderFns} = compile(template)
  return {
    render: toFunction(render),
    staticRenderFns: staticRenderFns.map(toFunction)
  }
}

test('should work', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        <div>{{ foo }}</div>
        <div v-for="{ name } in items">{{ name }}</div>
        <div v-bind="{ ...a, ...b }"/>
      </div>
    `),
    data: {
      foo: 'hello',
      items: [
        {name: 'foo'},
        {name: 'bar'}
      ],
      a: {id: 'foo'},
      b: {class: 'bar'}
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(
    `<div>hello</div> ` +
    `<div>foo</div><div>bar</div> ` +
    `<div id="foo" class="bar"></div>`
  )
})

test('arg spread', () => {
  const res = compile(`
    <button @click="(...args) => { store.foo(...args) }">Go</button>
  `)
  const code = transpile(addWrapperForTranspile(res.render))
  expect(code).toMatch(`(_store = _vm.store).foo.apply(_store, arguments);`)
})

test('rest spread in scope position', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <foo v-slot="{ foo, ...rest }">{{ rest }}</foo>
    `),
    components: {
      foo: {
        render(h) {
          return h('div', this.$scopedSlots.default({
            foo: 1,
            bar: 2,
            baz: 3
          }))
        }
      }
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(
    JSON.stringify({bar: 2, baz: 3}, null, 2)
  )
})

// TODO
// test('should not output destructure', () => {
//   const vm = new Vue({
//     ...compileAsFunctions(`
//       <foo v-slot="{ foo, ...rest }">{{ rest }}</foo>
//     `),
//   })
// })

test('trailing function comma', () => {
  const spy = jest.fn()
  const vm = new Vue({
    ...compileAsFunctions(`
      <button @click="spy(1,)" />
    `),
    methods: {
      spy
    }
  }).$mount()
  vm.$el.click()
  expect(spy).toHaveBeenCalled()
})

test('v-model should work', () => {
  const vModelVal = 'foo'
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
            <input v-model="text" />
      </div>
    `),
    data: {
      text: vModelVal
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`<input>`)
  expect(vm.$el.querySelector('input').value).toMatch(vModelVal)
})

test('optional chaining should work', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        <h1 v-if="optional?.chaining">optional chaining worked</h1>
      </div>
    `),
    data: {
      optional: {
        chaining: true
      }
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`<h1>optional chaining worked</h1>`)
})

test('should work for __staticRenderFns__', () => {
  const transpileResult = transpile(`
var __render__ = function () {with (this) {return _m(0)}}
var __staticRenderFns__ = [
  function () {
    with (this) {
      return _c(
        'div', {attrs: {"id": "app"}},
        [
          _c('img', {attrs: {"alt": "Vue logo", "src": require("./assets/logo.png")}}),
          _c('p', [_v(" static "),
            _c('a', {attrs: {"href": "https://github.com/JuniorTour/vue-template-babel-compiler"}},
              [_v(" JuniorTour/vue-template-babel-compiler ")])
          ])
        ]
      )
    }
  }]
`)

  expect(transpileResult).toMatch(`[_vm._v(" JuniorTour/vue-template-babel-compiler ")]`)
})

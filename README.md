# vue-template-babel-compiler
Enable `Optional Chaining` and many new ES features for [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) based on [Babel](https://babeljs.io/).

## Features
- All features of [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler)
- `Optional Chaining` and more new ES features

## DEMO
### [TODO: DEMO Repo]()

![DEMO](https://user-images.githubusercontent.com/14243906/122856988-5b6f6600-d34a-11eb-89d6-21203b446ce4.png)

## Usage
``` js
# 1: In your Vue project directory
yarn add https://github.com/JuniorTour/vue-template-babel-compiler/tarball/main

# 2: Run a script to
# modify vue-template-es2015-compiler to this repo
# (If this repo got merged into the official repo, this step can be simplified.)
sh ./node_modules/vue-template-babel-compiler/updateVueTemplateBabelCompiler.sh

# 3. Enjoy~
```

## TODO

- [x] Support `__staticRenderFns__`
- [ ] More new ES features in SFC template:
  - [x] `Bigint`
  - [ ] `nullish coalescing`
  - [ ] ......
- [ ] publish NPM package
- [ ] PR to [vue-template-es2015-compiler official repo](https://github.com/vuejs/vue-template-es2015-compiler)
  - [ ] Then we can use this simpler without run


### Welcome for issue, PR.
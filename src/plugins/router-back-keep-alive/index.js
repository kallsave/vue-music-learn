import { inBrowser } from './util/env.js'
import Component from './components/router-keep.js'
import { routerHandler } from './router-plus/index.js'

let isInstalled = false

function install(Vue, router) {
  if (isInstalled) {
    return
  }
  isInstalled = true
  Vue.component(Component.name, Component)
  routerHandler(Vue, router)
}

const RouterKeep = {
  install: install,
}

if (inBrowser && window.Vue) {
  window.Vue.use(RouterKeep)
}

export default RouterKeep

import Component from './component.js'

let isInstalled = false

function install(Vue, router) {
  if (isInstalled) {
    return
  }
  isInstalled = true
  Vue.component(Component.name, Component)
  console.log('router', router)
}

const routerBackKeepAlive = {
  install: install,
}

export default routerBackKeepAlive

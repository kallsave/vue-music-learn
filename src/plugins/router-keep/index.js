import config from './config/index'
import routerKeepHelper from './api/router-keep-helper'
import Component from './components/router-keep'
import routerMiddle from './router-middle/index'
import { checkInt } from './util/lang'

let isInstalled = false

function install(Vue, options = {}) {
  if (!options.router) {
    console.error('parameter %crouter', 'color: orange', 'is required')
    return
  }
  if (options.max && !checkInt(options.max)) {
    console.error('parameter %cmax', 'color: orange', 'must be an integer')
    return
  }
  if (isInstalled) {
    return
  }
  isInstalled = true
  Object.assign(config, options)
  Vue.prototype.$routerKeepHelper = routerKeepHelper
  Vue.component(Component.name, Component)
  routerMiddle(Vue, config)
}

const VueRouterKeep = {
  install: install,
}

export default VueRouterKeep

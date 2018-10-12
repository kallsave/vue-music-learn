import Component from './toast-txt.vue'
import create from './api'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
  create(Vue, Component)
}

export default Component

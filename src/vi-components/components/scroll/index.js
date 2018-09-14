import Component from './scroll.vue'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

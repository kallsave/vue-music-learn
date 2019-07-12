import Component from './index-list.vue'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

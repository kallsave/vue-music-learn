import Component from './vi-progress-bar.vue'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

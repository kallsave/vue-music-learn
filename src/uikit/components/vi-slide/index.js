import Component from './vi-slide.vue'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

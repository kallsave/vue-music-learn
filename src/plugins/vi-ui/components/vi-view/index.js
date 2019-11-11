import Component from './vi-view.js'

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

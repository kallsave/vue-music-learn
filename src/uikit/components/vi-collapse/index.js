import Component from './vi-collapse.js'

console.log(Component)

Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component

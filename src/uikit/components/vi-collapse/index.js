import ViCollapse from './vi-collapse.vue'
import ViCollapseTransition from './vi-collapse-transition.js'

ViCollapse.install = function (Vue) {
  Vue.component(ViCollapse.name, ViCollapse)
  Vue.component(ViCollapseTransition.name, ViCollapseTransition)
}

export default ViCollapse

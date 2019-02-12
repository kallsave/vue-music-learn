import SwipeGroup from './vi-swipe-group.vue'
import Swipe from './vi-swipe.vue'

Swipe.install = function (Vue) {
  Vue.component(SwipeGroup.name, SwipeGroup)
  Vue.component(Swipe.name, Swipe)
}

export default Swipe

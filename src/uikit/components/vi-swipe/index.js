import Swipe from './vi-swipe-group.vue'
import SwipeItem from './vi-swipe.vue'

Swipe.install = function (Vue) {
  Vue.component(Swipe.name, Swipe)
  Vue.component(SwipeItem.name, SwipeItem)
}

export default Swipe

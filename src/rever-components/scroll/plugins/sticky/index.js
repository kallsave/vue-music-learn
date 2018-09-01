import Sticky from './sticky.vue'
import StickyEle from './sticky-ele.vue'

Sticky.install = function (Vue) {
  Vue.component(Sticky.name, Sticky)
  Vue.component(StickyEle.name, StickyEle)
}

Sticky.Ele = Sticky

export default Sticky

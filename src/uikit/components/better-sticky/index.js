import Sticky from './better-sticky.vue'
import StickyEle from './better-sticky-ele.vue'

Sticky.install = function (Vue) {
  Vue.component(Sticky.name, Sticky)
  Vue.component(StickyEle.name, StickyEle)
}

Sticky.Ele = Sticky

export default Sticky

import ViSlide from './vi-slide.vue'
import ViSlideItem from './vi-slide-item.vue'

ViSlide.install = function (Vue) {
  Vue.component(ViSlide.name, ViSlide)
  Vue.component(ViSlideItem.name, ViSlideItem)
}

export default ViSlide

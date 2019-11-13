import ViTab from './vi-tab.vue'
import ViTabItem from './vi-tab-item.vue'

ViTab.install = function (Vue) {
  Vue.component(ViTab.name, ViTab)
  Vue.component(ViTabItem.name, ViTabItem)
}

export default ViTab

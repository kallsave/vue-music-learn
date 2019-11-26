import ViActionSheet from './vi-action-sheet.vue'
import create from './api.js'

ViActionSheet.install = function (Vue) {
  Vue.component(ViActionSheet.name, ViActionSheet)
  create(Vue, ViActionSheet)
}

export default ViActionSheet

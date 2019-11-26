import ViConfirm from './vi-confirm.vue'
import create from './api.js'

ViConfirm.install = function (Vue) {
  Vue.component(ViConfirm.name, ViConfirm)
  create(Vue, ViConfirm)
}

export default ViConfirm

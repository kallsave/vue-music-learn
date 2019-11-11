import Component from './toast1.vue'
import mountInBody from '@/common/helpers/mount-in-body.js'

Component.install = function (Vue) {
  mountInBody(Vue, Component, false)
}

export default Component

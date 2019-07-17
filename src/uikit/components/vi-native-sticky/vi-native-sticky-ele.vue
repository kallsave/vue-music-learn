<template>
  <div class="vi-native-sticky-ele">
    <slot></slot>
  </div>
</template>

<script>
import { mulitDeepClone } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-native-sticky-ele'

export default {
  name: COMPONENT_NAME,
  inject: ['ViNativeSticky'],
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this.init()
      this.ViNativeSticky.calculateAllStickyEleTop()
    })
  },
  methods: {
    init() {
      const firstElementChild = this.$el.firstElementChild
      const stickyTop = firstElementChild.getBoundingClientRect().top - this.ViNativeSticky.fixedTop
      this.eleKey = stickyTop
      const clientWidth = firstElementChild.clientWidth
      const clientHeight = firstElementChild.clientHeight
      const boxSizing = window.getComputedStyle(firstElementChild).boxSizing
      const mergeEleKey = this.mergeEleKey
      this.$el.style.width = `${clientWidth}px`
      this.$el.style.height = `${clientHeight}px`
      this.$el.style.boxSizing = boxSizing
      this.ViNativeSticky.stickyMap[this.eleKey] = {
        eleComponent: this,
        $el: firstElementChild,
        calculate: this.calculate,
        stickyTop,
        clientWidth,
        clientHeight,
        mergeEleKey
      }
    },
    // 计算一些stickyTop的数值,异步的场景需要在sticky组件调用这个方法重新刷新stickyTop
    calculate(key) {
      const firstElementChild = this.$el.firstElementChild
      const stickyTop = firstElementChild.getBoundingClientRect().top - this.ViNativeSticky.fixedTop
      mulitDeepClone(this.ViNativeSticky.stickyMap[this.eleKey], {
        stickyTop
      })
    },
    _deleteEleKey() {
      delete this.ViNativeSticky.stickyMap[this.eleKey]
    },
  },
  beforeDestroy() {
    this._deleteEleKey()
  }
}
</script>

<template>
  <div class="vi-sticky-ele">
    <slot></slot>
  </div>
</template>

<script>
import { mulitDeepClone } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-sticky-ele'

export default {
  name: COMPONENT_NAME,
  inject: ['Sticky'],
  // props: {
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this._map()
      this.Sticky.calculateStickyTop()
    })
  },
  methods: {
    _map() {
      // 一开始进来的stickyTop作为独一无二的eleKey
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.Sticky.stickyTop - this.Sticky.fixedY
      this.$el.firstElementChild.eleKey = this.eleKey = stickyTop
      const clientWidth = this.$el.firstElementChild.clientWidth
      const clientHeight = this.$el.firstElementChild.clientHeight
      this.$el.style.width = `${clientWidth}px`
      this.$el.style.height = `${clientHeight}px`
      const map = {
        stickyTop,
        clientWidth,
        clientHeight,
      }
      this.Sticky.stickyMap[this.eleKey] = {
        eleComponent: this,
        $el: this.$el.firstElementChild,
        calculate: this.calculate
      }
      mulitDeepClone(this.Sticky.stickyMap[this.eleKey], map)
    },
    // 计算一些stickyTop的数值,异步的场景需要调用这个方法
    calculate(key) {
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.Sticky.stickyTop - this.Sticky.fixedY
      mulitDeepClone(this.Sticky.stickyMap[this.eleKey], {
        stickyTop
      })
    },
    _deleteEleKey() {
      delete this.Sticky.stickyMap[this.eleKey]
    }
  },
  destroyed() {
    this._deleteEleKey()
  }
}
</script>

<style lang="stylus">
</style>

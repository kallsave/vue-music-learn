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
  inject: ['ViSticky'],
  props: {
    mergeEleKey: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      isEnableSticky: true
    }
  },
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this.init()
      this.ViSticky.calculateAllStickyEleTop()
    })
  },
  methods: {
    init() {
      // 一开始进来的stickyTop作为独一无二的eleKey,
      // stickyTop是可能变动的,this.eleKey是初始进来的stickyTop,不会变动
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.ViSticky.$el.getBoundingClientRect().top - this.ViSticky.fixedY
      this.eleKey = stickyTop
      // 往后的操作就不再拿取el.clientWidth防止过多重排
      const clientWidth = this.$el.firstElementChild.clientWidth
      const clientHeight = this.$el.firstElementChild.clientHeight
      const boxSizing = window.getComputedStyle(this.$el.firstElementChild).boxSizing
      const mergeEleKey = this.mergeEleKey
      this.$el.style.width = `${clientWidth}px`
      this.$el.style.height = `${clientHeight}px`
      this.$el.style.boxSizing = boxSizing
      const map = {
        stickyTop,
        clientWidth,
        clientHeight,
        mergeEleKey
      }
      this.ViSticky.stickyMap[this.eleKey] = {
        eleComponent: this,
        $el: this.$el.firstElementChild,
        calculate: this.calculate
      }
      mulitDeepClone(this.ViSticky.stickyMap[this.eleKey], map)
    },
    // 计算一些stickyTop的数值,异步的场景需要在sticky组件调用这个方法重新刷新stickyTop
    calculate(key) {
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.ViSticky.$el.getBoundingClientRect().top - this.ViSticky.fixedY
      mulitDeepClone(this.ViSticky.stickyMap[this.eleKey], {
        stickyTop
      })
    },
    _deleteEleKey() {
      delete this.ViSticky.stickyMap[this.eleKey]
    }
  },
  enableSticky() {
    console.log(this.isEnableSticky)
  },
  disableSticky() {
    console.log(this.isEnableSticky)
  },
  destroyed() {
    this._deleteEleKey()
  }
}
</script>

<style lang="stylus">
</style>

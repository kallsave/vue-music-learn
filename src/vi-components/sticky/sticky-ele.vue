<template>
  <div class="vi-sticky-ele">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-sticky-ele'

export default {
  name: COMPONENT_NAME,
  inject: ['Sticky'],
  props: {
    eleKey: {
      type: [Number, String],
      require: true
    }
  },
  data() {
    return {
      stickyTop: 0
    }
  },
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this._map()
    })
  },
  methods: {
    _map() {
      this.$el.firstElementChild.eleKey = this.eleKey
      this.Sticky.stickyMap[this.eleKey] = {
        eleComponent: this,
        eleKey: this.eleKey,
        $el: this.$el.firstElementChild,
        calculate: this.calculate
      }
    },
    // 就算一些dom的数值,这些数据要考虑异步的场景
    calculate() {
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.Sticky.stickyTop - this.Sticky.fixedY
      const clientWidth = this.$el.firstElementChild.clientWidth
      const clientHeight = this.$el.firstElementChild.clientHeight
      const map = {
        stickyTop,
        clientWidth,
        clientHeight,
      }
      Object.assign(this.Sticky.stickyMap[this.eleKey], map)
      this.$el.style.width = `${clientWidth}px`
      this.$el.style.height = `${clientHeight}px`
    }
  },
  destroyed() {
    delete this.Sticky.stickyMap[this.eleKey]
  }
}
</script>

<style lang="stylus">
</style>

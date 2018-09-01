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
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this._map()
    })
  },
  methods: {
    _map() {
      this.$el.firstElementChild.eleKey = this.eleKey
      this.$el.style.height = `${this.$el.firstElementChild.clientHeight}px`
      this.Sticky.stickyMap[this.eleKey] = {
        eleComponent: this,
        eleKey: this.eleKey,
        $el: this.$el.firstElementChild,
        clientWidth: this.$el.firstElementChild.clientWidth,
        clientHeight: this.$el.firstElementChild.clientHeight,
        calculateStickyTop: this.calculateStickyTop
      }
      this.calculateStickyTop()
    },
    calculateStickyTop() {
      const stickyTop = this.$el.firstElementChild.getBoundingClientRect().top - this.Sticky.stickyTop
      this.Sticky.stickyMap[this.eleKey].stickyTop = stickyTop - this.Sticky.fixedY
      this.Sticky.calculateListHeight()
    }
  },
  destroyed() {
    delete this.Sticky.stickyMap[this.eleKey]
  }
}
</script>

<style lang="stylus">
</style>

<template>
  <div class="rever-sticky-ele">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'rever-sticky-ele'

export default {
  name: COMPONENT_NAME,
  inject: ['Sticky'],
  props: {
    eleKey: {
      type: [Number, String],
      require: true
    }
  },
  created() {
    this.Sticky.$on('change', function(a) {
      console.log('a', a)
    })
  },
  watch: {
    // 异步数据需要重写计算
    'Sticky.data'() {
      this.Sticky.scrollTop()
      this.$nextTick(() => {
        this._calculateStickyTop()
        this.Sticky.calculateListHeight()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._calculateStickyTop()
      // 使用computed不能在滚动的时候追踪
      this.Sticky.calculateListHeight()
    })
  },
  methods: {
    _calculateStickyTop() {
      const stickyTop = this.$el.getBoundingClientRect().top - this.Sticky.stickyTop
      this.Sticky.stickyMap[this.eleKey] = {
        eleKey: this.eleKey,
        stickyTop: stickyTop,
        $el: this.$el,
        clientHeight: this.$el.clientHeight
      }
    },
  }
}
</script>

<style lang="stylus">
.rever-sticky-ele
  position: relative

</style>

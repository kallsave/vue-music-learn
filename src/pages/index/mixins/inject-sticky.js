export const sticky = {
  inject: ['Sticky'],
  data() {
    return {
      scrollOptions: {
        probeType: 3,
        click: true
      }
    }
  },
  methods: {
    scrollHandler(pos) {
      if (pos.y >= 0) {
        this.Sticky.scroll.enable()
      }
      if (pos.y >= 50) {
        // 设置回弹阀值
        this.$refs.scroll.scroll.scrollTo(0, 0, 100)
      }
    },
  }
}

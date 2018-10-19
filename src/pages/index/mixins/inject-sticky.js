export const STICKY_TOP_BAR = 44

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
  activated() {
    this.$nextTick(() => {
      // this.Sticky.scroll.enable()
    })
  },
  methods: {
    scrollHandler(pos) {
      if (pos.y >= 0 && pos.y < STICKY_TOP_BAR) {
        this.Sticky.scroll.enable()
      } else if (pos.y >= STICKY_TOP_BAR) {
        // 设置回弹阀值
        // this.$refs.scroll.scroll.scrollTo(0, 0, 0)
      }
    },
  }
}

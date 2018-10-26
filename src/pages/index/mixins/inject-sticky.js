export const STICKY_TOP_BAR = 44

export const sticky = {
  inject: ['Sticky'],
  activated() {
    this.$nextTick(() => {
      // this.Sticky.scroll.enable()
    })
  },
  methods: {
    scrollHandler(pos) {
      console.log(pos.y)
      // if (pos.y >= 0 && pos.y <= STICKY_TOP_BAR) {
      //   this.Sticky.scroll.enable()
      // } else if (pos.y >= STICKY_TOP_BAR) {
      //   // 设置回弹阀值
      //   // this.$refs.scroll.scroll.scrollTo(0, 0, 0)
      // }

      // 采用slide做中间层后,scroll => slide => scroll的pos.y被隔断
      if (pos.y <= 0 && pos.y >= -STICKY_TOP_BAR) {
        this.disY = pos.y
        this.Sticky.scroll.scrollTo(0, pos.y, 0)
      } else if (pos.y < -STICKY_TOP_BAR && this.disY !== -STICKY_TOP_BAR) {
        this.disY = -STICKY_TOP_BAR
        this.Sticky.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
      }
    },
  }
}

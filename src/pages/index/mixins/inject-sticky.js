export const STICKY_TOP_BAR = 44

export const sticky = {
  inject: ['Sticky'],
  methods: {
    scrollHandler(pos) {
      if (pos.y < -STICKY_TOP_BAR && this.Sticky.$disY !== -STICKY_TOP_BAR) {
        this.Sticky.$disY = -STICKY_TOP_BAR
        this.Sticky.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
        this.Sticky.scroll.disable()
      } else if (pos.y >= 0 && pos.y <= STICKY_TOP_BAR && this.Sticky.$disY !== STICKY_TOP_BAR) {
        this.Sticky.$disY = STICKY_TOP_BAR
        this.Sticky.scroll.enable()
      }
    },
  }
}

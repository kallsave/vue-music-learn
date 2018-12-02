export const STICKY_TOP_BAR = 44

export const sticky = {
  inject: ['ViSticky'],
  methods: {
    scrollHandler(pos) {
      if (pos.y < -STICKY_TOP_BAR && this.ViSticky.$disY !== -STICKY_TOP_BAR) {
        this.ViSticky.$disY = -STICKY_TOP_BAR
        this.ViSticky.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
        this.ViSticky.scroll.disable()
      } else if (pos.y >= 0 && pos.y <= STICKY_TOP_BAR && this.ViSticky.$disY !== STICKY_TOP_BAR) {
        this.ViSticky.$disY = STICKY_TOP_BAR
        this.ViSticky.scroll.enable()
      }
    },
  }
}

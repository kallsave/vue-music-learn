export const STICKY_TOP_BAR = 44

export const injectStickyMixin = {
  inject: ['ViSticky'],
  methods: {
    scrollHandler(pos) {
      if (pos.y < -STICKY_TOP_BAR && this.ViSticky.$disY !== -STICKY_TOP_BAR) {
        this.ViSticky.$disY = -STICKY_TOP_BAR
        this.ViSticky.scroll.disable()
        this.ViSticky.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
      } else if (pos.y >= 0 && pos.y <= STICKY_TOP_BAR && this.ViSticky.$disY !== STICKY_TOP_BAR) {
        this.ViSticky.$disY = STICKY_TOP_BAR
        this.ViSticky.scroll.enable()
      } else if (pos.y > -STICKY_TOP_BAR) {
        if (pos.y >= 0) {
          this.ViSticky.scroll.disable()
          this.ViSticky.scroll.scrollTo(0, 0, 100)
          return
        }
        this.ViSticky.scroll.enable()
        this.ViSticky.scroll.scrollTo(0, pos.y, 100)
      }
    },
  }
}

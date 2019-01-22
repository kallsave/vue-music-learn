export const STICKY_TOP_BAR = 44

export const injectStickyMixin = {
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
      } else if (pos.y > -STICKY_TOP_BAR) {
        if (this.ViSticky.scroll.y >= 0) {
          return
        }
        this.ViSticky.scroll.scrollTo(0, pos.y, 0)
      }
    },
  }
}

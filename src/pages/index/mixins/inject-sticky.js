export const STICKY_TOP_BAR = 44

export function scrollHandler(pos) {
  const ViScroll = this.ViScroll
  if (pos.y < -STICKY_TOP_BAR && ViScroll.$disY !== -STICKY_TOP_BAR) {
    ViScroll.$disY = -STICKY_TOP_BAR
    ViScroll.scroll.disable()
    ViScroll.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
  } else if (pos.y >= 0 && pos.y <= STICKY_TOP_BAR && ViScroll.$disY !== STICKY_TOP_BAR) {
    ViScroll.$disY = STICKY_TOP_BAR
    ViScroll.scroll.enable()
  } else if (pos.y > -STICKY_TOP_BAR) {
    if (pos.y >= 0) {
      ViScroll.scroll.disable()
      ViScroll.scroll.scrollTo(0, 0, 100)
      return
    }
    ViScroll.scroll.enable()
    ViScroll.scroll.scrollTo(0, pos.y, 100)
  }
}

export const injectSticky = {
  inject: ['ViScroll'],
  methods: {
    scrollHandler: scrollHandler
  }
}

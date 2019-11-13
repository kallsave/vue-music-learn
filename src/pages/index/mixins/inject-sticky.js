export const STICKY_TOP_BAR = 44

export function scrollHandler(pos) {
  const ViScroll = this.ViScroll
  if (pos.y < -STICKY_TOP_BAR) {
    if (ViScroll.$disY !== -STICKY_TOP_BAR) {
      ViScroll.$disY = -STICKY_TOP_BAR
      ViScroll.scroll.refresh()
      ViScroll.scroll.scrollTo(0, -STICKY_TOP_BAR, 0)
      ViScroll.scroll.disable()
    }
  } else if (pos.y >= 0) {
    if (ViScroll.$disY !== STICKY_TOP_BAR) {
      ViScroll.$disY = STICKY_TOP_BAR
      ViScroll.scroll.enable()
      ViScroll.scroll.scrollTo(0, 0, 0)
    }
  }
}

export const injectSticky = {
  inject: ['ViScroll'],
  methods: {
    scrollHandler: scrollHandler
  }
}

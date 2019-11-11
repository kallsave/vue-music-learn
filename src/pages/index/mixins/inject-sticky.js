export const STICKY_TOP_BAR = 44

export function scrollHandler(pos) {
  const ViScroll = this.ViScroll
  if (pos.y < -STICKY_TOP_BAR) {
    if (ViScroll.$disY !== -STICKY_TOP_BAR) {
      ViScroll.$disY = -STICKY_TOP_BAR
      ViScroll.scroll.scrollTo(0, -29, 0)
      ViScroll.scroll.disable()
      // console.log(1)
    } else {
      // console.log(77)
    }
  } else if (pos.y >= -STICKY_TOP_BAR && pos.y <= 0) {
    ViScroll.scroll.enable()
    ViScroll.scroll.scrollTo(0, pos.y, 0)
  } else {
    if (ViScroll.$disY !== STICKY_TOP_BAR) {
      ViScroll.$disY = STICKY_TOP_BAR
      ViScroll.scroll.enable()
      ViScroll.scroll.scrollTo(0, 0, 0)
      // console.log(4)
    } else {
      // console.log(66)
    }
  }
}

export const injectSticky = {
  inject: ['ViScroll'],
  methods: {
    scrollHandler: scrollHandler
  }
}

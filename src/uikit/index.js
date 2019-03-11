import {
  Bscroll,
  Style,
  ViLoading,
  ViPopup,
  ViScroll,
  ViSlide,
  ViSlideRouterTransition,
  ViSticky,
  ViToast,
  ViToastTxt,
  ViSlideRouterView,
  ViView,
  ViInject,
  ViNativeSticky,
  ViCollapse,
  ViTab,
  ViActionSheet,
  ViSwipe,
  BetterSticky
} from './module.js'

const components = [
  ViLoading,
  ViPopup,
  ViScroll,
  ViSlide,
  ViSlideRouterTransition,
  ViSticky,
  ViToast,
  ViToastTxt,
  ViSlideRouterView,
  ViView,
  ViInject,
  ViNativeSticky,
  ViCollapse,
  ViTab,
  ViActionSheet,
  ViSwipe,
  BetterSticky
]

function install(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  components.forEach((Component) => {
    Component.install(Vue)
  })
}

const Vi = {
  version: '0.0.1',
  install,
  Bscroll,
}

export default Vi

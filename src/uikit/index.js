import {
  Bscroll,
  Style,
  ViLoadListCon,
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
} from './module.js'

const components = [
  ViLoadListCon,
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

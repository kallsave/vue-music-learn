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
  ViTips,
  ViSlideRouterView,
  ViView,
  ViInject,
  ViNativeSticky,
  ViCollapse,
  ViTab,
  ViActionSheet,
  ViSwipe,
  ViNativeScroll,
  ViUpload
} from './module.js'

const components = [
  ViLoading,
  ViPopup,
  ViScroll,
  ViSlide,
  ViSlideRouterTransition,
  ViSticky,
  ViToast,
  ViTips,
  ViSlideRouterView,
  ViView,
  ViInject,
  ViNativeSticky,
  ViCollapse,
  ViTab,
  ViActionSheet,
  ViSwipe,
  ViNativeScroll,
  ViUpload
]

function install(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  for (let i = 0; i < components.length; i++) {
    let Component = components[i]
    Component.install(Vue)
  }
}

const Vi = {
  version: '0.0.1',
  install,
  Bscroll,
}

export default Vi

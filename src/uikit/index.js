import ViLoadListCon from './components/vi-load-list-con/index.js'
import ViLoading from './components/vi-loading/index.js'
import ViPopup from './components/vi-popup/index.js'
import ViProgressBar from './components/vi-progress-bar/index.js'
import ViProgressCircle from './components/vi-progress-circle/index.js'
import ViScroll from './components/vi-scroll/index.js'
import ViSlide from './components/vi-slide/index.js'
import ViSlideRouterTransition from './components/vi-slide-router-transition/index.js'
import ViSticky from './components/vi-sticky/index.js'
import ViToast from './components/vi-toast/index.js'
import ViToastTxt from './components/vi-toast-txt/index.js'

const components = [
  ViLoadListCon,
  ViLoading,
  ViPopup,
  ViProgressBar,
  ViProgressCircle,
  ViScroll,
  ViSlide,
  ViSlideRouterTransition,
  ViSticky,
  ViToast,
  ViToastTxt,
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
}

export default Vi

import LoadListCon from './components/load-list-con/index.js'
import Loading from './components/loading/index.js'
import Popup from './components/popup/index.js'
import ProgressBar from './components/progress-bar/index.js'
import ProgressCircle from './components/progress-circle/index.js'
import Scroll from './components/scroll/index.js'
import Slide from './components/slide/index.js'
import SlideRouter from './components/slide-router/index.js'
import Sticky from './components/sticky/index.js'
import Toast from './components/toast/index.js'
import ToastTxt from './components/toast-txt/index.js'

const components = [
  LoadListCon,
  Loading,
  Popup,
  ProgressBar,
  ProgressCircle,
  Scroll,
  Slide,
  SlideRouter,
  Sticky,
  Toast,
  ToastTxt
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

import { showVConsole } from '@/common/jmeter/vconsole.js'
import Vue from 'vue'
import App from './App'
import router from './pages/router.js'
import store from './store/index.js'
import VueLazyLoad from 'vue-lazyload'

import '@/common/stylus/index.styl'
import Vi from '@/uikit/index.js'

import BaseLoadListCon from '@/base-components/load-list-con/index.js'
import BaseIndexList from '@/base-components/index-list/index.js'
import BaseSearchBox from '@/base-components/search-box/index.js'
import BaseProgressBar from '@/base-components/progress-bar/index.js'
import BaseProgressCircle from '@/base-components/progress-circle/index.js'
import BaseConfirm from '@/base-components/confirm/index.js'

Vue.use(Vi)
Vue.use(BaseLoadListCon)
Vue.use(BaseSearchBox)
Vue.use(BaseIndexList)
Vue.use(BaseProgressBar)
Vue.use(BaseProgressCircle)
Vue.use(BaseConfirm)

// 全局默认vue-lazyload配置,可以在局部组件自定义
// VueLazyLoad是非常优秀的插件,可以让长列表的部分渲染
Vue.use(VueLazyLoad, {
  lazyComponent: true,
  // 预加载,默认1.3
  preLoad: 1.5,
  error: require('@/assets/images/loading.png'),
  loading: require('@/assets/images/loading.png'),
  // 尝试次数
  attempt: 3,
  // 触发请求正确图片地址的事件行为
  listenEvents: ['scroll', 'mousewheel', 'animationend', 'transitionend'],
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  beforeMount() {
    const DEFAULT_TOAST_PROPS = {
      icon: 'loading',
      title: '加载中...',
      scale: 0.9,
      zIndex: 5000
    }

    let $toast = this.$createViToast(DEFAULT_TOAST_PROPS)

    Vue.prototype.$toast = $toast
    let $toastSourceShow = $toast.show
    let $toastSourceHide = $toast.hide

    $toast.show = function (props) {
      // vue-create-api, 更新数据用$updateProps(props)
      if (props) {
        this.$updateProps(props)
      }
      $toastSourceShow()
      return this
    }

    $toast.hide = function (props) {
      if (props) {
        this.$updateProps(props)
      }
      $toastSourceHide()
      return this
    }

    // 配置全局toastTxt的用法
    const DEFAULT_TOAST_TXT_PROPS = {
      title: '...',
      duration: 3000,
      zIndex: 5001
    }

    let $toastTxt = this.$createViToastTxt(DEFAULT_TOAST_TXT_PROPS)
    Vue.prototype.$toastTxt = $toastTxt

    let $toastTxtSourceShow = $toastTxt.show
    let $toastTxtSourceHide = $toastTxt.hide

    $toastTxt.show = function (props) {
      if (props) {
        this.$updateProps(props)
      }
      $toastTxtSourceShow()
      return this
    }

    $toastTxt.hide = function (props) {
      if (props) {
        this.$updateProps(props)
      }
      $toastTxtSourceHide()
      return this
    }

    showVConsole()
  }
})

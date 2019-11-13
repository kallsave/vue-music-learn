// import { showVConsole } from '@/common/jmeter/vconsole.js'
import '@/common/stylus/index.styl'
import Vue from 'vue'
import App from './App'
import router from './pages/router.js'
import store from './store/index.js'
import VueLazyLoad from 'vue-lazyload'
import VueRouterCache from './plugins/vue-router-cache/index.js'

import Viui from '@/plugins/vi-ui/index.js'

import BaseLoadListCon from '@/base/load-list-con/index.js'
import BaseIndexList from '@/base/index-list/index.js'
import BaseSearchBox from '@/base/search-box/index.js'
import BaseProgressBar from '@/base/progress-bar/index.js'
import BaseProgressCircle from '@/base/progress-circle/index.js'
import BaseConfirm from '@/base/confirm/index.js'

import recoverWebviewMixin from '@/common/mixins/recover-webview.js'

const NODE_ENV = process.env.NODE_ENV
console.log(NODE_ENV)

Vue.use(Viui)
Vue.use(BaseLoadListCon)
Vue.use(BaseSearchBox)
Vue.use(BaseIndexList)
Vue.use(BaseProgressBar)
Vue.use(BaseProgressCircle)
Vue.use(BaseConfirm)
Vue.use(VueRouterCache, {
  router: router,
  max: 10,
  isSingleMode: true,
  isDebugger: NODE_ENV !== 'production',
  directionKey: 'direction',
  getHistoryStack() {
    const str = window.sessionStorage.getItem('historyStack')
    return JSON.parse(str)
  },
  setHistoryStack(history) {
    const str = JSON.stringify(history)
    window.sessionStorage.setItem('historyStack', str)
  }
})

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
  mixins: [
    recoverWebviewMixin
  ],
  beforeMount() {
    this.createGlobal()
    // 一些由vue-create-api可以全局编程式调用的组件注册
    this.createGlobalToastApi()
    this.createGlobalTipsApi()
    // showVConsole()
  },
  methods: {
    createGlobal() {
      Vue.prototype.$global = {}
    },
    createGlobalToastApi() {
      this.$global.toast = this.$createViToast({
        icon: 'loading',
        title: '加载中...',
        scale: 0.9,
        zIndex: 5000
      })

      let originToastShow = this.$global.toast.show

      this.$global.toast.show = function (props) {
        if (props) {
          this.$updateProps(props)
        }
        originToastShow()
      }
    },
    createGlobalTipsApi() {
      this.$global.tips = this.$createViTips({
        title: '',
        zIndex: 5000 + 1,
        duration: 2000
      })

      let originTipsShow = this.$global.tips.show

      this.$global.tips.show = function (props) {
        if (props) {
          this.$updateProps(props)
        }
        originTipsShow()
      }
    },
  }
})

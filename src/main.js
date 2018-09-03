import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// vue-navigation貌似不是那么好用
// 需不需要keep-alive可以在vue的组件中具体设置
// import Navigation from 'vue-navigation'

// import fastclick from 'fastclick'

import '@/common/stylus/index.styl'
import ViScroll from '@/vi-components/scroll/index.js'
import ViSlide from '@/vi-components/slide/index.js'
import ViLoadListCon from '@/vi-components/load-list-con/index.js'
import ViPopup from '@/vi-components/popup/index.js'
import ViToast from '@/vi-components/toast/index.js'
import BodyViToast from '@/vi-components/toast/mount-in-body.js'
import ViLoading from '@/vi-components/loading/index.js'
import BaseIndexList from '@/base-components/index-list/index.js'
import ViSticky from '@/vi-components/sticky/index.js'
import ViProgressBar from '@/vi-components/progress-bar/index.js'
import ViProgressCircle from '@/vi-components/progress-circle/index.js'
import BaseSearchBox from '@/base-components/search-box/index.js'
import ViSlideRouter from '@/vi-components/slide-router/index.js'

import ReverScroll from '@/rever-components/scroll/index.js'
import ReverSticky from '@/rever-components/scroll/plugins/sticky/index.js'

// Vue.use(Navigation, {router, store})
Vue.use(ViScroll)
Vue.use(ViSlide)
Vue.use(ViLoadListCon)
Vue.use(ViToast)
Vue.use(ViPopup)
Vue.use(BodyViToast)
Vue.use(ViLoading)
Vue.use(BaseIndexList)
Vue.use(ViSticky)
Vue.use(ReverScroll)
Vue.use(ReverSticky)
Vue.use(ViProgressBar)
Vue.use(ViProgressCircle)
Vue.use(BaseSearchBox)
Vue.use(ViSlideRouter)

// fastclick.attach(document.body)

// 全局默认vue-lazyload配置,可以在局部组件自定义
// VueLazyLoad是非常优秀的插件,可以让长列表的部分渲染
Vue.use(VueLazyLoad, {
  lazyComponent: true,
  // 预加载,默认1.3
  preLoad: 1.3,
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
})

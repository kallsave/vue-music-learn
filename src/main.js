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
import Vi from '@/vi-components/index.js'

import BaseIndexList from '@/base-components/index-list/index.js'
import BaseSearchBox from '@/base-components/search-box/index.js'

import ReverScroll from '@/rever-components/scroll/index.js'
import ReverSticky from '@/rever-components/scroll/plugins/sticky/index.js'

Vue.use(Vi)
Vue.use(BaseSearchBox)
Vue.use(BaseIndexList)
Vue.use(ReverScroll)
Vue.use(ReverSticky)

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

import Vue from 'vue'
import Vuex from 'vuex'
import local from './cache/local-storage/index.js'

import createPersistedState from 'vuex-persistedstate'

// modules
import singers from './modules/singer/index.js'
import player from './modules/player/index.js'
import rankAlbum from './modules/rank-album/index.js'
import recommendAlbum from './modules/recommend-album/index.js'
import keepAliveName from './modules/keep-alive-name/keep-alive-name.js'
import searchHistory from './modules/search-history/search-history.js'
import routerTransition from './modules/router-transition/router-transition.js'
import routerTransitionState from './modules/router-transition-state/router-transition-state.js'
import keepAliveRouteList from './modules/keep-alive-route-list/keep-alive-route-list.js'

// 不需要vuex-persistedstate做可持续化的mutations
const persistedstateIgnoreMutations = [
  // keep-alive的组件不需要做可持续化
  'SET_MUTABLE_KEEP_ALIVE_NAME',
  'SET_IMMUTABLE_KEEP_ALIVE_NAME',
  // 搜索历史纪录用独立的可持续化时间
  'SET_SEARCH_HISTORY',
  // 路由过渡动画实现不需要做可持续化
  'SET_ROUTER_TRANSITION',
  // 路由过渡动画的状态不需要做可持续化
  'SET_ROUTER_TRANSITION_STATE',
  // 路由缓存记录不需要做可持续化
  'SET_KEEP_ALIVE_LIST'
]

let timerSlice = 1000 * 60 * 60

const VuexPlugins = [
  createPersistedState({
    key: 'vue-music',
    filter(mutations) {
      // 过滤掉
      if (persistedstateIgnoreMutations.indexOf(mutations.type) !== -1) {
        return false
      }
      return true
    },
    getState(key) {
      return local.get(key)
    },
    setState(key, value) {
      // 存储一分钟,因为操作的一个大的数据,在界面保持触发操作永远不会失效
      local.set(key, value, new Date().getTime() + timerSlice)
    },
  })
]

// const debug = process.env.NODE_ENV !== 'production'
const debug = false

if (debug) {
  const createLogger = require('vuex/dist/logger')()
  VuexPlugins.push(createLogger)
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    singers,
    player,
    rankAlbum,
    recommendAlbum,
    keepAliveName,
    searchHistory,
    routerTransition,
    routerTransitionState,
    keepAliveRouteList
  },
  strict: debug,
  plugins: VuexPlugins
})

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import createPersistedState from 'vuex-persistedstate'

// modules
import singers from './modules/singer/index.js'
import player from './modules/player/index.js'
import rankAlbum from './modules/rank-album/index.js'
import recommendAlbum from './modules/recommend-album/index.js'

// keep-alive
import KeepAliveName from './modules/keep-alive-name/keep-alive-name.js'

// store是集合了各种storages的操作,默认是不带expire的localStorage
// localStorage比cookie好,如果数据超过4k,cookie将丢失数据导致vuex没有保存
// 可以定制化自己的配置
// https://github.com/marcuswestin/store.js#make-your-own-build
const engine = require('store/src/store-engine')
const storages = [
  require('store/storages/localStorage')
]

const storePlugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]

const store = engine.createStore(storages, storePlugins)

const debug = process.env.NODE_ENV !== 'production'

const ignoreMutations = []
// const ignoreMutations = ['SET_RECOMMEND_ALBUM']

// localStore保存对象的prototype,需要注意
const VuexPlugins = [
  createPersistedState({
    key: 'vue-music',
    storage: {
      getItem: (key) => {
        return store.get(key)
      },
      setItem: (key, value) => {
        store.set(key, value, new Date().getTime() + 10000 * 60)
      },
      removeItem: (key) => store.remove(key)
    },
    // getState(key) {
    //   return store.get(key)
    // },
    // setState(key, value) {
    //   console.log('value', value)
    //   store.set(key, value, new Date().getTime() + 10000 * 60)
    // },
    filter(mutations) {
      // 过滤掉
      if (ignoreMutations.indexOf(mutations.type) !== -1) {
        return false
      }
      return true
    }
  })
]

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    singers,
    player,
    rankAlbum,
    recommendAlbum,
    KeepAliveName
  },
  strict: debug,
  plugins: debug ? VuexPlugins.concat([createLogger()]) : VuexPlugins
})

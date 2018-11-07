import Vue from 'vue'
import Vuex from 'vuex'

// modules
import singers from './modules/singer/index.js'
import player from './modules/player/index.js'
import rankAlbum from './modules/rank-album/index.js'
import recommendAlbum from './modules/recommend-album/index.js'

// keep-alive
import mutableKeepAliveName from './modules/keep-alive/mutable-keep-alive-name.js'

import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

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

// createPersistedState和Vuex结合缺陷之一,不能保存对象的prototype,需要注意
// createPersistedState和Vuex结合缺陷之二,不能区分处理key的报存时间,而是把整个vuex报存
// createPersistedState只能处理常规的数据,需要其他需求用store操作
const VuexPlugins = [
  createPersistedState({
    storage: {
      getItem: (key) => {
        return store.get(key)
      },
      setItem: (key, value) => {
        store.set(key, value, new Date().getTime() + 10000 * 60)
      },
      removeItem: (key) => store.remove(key)
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
    mutableKeepAliveName
  },
  strict: debug,
  plugins: debug ? VuexPlugins.concat([createLogger()]) : VuexPlugins
})

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

// store是集合了各种storages的操作,默认是不带expire的localStorage
// 可以定制化自己的配置
// https://github.com/marcuswestin/store.js#make-your-own-build
const engine = require('store/src/store-engine')
const storages = [
  require('store/storages/cookieStorage')
]

const storePlugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]

const store = engine.createStore(storages, storePlugins)

const debug = process.env.NODE_ENV !== 'production'

const VuexPlugins = [
  createPersistedState({
    storage: {
      getItem: (key) => store.get(key),
      setItem: (key, value) => {
        store.set(key, value, new Date().getTime() + 10000 * 60)
      },
      removeItem: (key) => store.remove(key)
    }
  })
]

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? VuexPlugins.concat([createLogger()]) : VuexPlugins
})

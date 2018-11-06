// 项目有始终keep-alive的immutable-keep-alive
// 和可能会在数据变更需要临时不keep-alive的mutable-keep-alive
// 这个vuex模块是提供在跳转到需要keep-alive可变更的页面的简洁方案
import { MUTABLE_KEEP_ALIVE_NAME, TEMP_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'

const DEFAULT_TEMP_TIME = 1000

const types = {
  SET_MUTABLE_KEEP_ALIVE_NAME: 'SET_MUTABLE_KEEP_ALIVE_NAME'
}

const mutableKeepAliveName = {
  state: {
    mutableKeepAliveName: MUTABLE_KEEP_ALIVE_NAME
  },
  getters: {
    mutableKeepAliveName: (state) => state.mutableKeepAliveName
  },
  mutations: {
    [types.SET_MUTABLE_KEEP_ALIVE_NAME](state, mutableKeepAliveName) {
      state.mutableKeepAliveName = mutableKeepAliveName
    }
  },
  actions: {
    tempDisableMutableKeepAliveName({ commit }, { tempKeepAliveName = TEMP_KEEP_ALIVE_NAME, mutableKeepAliveName = MUTABLE_KEEP_ALIVE_NAME, time = DEFAULT_TEMP_TIME } = {}) {
      commit(types.SET_MUTABLE_KEEP_ALIVE_NAME, tempKeepAliveName)
      setTimeout(() => {
        commit(types.SET_MUTABLE_KEEP_ALIVE_NAME, mutableKeepAliveName)
      }, time)
    },
  }
}

export default mutableKeepAliveName

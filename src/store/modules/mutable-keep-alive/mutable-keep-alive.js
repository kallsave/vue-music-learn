// 项目有始终keep-alive的immutable-keep-alive
// 和可能会在数据变更需要临时不keep-alive的mutable-keep-alive
// 这个vuex模块是提供在跳转到需要变更keep-alive的页面的简洁方案
const DEFAULT_MUTABLE_KEEP_ALIVE = 'mutable-keep-alive'
const TEMP_KEEP_ALIVE = 'temp-keep-alive'
const DEFAULT_TEMP_TIME = 1000

const types = {
  SET_MUTABLE_KEEP_ALIVE: 'SET_MUTABLE_KEEP_ALIVE'
}

const mutableKeepAlive = {
  state: {
    mutableKeepAlive: DEFAULT_MUTABLE_KEEP_ALIVE
  },
  getters: {
    mutableKeepAlive: (state) => state.mutableKeepAlive
  },
  mutations: {
    [types.SET_MUTABLE_KEEP_ALIVE](state, mutableKeepAlive) {
      state.mutableKeepAlive = mutableKeepAlive
    }
  },
  actions: {
    tempDisableMutableKeepAlive({ commit }, { tempKeepAlive = TEMP_KEEP_ALIVE, mutableKeepAlive = DEFAULT_MUTABLE_KEEP_ALIVE, time = DEFAULT_TEMP_TIME } = {}) {
      commit(types.SET_MUTABLE_KEEP_ALIVE, tempKeepAlive)
      setTimeout(() => {
        commit(types.SET_MUTABLE_KEEP_ALIVE, mutableKeepAlive)
      }, time)
    },
  }
}

export default mutableKeepAlive

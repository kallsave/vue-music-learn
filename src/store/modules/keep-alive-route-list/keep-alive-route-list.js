// 利用stack管理keep-alive的方案

import Stack from '@/common/class/stack.js'

const keepAliveStack = new Stack(8)

const types = {
  SET_KEEP_ALIVE_LIST: 'SET_KEEP_ALIVE_LIST',
}

const keepAliveRouteList = {
  state: {
    keepAliveRouteList: keepAliveStack.getList().slice(),
  },
  getters: {
    keepAliveRouteList: (state) => state.keepAliveRouteList,
  },
  mutations: {
    [types.SET_KEEP_ALIVE_LIST](state, keepAliveRouteList) {
      state.keepAliveRouteList = keepAliveRouteList
    },
  },
  actions: {
    // actions只能传一个参数
    // 添加已存在缓存路由时添加无效,原缓存路由位置置顶
    keepAliveRouteAdd({ commit }, componentName) {
      keepAliveStack.add(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 快捷删除上一个缓存路由,相当于backToByIndex(1)
    keepAliveRouteReduce({ commit }) {
      keepAliveStack.reduce()
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 删除上一个缓存路由再添加一个路由,相当于先reduce再add
    keepAliveRouteReplace({ commit }, componentName) {
      keepAliveStack.replace(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 删除从这个缓存路由连同比这个缓存路由先缓存的路由
    keepAliveRouteRemoveFrom({ commit }, componentName) {
      keepAliveStack.removeFrom(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 删除指定的缓存路由
    keepAliveRouteRemove({ commit }, componentName) {
      keepAliveStack.remove(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 清除所有缓存路由
    keepAliveRouteClearAll({ commit }) {
      keepAliveStack.clearAll()
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 清除出了参数以外的其他缓存路由
    keepAliveRouteClearExclude({ commit }, componentName) {
      keepAliveStack.clearExclude(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 缓存路由清除到这个缓存路由为止
    keepAliveRouteBackTo({ commit }, componentName) {
      keepAliveStack.backTo(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 缓存路由清除index步
    keepAliveRouteBackToByIndex({ commit }, index) {
      keepAliveStack.backToByIndex(index)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
  }
}

export default keepAliveRouteList

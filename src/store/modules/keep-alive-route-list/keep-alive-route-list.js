// 利用stack管理keep-alive的方案

import Stack from '@/common/class/stack.js'

const keepAliveStack = new Stack(5)

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
    // 添加已存在缓存路由时添加无效,原缓存路由位置置顶
    addKeepAliveRoute({ commit }, componentName) {
      keepAliveStack.add(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 快捷删除上一个缓存路由,相当于backToByIndex(1)
    reduceKeepAliveRoute({ commit }, componentName) {
      keepAliveStack.reduce(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 删除从这个缓存路由连同比这个缓存路由先缓存的路由
    removeFromKeepAliveRoute({ commit }, element) {
      keepAliveStack.removeFrom(element)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 删除指定的缓存路由
    removeKeepAliveRoute({ commit }, componentName) {
      keepAliveStack.remove(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 清除所有缓存路由
    clearKeepAliveRoute({ commit }) {
      keepAliveStack.clearData()
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 缓存路由清除到这个缓存路由为止
    backToKeepAliveRoute({ commit }, componentName) {
      keepAliveStack.backTo(componentName)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
    // 缓存路由清除index步
    backToByIndexKeepAliveRoute({ commit }, index) {
      keepAliveStack.backToByIndex(index)
      let keepAliveRouteList = keepAliveStack.getList().slice()
      commit(types.SET_KEEP_ALIVE_LIST, keepAliveRouteList)
    },
  }
}

export default keepAliveRouteList

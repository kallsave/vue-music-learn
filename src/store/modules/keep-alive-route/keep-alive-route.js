// 利用stack管理keep-alive的方案

import Stack from '@/common/class/stack.js'

const keepAliveStack = new Stack(5)

const types = {
  SET_KEEP_ALIVE_LIST: 'SET_KEEP_ALIVE_LIST',
}

const keepAliveRouteList = {
  state: {
    keepAliveRouteList: keepAliveStack.getData(),
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

  }
}

export default keepAliveRouteList

// 存储浏览器history

import { browserHistoryGet, browserHistoryAdd, browserHistoryReduce } from '../../cache/local-storage/modules/browser-history-list/browser-history-list.js'

const types = {
  SET_BROWSER_HISTORY_LIST: 'SET_BROWSER_HISTORY_LIST',
}

const browserHistoryList = {
  state: {
    browserHistoryList: browserHistoryGet(),
  },
  getters: {
    browserHistoryList: (state) => state.browserHistoryList,
  },
  mutations: {
    [types.SET_BROWSER_HISTORY_LIST](state, browserHistoryList) {
      state.browserHistoryList = browserHistoryList
    },
  },
  actions: {
    browserHistoryAdd({ commit }, url) {
      let browserHistoryList = browserHistoryAdd(url)
      commit(types.SET_BROWSER_HISTORY_LIST, browserHistoryList)
    },
    browserHistoryReduce({ commit }) {
      let browserHistoryList = browserHistoryReduce()
      commit(types.SET_BROWSER_HISTORY_LIST, browserHistoryList)
    },
  }
}

export default browserHistoryList

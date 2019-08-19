// 搜索历史

import { searchHistoryAdd, searchHistoryGet, searchHistoryDelete, searchHistoryClear } from '../../cache/local-storage/modules/search-history-list/search-history-list.js'

const types = {
  SET_SEARCH_HISTORY_LIST: 'SET_SEARCH_HISTORY_LIST',
}

const searchHistoryList = {
  state: {
    // 搜索记录
    searchHistoryList: searchHistoryGet(),
  },
  getters: {
    searchHistoryList: (state) => state.searchHistoryList
  },
  mutations: {
    [types.SET_SEARCH_HISTORY_LIST](state, searchHistoryList) {
      state.searchHistoryList = searchHistoryList
    },
  },
  actions: {
    searchHistoryAdd({ commit }, query) {
      commit(types.SET_SEARCH_HISTORY_LIST, searchHistoryAdd(query))
    },
    searchHistoryDelete({ commit }, query) {
      commit(types.SET_SEARCH_HISTORY_LIST, searchHistoryDelete(query))
    },
    searchHistoryClear({ commit }) {
      commit(types.SET_SEARCH_HISTORY_LIST, searchHistoryClear())
    }
  }
}

export default searchHistoryList

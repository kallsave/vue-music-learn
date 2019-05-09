// 搜索历史

import { saveSearch, loadSearch, deleteSearch, clearSearch } from '../../cache/local-storage/modules/search-history/search-history.js'

const types = {
  SET_SEARCH_HISTORY: 'SET_SEARCH_HISTORY',
}

const searchHistory = {
  state: {
    // 搜索记录
    searchHistory: loadSearch(),
  },
  getters: {
    searchHistory: (state) => state.searchHistory
  },
  mutations: {
    [types.SET_SEARCH_HISTORY](state, searchHistory) {
      state.searchHistory = searchHistory
    },
  },
  actions: {
    saveSearchHistoryLocalStorage({ commit }, query) {
      commit(types.SET_SEARCH_HISTORY, saveSearch(query))
    },
    deleteSearchHistoryLocalStorage({ commit }, query) {
      commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
    },
    clearSearchHistoryLocalStorage({ commit }) {
      commit(types.SET_SEARCH_HISTORY, clearSearch())
    }
  }
}

export default searchHistory

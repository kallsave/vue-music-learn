const types = {
  SET_SEARCH_HISTORY: 'SET_SEARCH_HISTORY',
}

const searchHistory = {
  state: {
    // 搜索记录
    searchHistory: [],
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
    saveSearchHistoryLocalStorage({ commit }, searchHistory) {
      commit(types.SET_SEARCH_HISTORY, searchHistory)
    }
  }
}

export default searchHistory

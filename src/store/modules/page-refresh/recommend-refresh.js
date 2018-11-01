const types = {
  SET_RECOMMEND_REFRESH: 'SET_RECOMMEND_REFRESH'
}

const recommendRefresh = {
  state: {
    recommendRefresh: false
  },
  getters: {
    recommendRefresh: (state) => state.recommendRefresh
  },
  mutations: {
    [types.SET_RECOMMEND_REFRESH](state, recommendRefresh) {
      state.recommendRefresh = recommendRefresh
    }
  },
  actions: {

  }
}

export default recommendRefresh

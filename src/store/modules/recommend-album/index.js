// 推荐的详情

const types = {
  SET_RECOMMEND_ALBUM: 'SET_RECOMMEND_ALBUM'
}

const recommendAlbum = {
  state: {
    recommendAlbum: {}
  },
  getters: {
    recommendAlbum: (state) => state.recommendAlbum
  },
  mutations: {
    [types.SET_RECOMMEND_ALBUM](state, recommendAlbum) {
      state.recommendAlbum = recommendAlbum
    }
  },
  actions: {

  }
}

export default recommendAlbum

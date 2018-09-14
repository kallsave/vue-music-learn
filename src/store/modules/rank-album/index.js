// mutations.type
const types = {
  SET_RANK_ALBUM: 'SET_RANK_ALBUM'
}

const rankAlbum = {
  state: {
    rankAlbum: {},
  },
  getters: {
    rankAlbum: (state) => state.rankAlbum
  },
  mutations: {
    [types.SET_RANK_ALBUM](state, rankAlbum) {
      state.rankAlbum = rankAlbum
    },
  },
  actions: {

  }
}

export default rankAlbum

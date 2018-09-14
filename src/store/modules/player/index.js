import { playMode } from './config.js'
import { shuffle } from '@/common/helpers/util.js'
import { Song } from '@/common/class/song.js'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// mutations.type
const types = {
  SET_SINGER: 'SET_SINGER',
  SET_PLAY_LIST: 'SET_PLAY_LIST',
  SET_SEQUENCE_LIST: 'SET_SEQUENCE_LIST',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  SET_PLAYING_STATE: 'SET_PLAYING_STATE',
  SET_FULL_SCREEN: 'SET_FULL_SCREEN',
  SET_PLAY_MODE: 'SET_PLAY_MODE',
}

const player = {
  state: {
    // 顺序列表
    sequenceList: [],
    // 播放列表
    playList: [],
    // 当前播放列表的index,通过这个值和playList可以得到播放的音乐
    currentIndex: -1,
    // 是否在播放
    playing: false,
    // 是否满屏
    fullScreen: false,
    // 播放模式默认是sequence (0)
    mode: playMode.sequence,
  },
  getters: {
    sequenceList: (state) => state.sequenceList,
    playList: (state) => state.playList,
    currentIndex: (state) => state.currentIndex,
    currentSong: (state) => {
      return state.playList[state.currentIndex] || {}
    },
    playing: (state) => state.playing,
    fullScreen: (state) => state.fullScreen,
    mode: (state) => state.mode
  },
  mutations: {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
    [types.SET_SEQUENCE_LIST](state, list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_LIST](state, list) {
      state.playList = list
    },
    [types.SET_CURRENT_INDEX](state, index) {
      state.currentIndex = index
    },
    [types.SET_PLAYING_STATE](state, flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAY_MODE](state, mode) {
      state.mode = mode
    },
  },
  actions: {
    selectPlay({ commit, state }, { list, index }) {
      commit(types.SET_SEQUENCE_LIST, list)
      if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAY_LIST, randomList)
        index = findIndex(randomList, list[index])
      } else {
        commit(types.SET_PLAY_LIST, list)
      }
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_PLAYING_STATE, true)
      commit(types.SET_FULL_SCREEN, true)
    },
    randomPlay({ commit }, { list }) {
      commit(types.SET_PLAY_MODE, playMode.random)
      commit(types.SET_SEQUENCE_LIST, list)
      let randomList = shuffle(list)
      commit(types.SET_PLAY_LIST, randomList)
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_PLAYING_STATE, true)
      commit(types.SET_FULL_SCREEN, true)
    },
    insertSong({ commit, state }, song) {
      let playList = state.playList.slice()
      let sequenceList = state.sequenceList.slice()

      // 在playList中插
      let currentIndex = state.currentIndex
      let currentSong = playList[currentIndex]
      // 查找当前列表中是否有代插入的歌曲并返回索引
      let fpIndex = findIndex(playList, currentSong)
      currentIndex++
      // 插入这首歌到当前索引位置
      playList.splice(currentIndex, 0, song)
      if (fpIndex !== -1) {
        if (currentIndex > fpIndex) {
          // 如果插入歌曲在播放索引的前面,要删除并currentIndex--
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          // 如果插入歌曲在播放索引的后面,要删除不需要currentIndex--
          playList.splice(fpIndex + 1, 1)
        }
      }

      // 在sequenceList中插
      let currentSIndex = findIndex(sequenceList, currentSong) + 1

      let fsIndex = findIndex(sequenceList, song)

      sequenceList.splice(currentSIndex, 0, song)

      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }

      commit(types.SET_PLAY_LIST, playList)
      commit(types.SET_SEQUENCE_LIST, sequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    },

    // localStorage不能存储class的问题
    addSongClass({ state, commit }) {
      let playList = state.playList.map((item) => {
        return new Song(item)
      })
      let sequenceList = state.sequenceList.map((item) => {
        return new Song(item)
      })
      commit(types.SET_PLAY_LIST, playList)
      commit(types.SET_SEQUENCE_LIST, sequenceList)
    }
  }
}

export default player

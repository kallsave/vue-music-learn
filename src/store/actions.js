// 多次去改变mutations
import * as types from './mutation-type.js'
import { playMode } from './config.js'
import { shuffle } from '@/common/helpers/util.js'
import { Song } from '@/common/class/song.js'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const insertSong = function ({commit, state}, song) {
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

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// localStorage不能存储class的问题
export const addSongClass = function ({state, commit}) {
  let playList = state.playList.map((item) => {
    return new Song(item)
  })
  let sequenceList = state.sequenceList.map((item) => {
    return new Song(item)
  })
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  console.log(state.playList)
}

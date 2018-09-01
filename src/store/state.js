import { playMode } from './config.js'

const state = {
  // 歌手
  singer: {},
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
  disc: {},
  topList: {}
}

export default state

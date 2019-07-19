import { mapGetters, mapMutations } from 'vuex'
import { playModeOptions } from '@/store/modules/player/config.js'
import { shuffle } from '@/common/helpers/utils.js'

const playMode = {
  ...mapGetters([
    'sequenceList',
    'currentSong',
    'mode',
    'playList',
  ]),
  computed: {
    modeText() {
      return this.mode === playModeOptions.sequence ? '列表循环' : this.mode === playModeOptions.random ? '随机播放' : '单曲循环'
    },
    iconMode() {
      return this.mode === playModeOptions.sequence
        ? 'icon-sequence'
        : this.mode === playModeOptions.loop
          ? 'icon-loop'
          : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAY_LIST',
      setPlayMode: 'SET_PLAY_MODE',
    }),
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playModeOptions.random) {
        list = shuffle(this.sequenceList)
        this.$global.tips.show({
          title: '随机播放',
          durtaion: 2000
        })
      } else if (mode === playModeOptions.loop) {
        list = this.sequenceList
        this.$global.tips.show({
          title: '单曲循环',
          durtaion: 2000
        })
      } else {
        list = this.sequenceList
        this.$global.tips.show({
          title: '列表循环',
          durtaion: 2000
        })
      }
      // 先改变currentIndex再改变playList
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      // currentSong的getter会自动根据playList和currentIndex得出
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
  },
}

export default playMode

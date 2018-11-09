import { mapGetters } from 'vuex'
export const playListMixin = {
  data() {
    return {
      hadHandlerPlayList: false,
      playerHeight: '60'
    }
  },
  mounted() {
    if (this.playList.length && !this.hadHandlerPlayList) {
      this.hadHandlerPlayList = true
      this.handlePlayList()
    }
  },
  activated() {
    if (this.playList.length && !this.hadHandlerPlayList) {
      this.hadHandlerPlayList = true
      this.handlePlayList()
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal, oldVal) {
      if (newVal.length && !oldVal.length && !this.hadHandlerPlayList) {
        this.hadHandlerPlayList = true
        this.handlePlayList()
      }
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  },
}

export const playerMixin = {

}

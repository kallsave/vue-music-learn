import { mapGetters } from 'vuex'
export const playListMixin = {
  data() {
    return {
      hadHandlerPlayList: false
    }
  },
  mounted() {
    if (this.playList.length && !this.hadHandlerPlayList) {
      console.log('mounted playList')
      this.hadHandlerPlayList = true
      this.handlePlayList()
    }
  },
  activated() {
    if (this.playList.length && !this.hadHandlerPlayList) {
      console.log('activated playList')
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

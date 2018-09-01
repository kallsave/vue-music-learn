import { mapGetters } from 'vuex'
// import { playMode } from '@/store/config'

export const playListMixin = {
  mounted() {
    this.handlePlayList(this.playList)
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playerMixin = {

}

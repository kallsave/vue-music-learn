import { mapGetters } from 'vuex'
export const playListMixin = {
  data() {
    return {
      playerHeight: '60'
    }
  },
  mounted() {
    if (this.playList.length) {
      this.handlePlayList()
    }
  },
  activated() {
    if (this.playList.length) {
      window.setTimeout(() => {
        console.log('refresh')
        this.handlePlayList()
      }, 350)
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  },
}

export const playerMixin = {

}

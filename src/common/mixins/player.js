import { mapGetters } from 'vuex'
import { AFTER_ENTER } from '@/store/modules/router-transition-state/config.js'

const playerPaddingBottom = {
  data() {
    return {
      playerHeight: '60'
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'routerTransitionState'
    ])
  },
  mounted() {
    if (this.playList.length) {
      this.handlePlayList()
    }
  },
  // activated() {
  //   if (this.playList.length) {
  //     window.setTimeout(() => {
  //       this.handlePlayList()
  //     }, 350)
  //   }
  // },
  watch: {
    routerTransitionState: {
      handler(newVal) {
        if (newVal === AFTER_ENTER) {
          window.setTimeout(() => {
            if (this.playList.length) {
              this.handlePlayList()
            }
          }, 20)
        }
      }
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  },
}

export default playerPaddingBottom

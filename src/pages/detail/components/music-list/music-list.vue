<template>
  <div :class="$style['music']">
    <div class="header">
      <div class="back" @touchstart="back">
        <i class="icon-back"></i>
      </div>
      <h1 ref="title" class="title">{{title}}</h1>
    </div>
    <div ref="bgImage" class="bg-image" :style="bgStyle">
      <div ref="filter" class="filter"></div>
    </div>
    <div ref="stickyWrapper"
      class="sticky-wrapper">
      <vi-native-sticky
        ref="sticky"
        @sticky-change="stickyChange"
        @sticky-cancel="stickyCancel">
        <vi-scroll
          ref="scroll"
          :data="[songList]"
          :options="scrollOptions"
          :scrollEvents="['scroll']"
          @scroll="scrollHandler">
          <div ref="scrollBlank" class="scroll-blank">
            <vi-native-sticky-ele v-if="isFetchSongList">
              <div class="play-wrapper">
                <div ref="playBtn" class="play"
                  @click="random($event)">
                  <i class="icon-play"></i>
                  <span class="text">随机播放全部</span>
                </div>
              </div>
            </vi-native-sticky-ele>
          </div>
          <div class="song-list-wrapper">
            <song-list
              :rank="rank"
              :song-list="songList"
              @select="selectItem"></song-list>
          </div>
        </vi-scroll>
      </vi-native-sticky>
    </div>
  </div>
</template>

<script>
import SongList from '@/components/song-list/song-list.vue'
import playerPaddingBottom from '@/common/mixins/play-padding-bottom.js'
import { prefixStyle } from '@/common/helpers/dom.js'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'

const TRANSFORM = prefixStyle('transform')
const BACKDROP_FILTER = prefixStyle('backdrop-filter')

const RESERVED_HEIGHT = 40

export default {
  components: {
    SongList
  },
  mixins: [
    playerPaddingBottom,
    createThrottleInstance
  ],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songList: {
      type: Array,
      default() {
        return []
      }
    },
    isFetchSongList: {
      type: Boolean,
      default: false
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollOptions: {
        probeType: 3,
        click: true
      },
      scrollY: 0,
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
    ]),
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    scrollY: {
      handler(newVal) {
        // 契合滚动的图片放大公式
        const percent = Math.abs(newVal / this.imageHeight)
        let scale = 1
        let blur = 0
        let opacity = 0
        if (newVal > 0) {
          scale = 1 + percent
        } else {
          blur = Math.min(10, percent * 10)
          opacity = Math.max(0, percent - 0.2)
        }
        this.$refs.bgImage.style[TRANSFORM] = `scale(${scale})`
        this.$refs.title.style['opacity'] = opacity
        this.$refs.filter.style[BACKDROP_FILTER] = `blur(${blur}px)`
      }
    },
    isFetchSongList: {
      handler(newVal) {
        this.$refs.scroll.refresh()
      }
    }
  },
  created() {
    this.imageHeight = document.body.clientWidth * 0.7
  },
  mounted() {
    this.$refs.scrollBlank.style.height = `${this.imageHeight - RESERVED_HEIGHT}px`
  },
  methods: {
    ...mapMutations({
      setRouterTransition: 'SET_ROUTER_TRANSITION'
    }),
    ...mapActions([
      'selectPlay',
      'randomPlay',
    ]),
    handlePlayList() {
      this.$refs.stickyWrapper.style.paddingBottom = `${60}px`
      this.$refs.scroll.refresh()
    },
    back() {
      this.setRouterTransition({
        name: 'move-left',
        mode: ''
      })
      this.$router.back()
    },
    scrollHandler({ y }) {
      this.scrollY = y
      this.$refs.sticky.listenScrollY(-y)
    },
    stickyChange(currentSticky) {
      this.$refs.bgImage.style.paddingTop = `${currentSticky.clientHeight + RESERVED_HEIGHT}px`
      this.$refs.bgImage.style.zIndex = 5
    },
    stickyCancel() {
      this.$refs.bgImage.style.paddingTop = `70%`
      this.$refs.bgImage.style.zIndex = 0
    },
    selectItem(e, item, index) {
      this.throttle.run(() => {
        this.selectPlay({
          list: this.songList,
          index: index
        })
      })
    },
    random(e) {
      this.throttle.run(() => {
        this.randomPlay({
          list: this.songList
        })
      })
    }
  },
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/var/z-index.styl"
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/mixin.styl"

.music
  :global
    position: absolute
    width: 100%
    z-index: $z-index-page
    top: 0
    bottom: 0
    // left: 0
    // right: 0
    background: $color-background
    .header
      position: absolute
      width: 100%
      height: 40px
      top: 0
      left: 0
      z-index: $z-index-page
      .back
        position absolute
        top: 0
        left: 6px
        z-index: $z-index-normal
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large-x
          color: $color-theme
      .title
        position: absolute
        top: 0
        left: 10%
        z-index: $z-index-normal
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
        opacity: 0
    .bg-image
      position: absolute
      width: 100%
      height: 0
      // margin/padding的百分比都是父元素的宽度
      padding-top: 70%
      transform-origin: top
      background-size: cover
      z-index: 0
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
        z-index: -1
    .sticky-wrapper
      position: absolute
      box-sizing: border-box
      top: 40px
      bottom: 0
      width: 100%
      .scroll-blank
        position: relative
        background: transparent
      .song-list-wrapper
        padding: 20px 30px
        background: $color-background

    // sticky的样式要写在外围
    .play-wrapper
      box-sizing: border-box
      position: absolute
      padding-top: 20px
      padding-bottom: 20px
      bottom: -1px
      width: 100%
      // background: $color-background
      // border-bottom: 1px solid #ccc
      .play
        box-sizing: border-box
        width: 135px
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          line-height: 30px
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
</style>

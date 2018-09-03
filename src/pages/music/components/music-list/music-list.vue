<template>
  <div class="music">
    <div class="header">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div ref="bgImage" class="bg-image" :style="bgStyle">
      <div ref="filter" class="filter"></div>
    </div>
    <div ref="stickyWrapper" class="sticky-wrapper">
        <vi-sticky
          ref="sticky"
          :options="scrollOptions"
          @sticky-change="stickyChange"
          @scroll="scrollHandler"
          @sticky-cancel="stickyCancel">
          <div class="scroll-blank" ref="scrollBlank">
            <vi-sticky-ele :ele-key="11" v-show="isFetchSongList">
              <div class="play-wrapper">
                <div ref="playBtn" class="play" @click="random($event)">
                  <i class="icon-play"></i>
                  <span class="text">随机播放全部</span>
                </div>
              </div>
            </vi-sticky-ele>
          </div>
          <div class="song-list-wrapper">
            <vi-loading
              ref="songLoading"
              :scale="0.8"
              :title-color="'#ffcd32'"
              :icon-color="'#ffcd32'"></vi-loading>
            <song-list
              :rank="rank"
              :song-list="songList"
              @select="selectItem"></song-list>
          </div>
        </vi-sticky>
    </div>
  </div>
</template>

<script>
import SongList from '@/components/song-list/song-list.vue'
import { playListMixin } from '@/common/mixins/player.js'
import { prefixStyle } from '@/common/helpers/dom.js'
import { mapActions } from 'vuex'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
const filter = prefixStyle('filter')

const RESERVED_HEIGHT = 40

export default {
  mixins: [playListMixin],
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
  created() {
    this.imageHeight = document.body.clientWidth * 0.7
  },
  mounted() {
    this.$refs.songLoading.show()
    this.$refs.scrollBlank.style.height = `${this.imageHeight - RESERVED_HEIGHT}px`
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    scrollY(newVal) {
      // 契合滚动的图片放大公式
      const percent = Math.abs(newVal / this.imageHeight)
      let scale = 1
      let blur = 0
      if (newVal > 0) {
        scale = 1 + percent
      } else {
        blur = Math.min(5, percent * 5)
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    },
    isFetchSongList(newVal) {
      if (newVal) {
        this.$refs.songLoading && this.$refs.songLoading.hide()
        this.$nextTick(() => {
          this.$refs.sticky.refresh()
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay',
    ]),
    handlePlayList(playList) {
      if (playList.length) {
        this.$refs.stickyWrapper.style.paddingBottom = `${60}px`
        this.$refs.sticky.refresh()
      }
    },
    back() {
      this.$router.back()
    },
    scrollHandler({ y }) {
      this.scrollY = y
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
      if (!e._constructed) {
        return
      }
      this.selectPlay({
        list: this.songList,
        index: index
      })
    },
    random(e) {
      if (!e._constructed) {
        return
      }
      this.randomPlay({
        list: this.songList
      })
    }
  },
  components: {
    SongList
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

.music
  position: fixed
  z-index: $z-index-page
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .header
    position: fixed
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

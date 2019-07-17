<template>
  <vi-popup
    :class="$style['play-list-popup']"
    v-model="isVisible"
    transitionName="list-fade"
    :transitionDuration="transitionDuration"
    @mask-click="maskClick">
    <div slot="custom-content" class="list-wrapper">
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="iconMode" @click="changeMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="tryDeleteSongList"><i class="icon-clear"></i></span>
        </h1>
      </div>
      <vi-scroll
        ref="scroll"
        class="list-content"
        :options="scrollOptions"
        :data="sequenceList">
        <vi-collapse-transition-group tag="ul">
          <li ref="listItem"
            class="item"
            v-for="(item, index) in sequenceList"
            :key="item.id"
            @click="selectItem(item, index)">
            <i class="icon" :class="{'icon-play': getCurrentIcon(item)}"></i>
            <span class="text">{{item.name}}</span>
            <span class="like">
              <i class="icon-not-favorite"></i>
            </span>
            <span class="delete" @click="deleteItem(item)">
              <i class="icon-delete"></i>
            </span>
          </li>
        </vi-collapse-transition-group>
      </vi-scroll>
      <div class="list-operate">
        <div class="add">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span>关闭</span>
      </div>
    </div>
  </vi-popup>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import visibilityMixin from '@/common/mixins/visibility.js'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'
import playMode from '@/common/mixins/play-mode.js'
import { playModeOptions } from '@/store/modules/player/config.js'

export default {
  mixins: [
    visibilityMixin,
    createThrottleInstance,
    playMode
  ],
  data() {
    return {
      transitionDuration: {
        enter: 300,
        leave: 300
      },
      scrollOptions: {
        click: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
    ]),
  },
  watch: {
    currentSong: {
      handler(newVal, oldVal) {
        if (!this.isVisible || newVal.id === oldVal.id) {
          return
        }
        this.scrollToCurrent(newVal)
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayList: 'SET_PLAY_LIST',
      setPlayMode: 'SET_PLAY_MODE',
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ]),
    show() {
      this.isVisible = true
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    maskClick() {
      this.hide()
    },
    getCurrentIcon(item) {
      return this.currentSong.id === item.id
    },
    selectItem(item, index) {
      this.throttle.run(() => {
        if (this.mode === playModeOptions.random) {
          index = this.playList.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      })
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((item) => {
        return current.id === item.id
      })
      if (index !== -1) {
        this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 200)
      }
    },
    tryDeleteSongList(item) {
      this.$createBaseConfirm({
        text: '确定要删除吗?',
        onConfirm: () => {
          this.deleteSongList()
        }
      }).show()
    },
    deleteItem(item) {
      this.throttle.run(() => {
        this.deleteSong(item)
      })
    },
  }
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/mixin.styl"

.play-list-popup
  &:global.list-fade-enter
    opacity: 0
    .list-wrapper
      transform: translate3d(0, 100%, 0)
  &:global.list-fade-enter-active
    transition: all 300ms
    .list-wrapper
      transition: all 300ms
  &:global.list-fade-enter-to
    opacity: 1
    .list-wrapper
      transform: translate3d(0, 0, 0)
  &:global.list-fade-leave
    opacity: 1
    .list-wrapper
      transform: translate3d(0, 0, 0)
  &:global.list-fade-leave-active
    transition: all 300ms
    .list-wrapper
      transition: all 300ms
  &:global.list-fade-leave-to
    opacity: 0
    .list-wrapper
      transform: translate3d(0, 100%, 0)
  :global
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 20px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          .icon
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            no-wrap()
            flex: 1
            line-height: 40px
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>

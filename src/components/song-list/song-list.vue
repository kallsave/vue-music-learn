<template>
  <div :class="$style['song-list']">
    <ul>
      <li class="song-list-item"
        v-for="(song, index) in songList"
         :key="index"
        @click="selectItem($event, song, index)">
        <div class="song-list-rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="song-list-content">
          <h2 class="song-list-name">{{song.name}}</h2>
          <p class="song-list-desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const EVENT_SELECT = 'select'

export default {
  props: {
    songList: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(e, item, index) {
      // 提高组件的复用性,e的判断在其他组件完成
      this.$emit(EVENT_SELECT, ...arguments)
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/mixin.styl"

.song-list
  :global
    .song-list-item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      .song-list-rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('./images/first')
          &.icon1
            bg-image('./images/second')
          &.icon2
            bg-image('./images/third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .song-list-content
        flex: 1
        line-height: 20px
        overflow: hidden
        .song-list-name
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .song-list-desc
          no-wrap()
          margin-top: 4px
          font-size: $font-size-medium
          color: $color-text-d
</style>

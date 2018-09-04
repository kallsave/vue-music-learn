<template>
  <div class="rank" ref="rank">
    <div ref="scrollWrapper" class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :scroll-events="['scroll']"
        :options="scrollOptions"
        :data="[rankList]"
        @scroll="scrollHandler">
        <vi-loading
          ref="rankListLoading"
          :scale="0.8"
          :title-color="'#ffcd32'"
          :icon-color="'#ffcd32'"></vi-loading>
        <ul>
          <li class="item" :key="index"
            v-for="(item, index) in rankList"
            @click="selectItem($event, item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl"/>
            </div>
            <ul class="songlist">
              <li class="song" :key="index"
                v-for="(song, index) in item.songList">
                <span>{{index + 1}}</span>
                <span>{{song.songname}}-{{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import { getTopList } from '@/api/rank.js'
import { playListMixin } from '@/common/mixins/player.js'
import { mapMutations } from 'vuex'
import { sticky } from '../../mixins/inject-sticky.js'

export default {
  mixins: [sticky, playListMixin],
  data() {
    return {
      rankList: [],
    }
  },
  mounted() {
    this.$refs.rankListLoading.show()
    this._getTopList()
  },
  watch: {
    // rankList() {
    //   setTimeout(() => {
    //     this.$Lazyload.lazyLoadHandler()
    //   }, 20)
    // }
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    handlePlayList(playList) {
      if (playList.length) {
        this.$refs.scrollWrapper.style.paddingBottom = `${60}px`
        this.$refs.scroll.refresh()
      }
    },
    _getTopList() {
      getTopList().then((res) => {
        this.$refs.rankListLoading && this.$refs.rankListLoading.hide()
        this.rankList = res.data.topList
      })
    },
    selectItem(e, item) {
      // 有bug,阻止不了原生的click
      if (!e._constructed) {
        return
      }
      this.$router.push({
        path: `/music/rank-detail/${item.id}`
      })
      this.setTopList(item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
@import "~@/common/stylus/mixin.styl"

.rank
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  .scroll-wrapper
    position: relative
    box-sizing: border-box
    height: 100vh
    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px
      &:last-child
        padding-bottom: 20px
      .icon
        flex: 0 0 100px
        width: 100px
        height: 100px
      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        .song
          no-wrap()
          line-height: 26px
</style>

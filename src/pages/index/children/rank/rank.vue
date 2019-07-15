<template>
  <div class="rank" ref="rank">
    <div ref="scrollWrapper" class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :scroll-events="['scroll']"
        :options="scrollOptions"
        :data="[rankList]"
        @scroll="scrollHandler">
        <ul class="rank-list">
          <li class="item" :key="index"
            v-for="(item, index) in rankList"
            @click="selectItem($event, item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl"/>
            </div>
            <ul class="song-name-list">
              <li class="song-name" :key="index"
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
import playerPaddingBottom from '@/common/mixins/play-padding-bottom.js'
import { mapMutations } from 'vuex'
import { injectSticky } from '../../mixins/inject-sticky.js'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'
import keepAliveRouteManager from '@/common/mixins/keep-alive-route-manager.js'

export default {
  name: 'index-rank',
  mixins: [
    injectSticky,
    playerPaddingBottom,
    createThrottleInstance,
    keepAliveRouteManager
  ],
  data() {
    return {
      rankList: [],
      scrollOptions: {
        probeType: 3,
        click: true,
        directionLockThreshold: 0,
      },
    }
  },
  mounted() {
    this._getTopList()
  },
  methods: {
    ...mapMutations({
      setRankAlbum: 'SET_RANK_ALBUM'
    }),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${this.playerHeight}px`
      this.$refs.scroll.refresh()
    },
    _getTopList() {
      this.$createViToast({
        icon: 'loading',
        titleColor: '#ffcd32',
        iconColor: '#ffcd32',
        scalc: 0.8,
      }).show()
      getTopList().then((res) => {
        this.rankList = res.data.topList
        this.$createViToast({
          icon: 'loading',
          titleColor: '#ffcd32',
          iconColor: '#ffcd32',
          scalc: 0.8,
        }).hide()
      })
    },
    selectItem(e, item) {
      this.throttle.run(() => {
        this.setRankAlbum(item)
        // this.$router.push({
        //   path: `/music/rank-detail/${item.id}`
        // })
        this.$router.push({
          name: 'detail-rank',
          params: {
            id: item.id
          }
        })
      })
    },
  }
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/mixin.styl"

.rank
  width: 100%
  height: calc(100vh - 44px)
  // height: 100vh
  overflow: hidden
  background: $color-background
  // position: relative
  .scroll-wrapper
    box-sizing: border-box
    width: 100%
    height: calc(100vh - 44px)
    // height: 100vh
    .rank-list
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
        .song-name-list
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
          .song-name
            no-wrap()
            line-height: 26px
</style>

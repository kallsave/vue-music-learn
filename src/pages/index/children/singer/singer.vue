<template>
  <div :class="$style['singer']">
    <div ref="scrollWrapper"
      class="index-list-scroll-wrapper">
      <vi-index-list
        ref="scroll"
        :data="singerList"
        :options="scrollOptions"
        @select="selectSinger"
        @scroll="scrollHandler">
      </vi-index-list>
    </div>
  </div>
</template>

<script>
import Singer from '@/common/class/singer.js'
import playerPaddingBottom from '@/common/mixins/play-padding-bottom.js'
import { getSingerList } from '@/api/singer.js'
import { mapMutations } from 'vuex'
import { injectSticky } from '../../mixins/inject-sticky.js'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'
import keepAliveRouteManager from '@/common/mixins/keep-alive-route-manager.js'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  name: 'index-singer',
  mixins: [
    injectSticky,
    playerPaddingBottom,
    createThrottleInstance,
    keepAliveRouteManager
  ],
  data() {
    return {
      singerList: [],
      scrollOptions: {
        probeType: 3,
        click: true,
      },
    }
  },
  mounted() {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER',
    }),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${this.playerHeight}px`
      this.$refs.scroll.refresh()
    },
    _getSingerList() {
      this.$global.toast.show({
        icon: 'loading',
        titleColor: '#ffcd32',
        iconColor: '#ffcd32',
        scalc: 0.8,
      })
      setTimeout(() => {
        getSingerList().then((res) => {
          this.singerList = this._normalizeSinger(res.data.list)
          this.$global.toast.hide()
        })
      }, 500)
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        // 对象的属性读取可以轻松实现Array.every
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-z]/i)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    selectSinger(singer) {
      this.throttle.run(() => {
        this.setSinger(singer)
        // this.$router.push({
        //   path: `/music/singer-detail/${singer.id}`
        // })
        this.$router.push({
          name: 'detail-singer',
          params: {
            id: singer.id
          }
        })
      })
    },
  }
}
</script>

<style lang="stylus" module>
.singer
  width: 100%
  height: calc(100vh - 44px)
  background: $color-background
  overflow: hidden
  :global
    .index-list-scroll-wrapper
      box-sizing: border-box
      width: 100%
      height: calc(100vh - 44px)
      // height: 100vh
</style>

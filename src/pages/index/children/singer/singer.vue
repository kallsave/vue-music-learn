<template>
  <div class="singer">
    <div ref="scrollWrapper" class="index-list-scroll-wrapper">
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
import { IMMUTABLE_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import Singer from '@/common/class/singer.js'
import { playListMixin } from '@/common/mixins/player.js'
import { getSingerList } from '@/api/singer.js'
import { mapMutations } from 'vuex'
import { sticky } from '../../mixins/inject-sticky.js'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  name: IMMUTABLE_KEEP_ALIVE_NAME,
  mixins: [sticky, playListMixin],
  data() {
    return {
      singerList: [],
      scrollOptions: {
        probeType: 3,
        click: true,
        directionLockThreshold: 0,
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
      this.$createViToast({
        icon: 'loading',
        titleColor: '#ffcd32',
        iconColor: '#ffcd32',
        scalc: 0.8,
      }).show()
      setTimeout(() => {
        getSingerList().then((res) => {
          this.singerList = this._normalizeSinger(res.data.list)
          this.$createViToast({
            icon: 'loading',
            titleColor: '#ffcd32',
            iconColor: '#ffcd32',
            scalc: 0.8
          }).hide()
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
      this.setSinger(singer)
      // this.$router.push({
      //   path: `/music/singer-detail/${singer.id}`
      // })
      this.$router.push({
        path: `/new-music/singer-detail/${singer.id}`
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable"

.singer
  width: 100%
  height: calc(100vh - 44px)
  background: $color-background
  overflow: hidden
  .index-list-scroll-wrapper
    box-sizing: border-box
    width: 100%
    height: calc(100vh - 44px)
</style>

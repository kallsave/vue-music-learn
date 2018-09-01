<template>
  <div class="singer">
    <div ref="scrollWrapper" class="index-list-scroll-wrapper">
      <vi-loading
        ref="singerLoading"
        :center="false"
        :scale="0.8"
        :title-color="'#ffcd32'"
        :icon-color="'#ffcd32'"></vi-loading>
      <vi-index-list
        ref="scroll"
        :data="singerList"
        @select="selectSinger"
        @scroll="scrollHandler">
      </vi-index-list>
    </div>
  </div>
</template>

<script>
import { playListMixin } from '@/common/mixins/player.js'
import { getSingerList } from '@/api/singer.js'
import { mapMutations } from 'vuex'
import { sticky } from '../../mixins/inject-sticky.js'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  mixins: [sticky, playListMixin],
  data() {
    return {
      singerList: []
    }
  },
  mounted() {
    this.$refs.singerLoading.show()
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER',
    }),
    handlePlayList(playList) {
      if (playList.length) {
        this.$refs.scrollWrapper.style.paddingBottom = `${44 + 60}px`
        this.$refs.scroll.refresh()
      }
    },
    _getSingerList() {
      getSingerList().then((res) => {
        this.$refs.singerLoading.hide()
        this.singerList = this._normalizeSinger(res.data.list)
      })
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
          map.hot.items.push({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        const key = item.Findex
        // 对象的属性读取可以轻松实现Array.every
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({
          name: item.Fsinger_name,
          id: item.Fsinger_mid,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
        })
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
      this.$router.push({
        path: `/music-list/singer-detail/${singer.id}`
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable"

.singer
  position: relative
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  .index-list-scroll-wrapper
    position: relative
    height: 100vh
    box-sizing: border-box
    padding-bottom: 44px
</style>

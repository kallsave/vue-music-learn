<template>
  <div class="search">
    <div ref="scrollWrapper" class="search-sticky-wrapper">
      <vi-sticky
        ref="scroll"
        :scroll-events="['scroll']"
        :options="scrollOptions"
        @scroll="scrollHandler">
        <vi-sticky-ele :ele-key="'search'">
          <div class="search-box-wrapper">
            <base-search-box
              ref="searchBox"
              v-model="query"
              @clear="clearHandler"></base-search-box>
          </div>
        </vi-sticky-ele>
        <div class="shortcut-scroll-wrapper" v-show="!query">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" :key="index"
                v-for="(item, index) in hotKey"
                @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="result-scroll-wrapper" v-show="query">
          <ul class="suggest-list">
            <li class="suggest-item" :key="index"
              v-for="(item, index) in result">
              <div class="icon">
                <i :class="getIconCls(item)"></i>
              </div>
              <div class="name">
                <p class="text" v-html="getDisplayName(item)"></p>
              </div>
            </li>
          </ul>
        </div>
      </vi-sticky>
    </div>
  </div>
</template>

<script>
import { getHotKey, search } from '@/api/search.js'
import { sticky } from '../../mixins/inject-sticky.js'
import { createSong } from '@/common/class/song.js'
import { debounce } from '@/common/helpers/util.js'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  mixins: [sticky],
  props: {
    isShowSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hotKey: [],
      page: 1,
      query: '',
      result: []
    }
  },
  created() {
    this._getHotKey()
    this.$watch('query', debounce((newVal) => {
      this.search().then(() => {
        this.$nextTick(() => {
          console.log('refresh')
          if (newVal) {
            this.Sticky.scroll.enable()
            this.Sticky.scroll.refresh()
            this.$refs.scroll.scroll.enable()
            this.$refs.scroll.scroll.refresh()
          } else {
            this.Sticky.scroll.disable()
            this.$refs.scroll.scroll.disable()
          }
        })
      })
    }, 2000))
  },
  mounted() {
    this.$nextTick(() => {
      if (this.query) {
        this.Sticky.scroll.enable()
        this.$refs.scroll.scroll.enable()
      } else {
        this.Sticky.scroll.disable()
        this.$refs.scroll.scroll.disable()
      }
    })
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        this.hotKey = res.data.hotkey.slice(0, 10)
        console.log(this.hotKey)
      })
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    search() {
      return new Promise((resolve, reject) => {
        search({
          w: this.query,
          p: this.page,
          catZhida: this.isShowSinger ? 1 : 0,
          n: perpage,
          perpage: perpage,
        }).then((res) => {
          this.result = this._genResult(res.data)
          resolve()
        })
      })
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    clearHandler() {
      console.log(666)
      this.query = ''
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

.search
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  .search-sticky-wrapper
    position: relative
    height: 100vh
    box-sizing: border-box
    padding-bottom: 80px
    .search-box-wrapper
      box-sizing: border-box
      padding: 20px
      background: $color-background
    .shortcut-scroll-wrapper
      position: relative
      box-sizing: border-box
      height: 100vh
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          line-height: 43px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
    .result-scroll-wrapper
      position: relative
      box-sizing: border-box
      height: 100vh
      overflow: hidden
      .suggest-list
        box-sizing: border-box
        padding: 0 30px
        .suggest-item
          display: flex
          align-items: center
          padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

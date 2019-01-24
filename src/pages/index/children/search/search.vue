<template>
  <div ref="search" class="search">
    <div ref="scrollWrapper" class="search-scroll-wrapper">
      <vi-sticky
        ref="scroll"
        :data="result"
        :scroll-events="['scroll']"
        :options="scrollOptions"
        @scroll="scrollHandler"
        @pulling-up="onPullingUp">
        <vi-sticky-ele>
          <div class="search-box-wrapper">
            <base-search-box
              ref="searchBox"
              v-model="query"
              @clear="clearHandler"
              @focus="focusHandler"></base-search-box>
          </div>
        </vi-sticky-ele>
        <div class="shortcut-wrapper" v-show="!query">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul class="hot-key-list">
              <li class="item" :key="index"
                v-for="(item, index) in hotKey"
                @click="hotSearch(item)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="result-scroll-wrapper" v-show="query">
          <ul class="suggest-list">
            <li class="suggest-item" :key="index"
              v-for="(item, index) in result"
              @click="selectItem(item)">
              <div class="icon">
                <i :class="getIconClass(item)"></i>
              </div>
              <div class="name">
                <p class="text" v-html="getDisplayName(item)"></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="no-result-wrapper" v-show="query && !result.length && isFetchSearch" >
          <no-result :title="'抱歉，暂无搜索结果'"></no-result>
        </div>
        <template slot="pull-up" slot-scope="scope">
          <div class="vi-scroll-pullup">
            <div v-if="scope.pullUpScope.isPullUpLoad" class="vi-scroll-pullup-trigger">
              <div class="vi-scroll-pullup-before-trigger">{{scope.pullUpScope.pullUpTxt}}</div>
              <div class="vi-scroll-pullup-after-trigger">
                <loading></loading>
              </div>
            </div>
            <div v-if="isFetchSearch && scope.pullUpScope.isPullUpLoad && scope.pullUpScope.pullUpDirty && scope.pullUpScope.data.length && scope.pullUpScope.noMoreTxt"
              class="vi-scroll-pullup-no-more">{{scope.pullUpScope.noMoreTxt}}</div>
          </div>
        </template>
      </vi-sticky>
    </div>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME, IMMUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { getHotKey, search } from '@/api/search.js'
import { injectStickyMixin } from '../../mixins/inject-sticky.js'
import { createSong } from '@/common/class/song.js'
import { debounce, throttle } from '@/common/helpers/utils.js'
import { playListMixin } from '@/common/mixins/player.js'
import Singer from '@/common/class/singer.js'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import NoResult from './components/no-result/no-result.vue'
import Loading from '@/uikit/components/vi-scroll/vi-scroll-loading.vue'

const TYPE_SINGER = 'singer'
const DEBOUNCE_TIME = 400

const perpage = 20

export default {
  name: MUTABLE_KEEP_ALIVE_NAME,
  components: {
    NoResult,
    Loading
  },
  mixins: [injectStickyMixin, playListMixin],
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
      result: [],
      scrollOptions: {
        probeType: 3,
        click: true,
        // 下拉加载
        pullUpLoad: {
          threshold: 100,
          txt: {
            // more: '正在载入更多',
            noMore: '没有更多的结果啦'
          }
        },
        directionLockThreshold: 0,
      },
      isFetchSearch: false,
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
    ]),
  },
  watch: {
    query: {
      handler(newVal) {
        this.isFetchSearch = false
        if (!this.debounceQueryHandler) {
          this.debounceQueryHandler = debounce((newVal) => {
            if (!newVal.trim()) {
              return
            }
            this.saveSearchHistoryLocalStorage(newVal)
            this.page = 1
            // 第三个参数如果是缓动,会导致盒子被拖拽
            this.$refs.scroll.scroll.scrollTo(0, 0, 0)
            this.search().then((res) => {
              this.isFetchSearch = true
              this.result = this._genResult(res.data)
            })
          }, DEBOUNCE_TIME)
        }
        this.debounceQueryHandler(newVal)
      },
    }
  },
  mounted() {
    this._getHotKey()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER',
    }),
    ...mapActions([
      'insertSong',
      'saveSearchHistoryLocalStorage'
    ]),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${this.playerHeight}px`
      this.$refs.scroll.refresh()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        this.hotKey = res.data.hotkey.slice(0, 10)
      })
    },
    search(res) {
      return new Promise((resolve, reject) => {
        search({
          w: this.query,
          p: this.page,
          catZhida: this.isShowSinger ? 1 : 0,
          n: perpage,
          perpage: perpage,
        }).then((res) => {
          this._checkMore(res.data)
          resolve(res)
        })
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      } else {
        this.hasMore = true
      }
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
        if (musicData.songid && musicData.albummid && musicData.songmid) {
          musicData.strMediaMid = musicData.songmid
          // 类化数据
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconClass(item) {
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
      this.query = ''
    },
    hotSearch(hotKey) {
      this.query = hotKey.k
    },
    onPullingUp() {
      if (this.hasMore) {
        this.page++
        this.search().then((res) => {
          this.result = this.result.concat(this._genResult(res.data))
        })
      } else {
        this.$refs.scroll.forceUpdate()
      }
    },
    focusHandler() {
      this.isFetchSearch = false
    },
    selectItem(item) {
      this.searchHistory([])
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
        // this.$router.push({
        //   path: `/music/singer-detail/${singer.id}`
        // })
        this.$router.push({
          path: `/new-music/singer-detail/${singer.id}`
        })
      } else {
        // 插入歌曲在当前页播放
        this.insertSong(item)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

.search-box-wrapper
  box-sizing: border-box
  padding: 20px
  background: $color-background

.search
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  background: $color-background
  // position: relative
  .search-scroll-wrapper
    box-sizing: border-box
    width: 100%
    height: calc(100vh - 44px)
    font-size: $font-size-medium
    .shortcut-wrapper
      position: relative
      box-sizing: border-box
      z-index: 0
      .hot-key
        margin: 0 20px 20px 20px
        .title
          line-height: 43px
          font-size: $font-size-medium
          color: $color-text-l
        .hot-key-list
          clear()
          .item
            float: left
            padding: 5px 10px
            margin: 0 10px 10px 0
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
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
    .result-scroll-wrapper
      position: relative
      .suggest-list
        box-sizing: border-box
        padding: 5px 30px
        z-index: -1
        .suggest-item
          display: flex
          align-items: center
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
          line-height: 35px
          .text
            no-wrap()
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

.vi-scroll-pullup
  .vi-scroll-pullup-trigger
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    .vi-scroll-pullup-before-trigger
      padding: 22px 0
      min-height: 1em
      margin-right: 20px
    .vi-scroll-pullup-after-trigger
      padding: 19px 0
  .vi-scroll-pullup-no-more
    width: 100%
    text-align: center
    line-height: 80px
</style>

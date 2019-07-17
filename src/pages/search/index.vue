<template>
  <div ref="search"
    class="search">
    <div ref="scrollWrapper"
      class="search-scroll-wrapper">
      <vi-sticky
        ref="scroll"
        :data="result"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @pulling-up="pullingUpHandler"
        style="color: rgba(255, 255, 255, 0.5);">
        <vi-sticky-ele>
          <div class="search-box-wrapper">
            <base-search-box
              ref="searchBox"
              v-model="query"
              placeholder="搜索歌曲、歌手"
              @clear="clearHandler"
              @focus="focusHandler"></base-search-box>
          </div>
        </vi-sticky-ele>
        <div class="shortcut-wrapper"
          v-show="!query">
          <div class="hot-key">
            <h1 class="hot-key-title">热门搜索</h1>
            <ul class="hot-key-list">
              <li class="item"
                :key="index" v-for="(item, index) in hotKey"
                @click="hotSearch(item)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history"
            v-show="searchHistory.length">
            <h1 class="search-history-title">
              <span class="search-history-text">搜索历史</span>
              <span class="clear-search-history" @touchstart="clearSearchHistoryHandler">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @delete="deleteSearchHistory"
              @select="addQuery">
            </search-list>
          </div>
        </div>
        <div class="result-scroll-wrapper"
          v-show="query">
          <ul class="suggest-list">
            <li class="suggest-item"
               v-for="(item, index) in result"
              :key="index"
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
        <div class="no-result-wrapper"
          v-show="query && !result.length && isFetchSearch">
          <no-result :title="'抱歉，暂无搜索结果'"></no-result>
        </div>
      </vi-sticky>
    </div>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME, IMMUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/store/modules/keep-alive-name/config.js'
import { getHotKey, search } from '@/api/search.js'
import { createSong } from '@/common/class/song.js'
import { Debounce, Throttle } from '@/common/helpers/utils.js'
import playerPaddingBottom from '@/common/mixins/play-padding-bottom.js'
import Singer from '@/common/class/singer.js'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import NoResult from '../index/children/search/components/no-result/no-result.vue'
import Loading from '@/uikit/components/vi-scroll/vi-scroll-loading.vue'
import SearchList from '@/components/search-list/search-list.vue'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'
import createDebounceInstanceMixin from '@/common/mixins/create-debounce-instance.js'

const TYPE_SINGER = 'singer'
const DEBOUNCE_TIME = 400
const THROTTLE_TIME = 1000

let perpage = 20

export default {
  name: MUTABLE_KEEP_ALIVE_NAME,
  components: {
    NoResult,
    SearchList
  },
  mixins: [
    playerPaddingBottom,
    createThrottleInstance,
    createDebounceInstanceMixin,
  ],
  data() {
    return {
      hotKey: [],
      page: 1,
      query: '',
      result: [],
      isShowSinger: true,
      scrollOptions: {
        probeType: 3,
        click: true,
        // 下拉加载
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '下拉加载',
            noMore: '没有更多的结果啦'
          },
          size: 14
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
        if (!newVal.trim()) {
          this.result = []
          return
        }
        this.debounce.run(() => {
          this.saveSearchHistoryLocalStorage(newVal)
          this.page = 1
          // 第三个参数如果是缓动,会导致盒子被拖拽
          this.$refs.scroll.scroll.scrollTo(0, 0, 0)
          this.search().then((res) => {
            this.isFetchSearch = true
            this.result = this._genResult(res.data)
          })
        })
      }
    },
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
      'saveSearchHistoryLocalStorage',
      'deleteSearchHistoryLocalStorage',
      'clearSearchHistoryLocalStorage'
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
    pullingUpHandler() {
      if (this.hasMore) {
        this.page++
        this.search().then((res) => {
          this.result = this.result.concat(this._genResult(res.data))
        })
      }
    },
    focusHandler() {
      this.isFetchSearch = false
    },
    selectItem(item) {
      this.throttle.run(() => {
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
            name: 'detail-singer',
            params: {
              id: singer.id
            }
          })
        } else {
          // 插入歌曲在当前页播放
          this.insertSong(item)
        }
      })
    },
    clearSearchHistoryHandler() {
      this.$createBaseConfirm({
        text: '确定要删除吗',
        onConfirm: () => {
          this.clearSearchHistoryLocalStorage()
        }
      }).show()
    },
    addQuery(history) {
      this.throttle.run(() => {
        this.query = history
      })
    },
    deleteSearchHistory(item) {
      this.throttle.run(() => {
        this.deleteSearchHistoryLocalStorage(item)
      })
    }
  },
}
</script>

<style lang="stylus" moduled>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/mixin.styl"

.search-box-wrapper
  box-sizing: border-box
  padding: 20px
  background: $color-background

.hot-key-title
  height: 40px
  line-height: 40px
  font-size: $font-size-medium
  color: $color-text-l
  padding: 0 0 0 20px
  background: $color-background

.search
  width: 100%
  height: calc(100vh - 44px)
  // height: 100vh
  // overflow: hidden
  background: $color-background
  // position: relative
  .search-scroll-wrapper
    box-sizing: border-box
    width: 100%
    height: calc(100vh - 44px)
    // height: 100vh
    font-size: $font-size-medium
    .shortcut-wrapper
      position: relative
      box-sizing: border-box
      z-index: 0
      .hot-key
        .hot-key-title
          height: 40px
          line-height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          padding: 0 0 0 20px
          background: $color-background
        .hot-key-list
          padding: 0 0 0 20px
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
        .search-history-title
          display: flex
          align-items: center
          height: 40px
          line-height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .search-history-text
            flex: 1
          .clear-search-history
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
</style>

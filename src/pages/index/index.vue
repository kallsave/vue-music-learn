<template>
  <div class="index">
    <vi-sticky ref="sticky">
      <m-header></m-header>
      <template v-if="slideRouterMode === slideRouterModeList[0]">
        <vi-sticky-ele>
          <tab></tab>
        </vi-sticky-ele>
      </template>
      <template v-if="slideRouterMode === slideRouterModeList[0]">
        <vi-slide-router-transition
          slide-right-class="scroll-right"
          slide-left-class="scroll-left"
          mode="in-out">
          <keep-alive :include="[IMMUTABLE_KEEP_ALIVE_NAME, mutableKeepAliveName]">
            <router-view></router-view>
          </keep-alive>
        </vi-slide-router-transition>
      </template>
      <template v-else-if="slideRouterMode === slideRouterModeList[1]">
        <vi-tab ref="tab"
          :slider-style="sliderStyle">
          <vi-tab-item
            v-for="(item, index) in tabList"
            :key="index"
            :selected="index === currentIndex"
            active-class="customer-color"
            @click.native="tabItemClick(index)">{{item}}</vi-tab-item>
        </vi-tab>
        <vi-slide-router-view
          class="slide-router-view"
          ref="viSlideRouterView"
          :scroll-events="['scroll']"
          @index-change="indexChange"
          @scroll="scroll"
        ></vi-slide-router-view>
      </template>
    </vi-sticky>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME, IMMUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { mapGetters } from 'vuex'
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import Background from './components/background/background.vue'
const Recommend = () => import(/* webpackChunkName: "Recommend" */ './children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './children/singer/singer.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './children/rank/rank.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './children/search/search.vue')

const slideRouterModeList = ['vi-slide-router-transition', 'vi-slide-router-view']

export default {
  name: MUTABLE_KEEP_ALIVE_NAME,
  components: {
    MHeader,
    Tab,
  },
  data() {
    return {
      IMMUTABLE_KEEP_ALIVE_NAME: IMMUTABLE_KEEP_ALIVE_NAME,
      slideRouterModeList: slideRouterModeList,
      slideRouterMode: slideRouterModeList[1],
      tabList: [
        '推荐',
        '歌手',
        '排行',
        '搜索'
      ],
      currentIndex: 0,
      sliderStyle: {
        transition: 'none'
      }
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  mounted() {

  },
  methods: {
    indexChange(index) {
      this.currentIndex = index
    },
    tabItemClick(index) {
      this.$refs.viSlideRouterView.changePage(index)
    },
    scroll({x, y}) {
      let scrollX = Math.abs(x)
      let tabWidth = this.$refs.tab.$el.clientWidth
      let slideGroupWidth = this.$refs.viSlideRouterView.getSlideWidth()
      let rate = tabWidth / slideGroupWidth
      let translateX = rate * scrollX
      let remainder = this.$refs.tab.getRemainder()
      this.$refs.tab.translateSliderTo(translateX + remainder)
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/var/color.styl"
.index
  .customer-color
    color: $color-theme!important
</style>
<style lang="stylus">
.index
  height: 100vh
  position: relative

.scroll-right-enter
  will-change: transform
  transform:  translate3d(100%, 0px, 0px)

.scroll-right-enter-active
  position: absolute
  top: 88px
  width: 100%
  height: calc(100vh - 44px)
  z-index: 100
  will-change: transform
  transition: transform 0.2s

.scroll-right-enter-to
  position: absolute
  top: 88px
  width: 100%
  height: calc(100vh - 44px)
  z-index: 100
  will-change: auto

.scroll-right-leave-active
  display: none

.scroll-right-leave-to
  display: none

.scroll-left-enter
  transform:  translate3d(-100%, 0px, 0px)

.scroll-left-enter-active
  position: absolute
  top: 88px
  width: 100%
  height: calc(100vh - 44px)
  z-index: 100
  will-change: transform
  transition: transform 0.2s

.scroll-left-enter
  position: absolute
  top: 88px
  width: 100%
  height: calc(100vh - 44px)
  z-index: 100
  will-change: transform
  transform:  translate3d(-100%, 0px, 0px)

.scroll-left-enter-active
  will-change: transform
  transition: transform 0.2s

.scroll-left-leave-active
  display: none

.scroll-left-leave-to
  display: none

</style>

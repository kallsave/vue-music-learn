<template>
  <div class="index">
    <vi-sticky ref="sticky">
      <m-header></m-header>
      <template v-if="slideRouterMode !== slideRouterModeList[2]">
        <!-- <vi-sticky-ele>
          <tab></tab>
        </vi-sticky-ele> -->
        <vi-tab
          ref="tab"
          :tab-list="tabTitleList"
          :currentIndex.sync="currentIndex"
          @click-tab-item="clickTabItem"></vi-tab>
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
        <vi-slide-router-view
          ref="viSlideRouterView"
          :scroll-events="['scroll']"
          :options="slideRouterOptions"
          :tab-title-list="tabTitleList"
          :tab-bar-style="tabBarStyle"
          :is-show-tab-bar="true"
          :componentList="componentList"
          @change="change"
          @touch-scroll="scroll"
        ></vi-slide-router-view>
      </template>
      <template v-else-if="slideRouterMode === slideRouterModeList[2]">
        <vi-slide-view
          ref="viSlideRouterView"
          :scroll-events="['scroll']"
          :options="slideRouterOptions"
          :tab-title-list="tabTitleList"
          :tab-bar-style="tabBarStyle"
          :componentList="componentList"
          @change="change"
          @scroll="scroll"
        ></vi-slide-view>
      </template>
    </vi-sticky>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME, IMMUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { mapGetters } from 'vuex'
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import SlideTab from './components/slide-tab/slide-tab.vue'
import Background from './components/background/background.vue'
import { prefixStyle } from '@/common/helpers/dom.js'
const Recommend = () => import(/* webpackChunkName: "Recommend" */ './children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './children/singer/singer.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './children/rank/rank.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './children/search/search.vue')

const TRANSFORM = prefixStyle('transform')

const slideRouterModeList = ['vi-slide-router-transition', 'vi-slide-router-view', 'vi-slide-view']

export default {
  name: MUTABLE_KEEP_ALIVE_NAME,
  components: {
    MHeader,
    Tab,
    SlideTab
  },
  data() {
    return {
      IMMUTABLE_KEEP_ALIVE_NAME: IMMUTABLE_KEEP_ALIVE_NAME,
      slideRouterModeList: slideRouterModeList,
      slideRouterMode: slideRouterModeList[1],
      slideRouterOptions: {
        snap: {
          loop: false,
          threshold: 0.5,
        }
      },
      componentList: [
        Recommend,
        Singer,
        Rank,
        Search
      ],
      tabTitleList: [
        '推荐',
        '歌手',
        '排行',
        '搜索'
      ],
      tabBarStyle: {
        'transition': 'none'
      },
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  mounted() {
    this.currentIndex = this.$refs.viSlideRouterView.getCurrentIndex()
  },
  methods: {
    change(index) {
      this.currentIndex = index
    },
    scroll({x, y}) {
      const slideGroopWidth = this.$refs.viSlideRouterView.getSlideWidth()
      const slidePageWidth = slideGroopWidth / this.tabTitleList.length
      const tabWidth = this.$refs.tab.$el.clientWidth
      const tabItemWidth = tabWidth / this.tabTitleList.length
      this.rate = tabWidth / slideGroopWidth
      const tabSliderWidth = this.$refs.tab.tabSlider.clientWidth
      this.remainder = (tabItemWidth - tabSliderWidth) / 2
      this.$refs.tab.tabSlider.style[TRANSFORM] = `translateX(${this.rate * Math.abs(x) + this.remainder}px)`
    },
    clickTabItem(index) {
      this.$refs.viSlideRouterView.change(index)
    }
  },
}
</script>

<style lang="stylus" scoped>
.index
  height: 100vh
  position: relative

.scroll-right-enter
  transform:  translate3d(100%, 0px, 0px)

.scroll-right-enter-active
  will-change: transform
  transition: transform 0.2s
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-right-enter-to
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-right-leave-active
  display: none

.scroll-right-leave-to
  display: none

.scroll-left-enter
  transform:  translate3d(-100%, 0px, 0px)

.scroll-left-enter-active
  will-change: transform
  transition: transform 0.2s
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-left-enter-to
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-left-enter-to
  transform:  translate3d(0px, 0px, 0px)
  will-change: transform
  transition: transform 0.2s

.scroll-left-leave-active
  display: none

.scroll-left-leave-to
  display: none

</style>

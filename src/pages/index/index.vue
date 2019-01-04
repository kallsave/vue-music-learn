<template>
  <div class="index">
    <vi-sticky ref="sticky">
      <m-header></m-header>
      <template v-if="slideRouterMode !== slideRouterModeList[2]">
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
        <vi-slide-router-view
          ref="viSlideRouterView"
          :scroll-events="['scroll']"
          :options="slideRouterOptions"
          :tab-title-list="tabTitleList"
          :tab-bar-style="tabBarStyle"
          :is-show-tab="false"
          :componentList="componentList"
          @change="change"
          @touch-scroll="touchScroll"
          @scroll="scroll"
        ></vi-slide-router-view>
      </template>
      <template v-else-if="slideRouterMode === slideRouterModeList[2]">
        <vi-slide-view
          ref="viSlideRouterView"
          :scroll-events="['scroll']"
          :options="slideRouterOptions"
          :tab-title-list="tabTitleList"
          :tab-bar-style="tabBarStyle"
          :is-show-tab="false"
          :componentList="componentList"
          @change="change"
          @touch-scroll="touchScroll"
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
const Recommend = () => import(/* webpackChunkName: "Recommend" */ './children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './children/singer/singer.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './children/rank/rank.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './children/search/search.vue')

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
      tabTitleList: [
        '推荐',
        '歌手',
        '排行',
        '搜索'
      ],
      componentList: [
        Recommend,
        Singer,
        Rank,
        Search
      ],
      tabBarStyle: {
        left: '50px'
      }
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  methods: {
    change(index) {
      // console.log(index)
    },
    touchScroll({x, y}) {
      // console.log(x)
    },
    scroll() {
      // console.log('scroll')
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

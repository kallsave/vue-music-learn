<template>
  <div :class="$style['index']">
    <vi-native-sticky
      :scroll-y="-scrollY"
      @sticky-change="stickyChange">
      <vi-scroll
        ref="sticky"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="scrollHandler">
        <m-header></m-header>
        <template v-if="slideRouterMode === slideRouterModeList[0]">
          <vi-native-sticky-ele>
            <tab></tab>
          </vi-native-sticky-ele>
          <!-- <div style="position: sticky; top:0;">
            <tab></tab>
          </div> -->
        </template>
        <template v-if="slideRouterMode === slideRouterModeList[0]">
          <vi-slide-router-transition
            slide-right-class="scroll-right"
            slide-left-class="scroll-left"
            mode="in-out">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </vi-slide-router-transition>
        </template>
        <template v-else-if="slideRouterMode === slideRouterModeList[1]">
          <vi-native-sticky-ele>
            <vi-tab
              ref="tab"
              style="background: #222"
              :slider-style="sliderStyle">
              <vi-tab-item
                v-for="(item, index) in tabList"
                :key="index"
                :selected="index === currentIndex"
                active-class="customer-color"
                @click.native="tabItemClick(index)">{{item}}</vi-tab-item>
            </vi-tab>
           </vi-native-sticky-ele>
          <vi-slide-router-view
            ref="viSlideRouterView"
            class="slide-router-view"
            :scroll-events="['scroll']"
            :backgroundComponent="backgroundComponent"
            @index-change="changePage"
            @scroll="slideScrollHander">
          </vi-slide-router-view>
        </template>
        <template v-else-if="slideRouterMode === slideRouterModeList[2]">
          <vi-native-sticky-ele>
            <vi-tab
              ref="tab"
              style="background: #222"
              :slider-style="sliderStyle">
              <vi-tab-item
                v-for="(item, index) in tabList"
                :key="index"
                :selected="index === currentIndex"
                active-class="customer-color"
                @click.native="tabItemClick(index)">{{item}}</vi-tab-item>
            </vi-tab>
          </vi-native-sticky-ele>
          <vi-slide
            ref="viSlideRouterView"
            class="slide-view"
            :options="slideViewOptions"
            :scroll-events="['scroll']"
            @change-page="changePage"
            @scroll="slideScrollHander">
            <vi-slide-item>
              <recommend></recommend>
            </vi-slide-item>
            <vi-slide-item>
              <singer></singer>
            </vi-slide-item>
            <vi-slide-item>
              <rank></rank>
            </vi-slide-item>
            <vi-slide-item>
              <search></search>
            </vi-slide-item>
          </vi-slide>
        </template>
      </vi-scroll>
    </vi-native-sticky>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import Background from './components/background/background.vue'
import keepAliveRouteManager from '@/common/mixins/keep-alive-route-manager.js'

const Recommend = () => import(/* webpackChunkName: "Recommend" */ './children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './children/singer/singer.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './children/rank/rank.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './children/search/search.vue')

const slideRouterModeList = ['vi-slide-router-transition', 'vi-slide-router-view', 'vi-slide-view']

export default {
  name: 'index',
  components: {
    MHeader,
    Tab,
    Recommend,
    Singer,
    Rank,
    Search
  },
  mixins: [
    keepAliveRouteManager,
  ],
  data() {
    return {
      slideRouterModeList: slideRouterModeList,
      slideRouterMode: slideRouterModeList[1],
      tabList: [
        '推荐',
        '歌手',
        '排行',
        '搜索'
      ],
      currentIndex: 0,
      scrollOptions: {
        probeType: 3,
        click: true,
      },
      slideViewOptions: {
        probeType: 3,
        click: true,
      },
      sliderStyle: {
        transition: 'none'
      },
      scrollY: 0,
      backgroundComponent: Background
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  methods: {
    changePage(index) {
      this.currentIndex = index
    },
    tabItemClick(index) {
      if (this.slideRouterMode === this.slideRouterModeList[1]) {
        this.$refs.viSlideRouterView.goToPage(index)
      } else {
        this.$refs.viSlideRouterView.goToPage(index)
      }
    },
    slideScrollHander(pos) {
      let scrollX = Math.abs(pos.x)
      let tabWidth = this.$refs.tab.$el.clientWidth
      let slideGroupWidth = this.$refs.viSlideRouterView.getSlideWidth()
      let rate = tabWidth / slideGroupWidth
      let translateX = rate * scrollX
      let remainder = this.$refs.tab.getRemainder()
      this.$refs.tab.translateSliderTo(translateX + remainder)
    },
    scrollHandler(pos) {
      this.scrollY = pos.y
    },
    stickyChange() {
      this.$nextTick(() => {
        this.$refs.sticky.refresh()
      })
    }
  }
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"

.index
  height: 100vh
  position: relative
  :global
    .customer-color
      color: $color-theme!important

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

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
              @click.native="tabItemClick(index)"
              v-text="item">
            </vi-tab-item>
          </vi-tab>
        </vi-native-sticky-ele>
        <vi-slide
          ref="slide"
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
      </vi-scroll>
     </vi-native-sticky>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import Background from './components/background/background.vue'

const Recommend = () => import('./children/recommend/recommend.vue')
const Singer = () => import('./children/singer/singer.vue')
const Rank = () => import('./children/rank/rank.vue')
const Search = () => import('./children/search/search.vue')

export default {
  provide() {
    return {
      outerScroll: this.$refs.sticky
    }
  },
  components: {
    MHeader,
    Tab,
    Recommend,
    Singer,
    Rank,
    Search
  },
  data() {
    return {
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
        snap: {
          loop: false,
        },
        test: 'outer'
      },
      sliderStyle: {
        transition: 'none'
      },
      scrollY: 0,
      backgroundComponent: Background
    }
  },
  methods: {
    changePage(index) {
      this.currentIndex = index
    },
    tabItemClick(index) {
      this.$refs.slide.goToPage(index)
    },
    slideScrollHander(pos) {
      let scrollX = Math.abs(pos.x)
      let tabWidth = this.$refs.tab.$el.clientWidth
      let slideGroupWidth = this.$refs.slide.getSlideWidth()
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
  position: relative
  height: calc(100vh + 44px)
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
      height: 100%
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

<template>
  <div class="vi-slide-router-view">
    <template v-if="isShowTabBar">
      <slot name="tab"
        :tab-title-list="tabTitleList"
        :change-page="change">
        <div class="vi-slide-router-view-tab">
          <div ref="tabList" class="vi-slide-router-view-tab-list">
            <div ref="tabItem" class="vi-slide-router-view-tab-item"
              v-for="(item, index) in tabTitleList" :key="index">
              <span class="vi-slide-router-view-tab-item-link" :class="{'active': index === currentIndex}"
                @click="change(index)">{{item}}</span>
            </div>
          </div>
          <div ref="tabBar" class="vi-slide-router-view-tab-bar">
            <div class="vi-slide-router-view-tab-bar-content" :style="tabBarContentStyle"></div>
          </div>
        </div>
      </slot>
    </template>
    <vi-slide ref="slide"
      :options="slideOptions"
      :initPageIndex="currentIndex"
      :scroll-events="scrollEvents"
      @scroll-end="scrollEnd"
      @scroll="scroll"
      @before-scroll-start="beforeScrollStart"
      @change="change"
      @touch-scroll="touchScroll"
      @touch-trigger-scroll="touchTriggerScroll"
      @touch-end="touchEnd">
      <vi-slide-item v-for="(item, index) in siblingsRoute" :key="index">
        <template v-if="$route.matched[$route.matched.length - 1].regex.test(item.path)">
          <component :is="item.component"></component>
        </template>
        <template v-else>
          <component :is="hadShowPageList.indexOf(index) !== -1 ? item.component : backgroundComponent"></component>
        </template>
      </vi-slide-item>
    </vi-slide>
  </div>
</template>

<script>
import ViSlide from '../vi-slide/vi-slide.vue'
import ViView from '../vi-view/vi-view.js'
import Background from './vi-slide-router-view-background.vue'
import { camelize, mulitDeepClone, pxToNum, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-slide-router-view'

// better-scroll原始的事件(不推荐在父组件中使用,会存在嵌套事件触发多次的,主动触发的问题)
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'
const EVENT_TOUCH_END = 'touch-end'
// 需要传scrollEvents = ['scroll-start']
const EVENT_SCROLL_START = 'scroll-start'
// 需要传scrollEvents = ['scroll']
const EVENT_SCROLL = 'scroll'
// 需要传scrollEvents = ['scroll-cancel']
const EVENT_SCROLL_CANCEL = 'scroll-cancel'

// better-scroll原始的scrollEvents事件集合
const SCROLL_EVENTS = [
  EVENT_BEFORE_SCROLL_START,
  EVENT_SCROLL_END,
  EVENT_TOUCH_END,
  EVENT_SCROLL,
  EVENT_SCROLL_START
]

// 派生出来的事件(推荐在父组件中使用)
const EVENT_CHANGE = 'change'
const EVENT_LOAD_IMAGE = 'load-image'
// 需要在scrollEvents传['scroll']
const EVENT_TOUCH_SCROLL = 'touch-scroll'

const DEFAULT_OPTIONS = {
  probeType: 3,
  directionLockThreshold: 0,
  scrollY: false,
  scrollX: true,
  click: false,
  snap: {
    loop: false,
    threshold: 0.4,
  },
  bounce: {
    top: true,
    bottom: true,
    left: false,
    right: false
  }
}

const DEFAULT_TAB_BAR_STYLE = {
  'background-color': '#ffcd32',
  'height': '2px',
  'width': '50px'
}

const TRANSFORM = prefixStyle('transform')

export default {
  name: COMPONENT_NAME,
  components: {
    ViSlide,
    ViView
  },
  beforeCreate() {
    const findSiblingsRoute = (routeList) => {
      for (let i = 0; i < routeList.length; i++) {
        let item = routeList[i]
        if (this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)) {
          this.siblingsRoute = routeList
          return
        } else if (item.children) {
          findSiblingsRoute(item.children)
        }
      }
    }
    findSiblingsRoute(this.$router.options.routes)
  },
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    scrollEvents: {
      type: Array,
      default() {
        return []
      },
      validator(arr) {
        return arr.every((item) => {
          return SCROLL_EVENTS.indexOf(item) !== -1
        })
      }
    },
    backgroundComponent: {
      type: Object,
      default() {
        return Background
      }
    },
    isUseTabBarScrolling: {
      type: Boolean,
      default: false
    },
    tabTitleList: {
      type: Array,
      default() {
        return []
      },
    },
    tabBarStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowTabBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hadShowPageList: [],
      onePagescrollX: 0,
      slideGroopWidth: 0,
      tabBarContentStyle: {},
    }
  },
  computed: {
    currentIndex() {
      return this.siblingsRoute.findIndex((item) => {
        return this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)
      })
    },
    threshold() {
      let options = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
      return options.snap.threshold
    },
  },
  watch: {
    $route(newVal) {
      if (this.currentIndex !== -1) {
        this.pushHadShowPageList(this.currentIndex)
        this.$nextTick(() => {
          // TODO:
          setTimeout(() => {
            this.$refs.slide && this.$refs.slide.slideToPage(this.currentIndex)
          }, 60)
          this.onePagescrollX = 0
        })
      }
    },
  },
  created() {
    this.pushHadShowPageList(this.currentIndex)
    // created => children.props => children.data => children.created
    this.slideOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
    this.tabBarContentStyle = mulitDeepClone({}, DEFAULT_TAB_BAR_STYLE, stylePadPx(this.tabBarStyle))
  },
  mounted() {
    this._findSlide()
    this._calculateSlideWidth()
  },
  methods: {
    _calculateSlideWidth() {
      const slideGroopWidth = this.$refs.slide.getSlideWidth()
      const slidePageWidth = this.$refs.slide.getSlideWidth() / this.tabTitleList.length
      const tabListWidth = this.$refs.tabList.clientWidth
      const tabItemWidth = tabListWidth / this.tabTitleList.length
      this.rate = tabListWidth / slideGroopWidth
      const tabBarWidth = this.$refs.tabBar.clientWidth
      this.remainder = (tabItemWidth - tabBarWidth) / 2
      this.$refs.tabBar.style[TRANSFORM] = `translateX(${this.rate * Math.abs(this.slide.x) + this.remainder}px)`
    },
    _findSlide() {
      this.slide = this.$refs.slide.slide
    },
    beforeScrollStart() {
      this.$emit(EVENT_BEFORE_SCROLL_START)
    },
    scroll({x}) {
      this.$emit(EVENT_SCROLL, ...arguments)
      let scrollX = Math.abs(x)
      this.$refs.tabBar.style[TRANSFORM] = `translateX(${this.rate * scrollX + this.remainder}px)`
    },
    scrollEnd(pos, slide) {
      this.$emit(EVENT_SCROLL_END)
    },
    touchTriggerScroll({x, y}) {

    },
    touchScroll({x, y}) {
    //   if (this.isShowTabBar) {
    //     let scrollX = Math.abs(x)
    //     if (!this.touchStart) {
    //       this.touchStart = true
    //       this.touchStartX = scrollX
    //     }
    //     let X = Math.abs(this.slide.x)
    //     console.log(X)
    //     this.$refs.tabBar.style[TRANSFORM] = `translateX(${this.rate * X + this.remainder}px)`
    //   }
      this.$emit(EVENT_TOUCH_SCROLL, ...arguments)
    },
    touchEnd() {
      if (this.onePagescrollX >= this.threshold * this.onePageWidth) {
        this.touchStart = false
      } else {
        this.onePagescrollX = 0
      }
      this.$emit(EVENT_TOUCH_END)
    },
    change(index) {
      this.$emit(EVENT_CHANGE, index)
      let siblingsRouteMatchedPath = ''

      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          siblingsRouteMatchedPath = item.path
        }
      })

      // 补全路由params参数
      for (let k in this.$route.params) {
        if (new RegExp(`(:${k})`).test(siblingsRouteMatchedPath)) {
          let str = this.$route.params[k]
          siblingsRouteMatchedPath = siblingsRouteMatchedPath.replace(RegExp.$1, str)
        }
      }
      this.$router.push({
        path: siblingsRouteMatchedPath
      })
    },
    pushHadShowPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    },
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

.vi-slide-router-view
  .vi-slide-router-view-tab
    position: relative
    .vi-slide-router-view-tab-list
      display: flex
      height: 46px
      line-height: 44px
      .vi-slide-router-view-tab-item
        flex: 1
        text-align: center
        .vi-slide-router-view-tab-item-link
          box-sizing: border-box
          color: $color-text-l
          padding-bottom: 5px
          font-size: $font-size-medium
          &.active
            color: $color-theme
    .vi-slide-router-view-tab-bar
      position: absolute
      z-index: 5
      bottom: 0
      .vi-slide-router-view-tab-bar-content
        height: 2px

</style>

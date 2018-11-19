<template>
  <div class="vi-slide-router-view">
    <template v-if="isShowTab">
      <slot name="tab"
        :tab-title-list="tabTitleList"
        :change-page="change">
        <div class="vi-slide-router-view-tab">
          <div class="vi-slide-router-view-tab-list">
            <div class="vi-slide-router-view-tab-item"
              v-for="(item, index) in tabTitleList" :key="index">
              <span class="vi-slide-router-view-tab-item-link" :class="{'active': index === currentIndex}"
                @click="change(index)">{{item}}</span>
            </div>
          </div>
          <div class="vi-slide-router-view-tab-bar" :style="tabStyle">
            <div class="vi-slide-router-view-tab-bar-content" :style="tabContentStyle"></div>
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
      @touch-end="touchEnd">
      <div v-for="(item, index) in siblingsRoute" :key="index">
        <template v-if="$route.matched[$route.matched.length - 1].regex.test(item.path)">
          <component :is="item.component"></component>
        </template>
        <template v-else>
          <component :is="hadShowPageList.indexOf(index) !== -1 ? item.component : backgroundComponent"></component>
        </template>
      </div>
    </vi-slide>
  </div>
</template>

<script>
import ViSlide from '../vi-slide/vi-slide.vue'
import ViView from '../vi-view/vi-view.js'
import Background from './vi-slide-router-view-background.vue'

import { camelize, mulitDeepClone, pxToNum, stylePadPx } from '../../common/helpers/utils.js'

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
  directionLockThreshold: 0.5,
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
  'left': '0px',
  'height': '2px',
}

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
    isUseChangeRouter: {
      type: Boolean,
      default: true
    },
    isUseTabBarScrolling: {
      type: Boolean,
      default: false
    },
    isShowTab: {
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
  },
  data() {
    return {
      hadShowPageList: [],
      onePagescrollX: 0,
      slideGroopWidth: 0,
    }
  },
  created() {
    this.pushHadShowPageList(this.currentIndex)
    // created => children.props => children.data => children.created
    this.slideOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
    this._tabBarStyle = mulitDeepClone({}, DEFAULT_TAB_BAR_STYLE, stylePadPx(this.tabBarStyle))
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
    tabStyle() {
      let itemPercent = 1 / this.siblingsRoute.length * 100
      return mulitDeepClone({}, this.tabBarStyle, {
        'width': `calc(${itemPercent}% - ${this._tabBarStyle.left})`,
        'left': `calc(${this.currentIndex * itemPercent}% + ${pxToNum(this._tabBarStyle.left) / 2}px)`,
      })
    },
    tabPosition() {
      if (!this.onePagescrollX) {
        return 0
      }
      return this.onePagescrollX * 0.2
    },
    tabContentStyle() {
      if (this.direction === 'right') {
        return {
          'right': `${-this.tabPosition}px`,
          'background-color': this._tabBarStyle['background-color']
        }
      } else {
        return {
          'left': `${this.tabPosition}px`,
          'background-color': this._tabBarStyle['background-color']
        }
      }
    },
  },
  watch: {
    $route(newVal) {
      let index = this.siblingsRoute.findIndex((item) => {
        return item.path === newVal.path
      })
      if (index !== -1) {
        this.$refs.slide && this.$refs.slide.slideToPage(index)
      }
    },
  },
  mounted() {
    this._findSlide()
    this._calculateSlideWidth()
  },
  methods: {
    _calculateSlideWidth() {
      this.slideGroopWidth = this.$refs.slide.getSlideWidth()
      this.onePageWidth = this.slideGroopWidth / this.siblingsRoute.length
    },
    _findSlide () {
      this.slide = this.$refs.slide.slide
    },
    beforeScrollStart() {
      this.$emit(EVENT_BEFORE_SCROLL_START)
    },
    scroll() {
      this.$emit(EVENT_SCROLL, ...arguments)
    },
    scrollEnd(pos, slide) {
      this.$emit(EVENT_SCROLL_END)
    },
    touchScroll({x, y}) {
      if (this.isShowTab) {
        let scrollX = Math.abs(x)
        if (!this.touchStart) {
          this.touchStart = true
          this.touchStartX = scrollX
        }
        if (this.touchStartX && scrollX - this.touchStartX > 0) {
          this.direction = 'right'
        } else {
          this.direction = 'left'
        }
        this.onePagescrollX = scrollX - (this.currentIndex * this.onePageWidth)
      }
      this.$emit(EVENT_TOUCH_SCROLL, ...arguments)
    },
    touchEnd() {
      this.onePagescrollX = 0
      this.touchStart = false
    },
    change(index) {
      this.pushHadShowPageList(index)
      this.$emit(EVENT_CHANGE, index)
      let siblingsRouteMatchedPath = ''

      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          siblingsRouteMatchedPath = item.path
        }
      })

      if (this.isUseChangeRouter) {
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
      } else {
        this.$refs.slide && this.$refs.slide.slideToPage(index)
      }
    },
    pushHadShowPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
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
      height: 2px
      bottom: 0
      transition: all 0.2s
      .vi-slide-router-view-tab-bar-content
        position: absolute
        height: 100%;
        width: 100%
        // left: 0;
        // right: 0;
        transition: all 0.2s

</style>

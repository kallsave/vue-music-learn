<template>
  <div class="vi-slide-view">
    <template v-if="isShowTab">
      <slot name="tab"
        :tab-title-list="tabTitleList"
        :currentIndex="currentIndex">
        <div class="vi-slide-view-tab">
          <div class="vi-slide-view-tab-list">
            <div class="vi-slide-view-tab-item"
              v-for="(item, index) in tabTitleList" :key="index">
              <span class="vi-slide-view-tab-item-link" :class="{'active': index === currentIndex}"
                @click="change(index)">{{item}}</span>
            </div>
          </div>
          <!-- <div class="vi-slide-view-tab-bar" :style="tabStyle">
            <div class="vi-slide-view-tab-bar-content" :style="tabContentStyle"></div>
          </div> -->
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
      <div v-for="(item, index) in componentList" :key="index">
        <template v-if="currentIndex === index">
          <component :is="item"></component>
        </template>
        <template v-else>
          <component :is="hadShowPageList.indexOf(index) !== -1 ? item : backgroundComponent"></component>
        </template>
      </div>
    </vi-slide>
  </div>
</template>

<script>
import ViSlide from '../vi-slide/vi-slide.vue'
import Background from './vi-slide-view-background.vue'

import { camelize, mulitDeepClone, pxToNum, stylePadPx } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-slide-view'

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
    componentList: {
      type: Array,
      default() {
        return []
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
    isShowTab: {
      type: Boolean,
      default: true
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
      currentIndex: 0
    }
  },
  created() {
    this.pushHadShowPageList(this.currentIndex)
    // created => children.props => children.data => children.created
    this.slideOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
    this._tabBarStyle = mulitDeepClone({}, DEFAULT_TAB_BAR_STYLE, stylePadPx(this.tabBarStyle))
  },
  computed: {
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
    tabContentStyle() {
      const tabPosition = this.onePagescrollX * 0.3
      if (this.direction === 'right') {
        return {
          'right': `${-tabPosition}px`,
          'background-color': this._tabBarStyle['background-color']
        }
      } else {
        return {
          'left': `${-tabPosition}px`,
          'background-color': this._tabBarStyle['background-color']
        }
      }
    },
  },
  watch: {
  },
  mounted() {
    this._findSlide()
    this._calculateSlideWidth()
  },
  methods: {
    _calculateSlideWidth() {
      this.slideGroopWidth = this.$refs.slide.getSlideWidth()
      this.onePageWidth = this.slideGroopWidth / this.componentList.length
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
        this.onePagescrollX = Math.abs(scrollX - (this.currentIndex * this.onePageWidth))
      }
      this.$emit(EVENT_TOUCH_SCROLL, ...arguments)
    },
    touchEnd() {
      if (this.onePagescrollX >= this.threshold * this.onePageWidth) {
        this.touchStart = false
        return
      }
      this.onePagescrollX = 0
    },
    change(index) {
      console.log(index)
      this.currentIndex = index
      this.pushHadShowPageList(this.currentIndex)
      this.$refs.slide.slideToPage(index, 0, 400)
      this.$emit(EVENT_CHANGE, index)
      this.$nextTick(() => {
        this.onePagescrollX = 0
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

.vi-slide-view
  .vi-slide-view-tab
    position: relative
    .vi-slide-view-tab-list
      display: flex
      height: 46px
      line-height: 44px
      .vi-slide-view-tab-item
        flex: 1
        text-align: center
        .vi-slide-view-tab-item-link
          box-sizing: border-box
          color: $color-text-l
          padding-bottom: 5px
          font-size: $font-size-medium
          &.active
            color: $color-theme
    .vi-slide-view-tab-bar
      position: absolute
      z-index: 5
      height: 2px
      bottom: 0
      transition: all 0.2s
      .vi-slide-view-tab-bar-content
        position: absolute
        height: 100%;
        width: 100%
        transition: left 0.2s, right 0.2s

</style>

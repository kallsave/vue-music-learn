<template>
  <div class="vi-slide-router-view">
    <template v-if="isShowTab">
      <div class="vi-tab">
        <slot name="tab-list">
          <div ref="tabList"
            class="vi-tab-list">
            <div class="vi-tab-item"
              :class="[index === currentIndex ? tabActiveClass : '']"
              :style="tabStyle"
              v-for="(item, index) in tabList"
              :key="index"
              @click="tabItemClick(index)">{{item}}
            </div>
          </div>
          <div ref="tabSlider" class="vi-tab-slider"
            :style="sliderContentStyle">
          </div>
        </slot>
      </div>
    </template>
    <vi-slide ref="slide"
      :options="slideOptions"
      :initPageIndex="currentIndex"
      :scroll-events="scrollEvents"
      @scroll-end="scrollEnd"
      @scroll="scroll"
      @before-scroll-start="beforeScrollStart"
      @touch-scroll="touchScroll"
      @change-page="changePage">
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
import ViTab from '../vi-tab/vi-tab'
import Background from './vi-slide-router-view-background.vue'
import { mulitDeepClone, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-slide-router-view'

// better-scroll原始的事件(不推荐在父组件中使用,会存在嵌套事件触发多次的,主动触发的问题)
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'
// 需要传scrollEvents = ['scroll-start']
const EVENT_SCROLL_START = 'scroll-start'
// 需要传scrollEvents = ['scroll']
const EVENT_SCROLL = 'scroll'

// better-scroll原始的scrollEvents事件集合
const SCROLL_EVENTS = [
  EVENT_BEFORE_SCROLL_START,
  EVENT_SCROLL_END,
  EVENT_SCROLL,
  EVENT_SCROLL_START
]

// 派生出来的事件(推荐在父组件中使用)
const EVENT_CHANGE_PAGE = 'change-page'
const EVENT_LOAD_IMAGE = 'load-image'
const EVENT_TOUCH_SCROLL = 'touch-scroll'

// vi-slide-router-view的事件
const EVENT_INDEX_CHANGE = 'index-change'

// tab的事件
const EVENT_CLICK_TAB_ITEM = 'click-tab-item'

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

const DEFAULT_TAB_SLIDER_STYLE = {
  'background-color': '#ffcd32',
  'height': '2px',
  'width': '50px',
  'transition': 'transform 0.3s cubic-bezier(.61,0,.44,1)'
}

const TRANSFORM = prefixStyle('transform')

export default {
  name: COMPONENT_NAME,
  components: {
    ViSlide,
    ViTab
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
    tabList: {
      type: Array,
      default() {
        return []
      },
    },
    tabSliderStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowTab: {
      type: Boolean,
      default: false
    },
    tabStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    tabActiveClass: {
      type: String,
      default: 'active'
    }
  },
  data() {
    return {
      hadShowPageList: [],
    }
  },
  computed: {
    currentIndex() {
      return this.siblingsRoute.findIndex((item) => {
        return this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)
      })
    },
    sliderContentStyle() {
      return mulitDeepClone({}, DEFAULT_TAB_SLIDER_STYLE, stylePadPx(this.tabSliderStyle))
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        if (this.currentIndex !== -1) {
          this.pushHadShowPageList(this.currentIndex)
          this.$nextTick(() => {
            this.$refs.slide && this.$refs.slide.slideToPage(this.currentIndex)
          })
        }
      },
    },
    currentIndex: {
      handler(newVal) {
        this.$emit(EVENT_INDEX_CHANGE, newVal)
        this.$nextTick(() => {
          console.log(66)
          this._initTabSlider()
        })
      },
      immediate: true
    }
  },
  created() {
    this.pushHadShowPageList(this.currentIndex)
    this._propChildren()
  },
  mounted() {
    this._findSlide()
    // this._initTabSlider()
  },
  methods: {
    _initTabSlider() {
      let tabWidth = this.$refs.tabList.clientWidth
      this.tabItemWidth = tabWidth / this.tabList.length
      let tabSliderWidth = this.$refs.tabSlider.clientWidth
      this.remainder = (this.tabItemWidth - tabSliderWidth) / 2
      let translateX = this.currentIndex * this.tabItemWidth + this.remainder
      this.$refs.tabSlider.style.display = 'none'
      this.sliderTranslateX(translateX)
      // 强制重排
      let reflow = this.$refs.tabList.clientWidth
      this.$refs.tabSlider.style.display = 'block'
    },
    _propChildren() {
      // created => children.props => children.data => children.created
      this.slideOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
    },
    _findSlide() {
      this.slide = this.$refs.slide.slide
    },
    getSlideWidth() {
      return this.$refs.slide && this.$refs.slide.getSlideWidth()
    },
    beforeScrollStart() {
      this.$emit(EVENT_BEFORE_SCROLL_START)
    },
    scroll({x, y}) {
      let scrollX = Math.abs(x)
      this.rate = this.$refs.tabList.clientWidth / this.getSlideWidth()
      let translateX = scrollX * this.rate + this.remainder
      this.sliderTranslateX(translateX)
      this.$emit(EVENT_SCROLL, ...arguments)
    },
    touchScroll({x, y}) {
      this.$emit(EVENT_TOUCH_SCROLL, ...arguments)
    },
    scrollEnd(pos, slide) {
      this.$emit(EVENT_SCROLL_END)
    },
    getCurrentIndex() {
      return this.currentIndex
    },
    changePage(index) {
      this.$emit(EVENT_CHANGE_PAGE, index)
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
    tabItemClick(index) {
      this.changePage(index)
    },
    sliderTranslateX(x) {
      this.$refs.tabSlider.style[TRANSFORM] = `translateX(${x}px)`
    },
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"

.vi-slide-router-view
  .vi-tab
    position: relative
    .vi-tab-list
      display: flex
      .vi-tab-item
        flex: 1
        height: 44px
        line-height: 42px
        text-align: center
        box-sizing: border-box
        color: $color-text-l
        padding-bottom: 5px
        font-size: $font-size-medium
        &.active
          color: $color-theme
    .vi-tab-slider
      position: absolute
      z-index: 5
      bottom: 0
      height: 2px
</style>

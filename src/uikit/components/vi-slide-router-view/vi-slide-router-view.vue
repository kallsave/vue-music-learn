<template>
  <div class="vi-slide-router-view">
    <vi-slide ref="slide"
      :options="slideOptions"
      :initPageIndex="currentIndex"
      :scroll-events="scrollEvents"
      @scroll-end="scrollEnd"
      @scroll="scroll"
      @before-scroll-start="beforeScrollStart"
      @touch-scroll="touchScroll"
      @change-page="goToPage">
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
import Background from './vi-slide-router-view-background.vue'
import { mulitDeepClone, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-slide-router-view'

// better-scroll原始的事件(会存在嵌套事件触发多次的问题)
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

// 派生出来的事件
const EVENT_CHANGE_PAGE = 'change-page'
const EVENT_LOAD_IMAGE = 'load-image'
const EVENT_TOUCH_SCROLL = 'touch-scroll'
const EVENT_INDEX_CHANGE = 'index-change'

const DEFAULT_OPTIONS = {
  probeType: 3,
  directionLockThreshold: 0,
  scrollY: false,
  scrollX: true,
  click: false,
  snap: {
    loop: false,
    threshold: 0.3,
  },
  bounce: {
    top: true,
    bottom: true,
    left: false,
    right: false
  }
}

export default {
  name: COMPONENT_NAME,
  components: {
    ViSlide,
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
    keepAliveInclude: {
      type: Array,
      default() {
        return ['index-recommend']
      }
    },
    keepAliveExclude: {
      type: Array,
      default() {
        return []
      }
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
  },
  watch: {
    $route: {
      handler(newVal) {
        if (this.currentIndex !== -1) {
          this.pushHadShowPageList(this.currentIndex)
          this.$nextTick(() => {
            this.$refs.slide && this.$refs.slide.goToPage(this.currentIndex)
          })
        }
      },
    },
    currentIndex: {
      handler(newVal) {
        this.$emit(EVENT_INDEX_CHANGE, newVal)
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
  },
  methods: {
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
      this.$emit(EVENT_SCROLL, ...arguments)
    },
    touchScroll({x, y}) {
      this.$emit(EVENT_TOUCH_SCROLL, ...arguments)
    },
    scrollEnd(pos, slide) {
      this.$emit(EVENT_SCROLL_END)
    },
    goToPage(index) {
      this.$emit(EVENT_CHANGE_PAGE, index)
      let siblingsRouteMatchedPath = ''

      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          siblingsRouteMatchedPath = item.path
        }
      })

      // 补全路由params参数
      for (let k in this.$route.params) {
        if (new RegExp(`:${k}`).test(siblingsRouteMatchedPath)) {
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

<template>
  <div class="vi-slide-router-view">
    <slot name="tab">
      <div class="vi-slide-router-view-tab">
        <div class="vi-slide-router-view-tab-list">
          <div class="vi-slide-router-view-tab-item"
            v-for="(item, index) in siblingsRoute" :key="index">
            <span class="vi-slide-router-view-tab-item-link" :class="{'active': index === currentIndex}"
              @click="change(index)">{{item.meta.title}}</span>
          </div>
        </div>
        <div class="vi-slide-router-view-tab-bar" :style="tabStyle"></div>
      </div>
    </slot>
    <vi-slide ref="slide"
      :options="slideOptions"
      :initPageIndex="currentIndex"
      :scroll-events="scrollEvents"
      @scroll-end="scrollEnd"
      @change="change"
      @scroll="scroll"
      @before-scroll-start="touchStart">
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

import { camelize, spliceArray, mulitDeepClone } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-slide-router-view'

const EVENT_SCROLL = 'scroll'
const EVENT_SCROLL_END = 'scroll-end'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'

const EVENT_CHANGE = 'change'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_SCROLL_END]

const TAB_BAR_SIZE = 50

// scroll-end和before-scroll-start事件是必须监听的
const BIND_SCROLL_EVENTS = [EVENT_SCROLL_END, EVENT_BEFORE_SCROLL_START]

const DEFAULT_OPTIONS = {
  probeType: 3,
  directionLockThreshold: 0.5,
  scrollY: false,
  scrollX: true,
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
    isChangeRouter: {
      type: Boolean,
      default: true
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
    tabStyle() {
      let itemPercent = 1 / this.siblingsRoute.length * 100
      return {
        width: `calc(${itemPercent}% - ${TAB_BAR_SIZE}px)`,
        left: `calc(${this.currentIndex * itemPercent}% + ${TAB_BAR_SIZE / 2}px)`
      }
    }
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
  created() {
    // created => children.props => children.data => children.created
    this.slideOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
    this.pushHadShowPageList(this.currentIndex)
  },
  mounted() {
    this._findSlide()
  },
  methods: {
    _findSlide () {
      this.slide = this.$refs.slide.slide
    },
    touchStart() {
      this.touch = true
    },
    scrollEnd() {
      this.$emit(EVENT_SCROLL_END, ...arguments)
    },
    scroll() {
      this.$emit(EVENT_SCROLL, ...arguments)
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

      if (this.isChangeRouter) {
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
      background-color: $color-theme
</style>

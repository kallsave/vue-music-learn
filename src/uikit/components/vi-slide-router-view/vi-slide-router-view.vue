<template>
  <vi-slide ref="slide"
    :options="slideOptions"
    :initPageIndex="currentIndex"
    :scroll-events="scrollEvents"
    @scroll-end="scrollEnd"
    @change="change"
    @scroll="scroll">
    <div class="slide-item" v-for="(item, index) in siblingsRoute" :key="index">
      <template v-if="$route.matched[1].regex.test(item.path)">
        <component :is="item.component "></component>
      </template>
      <template v-else>
        <component :is="hadShowPageList.indexOf(index) !== -1 ? item.component : backgroundComponent"></component>
      </template>
    </div>
  </vi-slide>
</template>

<script>
import ViSlide from '../vi-slide/vi-slide.vue'
import Background from './vi-slide-router-view-background.vue'

import { camelize, spliceArray } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-slide-router-view'

const EVENT_SCROLL = 'scroll'
const EVENT_SCROLL_END = 'scroll-end'

const EVENT_CHANGE = 'change'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_SCROLL_END]

// scroll-end事件是必须监听的
// 因为基于scroll-end产生新的change事件判断处于哪一页
const BIND_SCROLL_EVENTS = [EVENT_SCROLL_END]

const DEFAULT_OPTIONS = {
  probeType: 3,
  directionLockThreshold: 0.5,
  scrollY: true,
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
    ViSlide
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
    }
  },
  computed: {
    currentIndex() {
      return this.siblingsRoute.findIndex((item) => {
        return this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)
      })
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
    }
  },
  data() {
    return {
      hadShowPageList: [],
    }
  },
  created() {
    // created => children.props => children.data => children.created
    this.slideOptions = Object.assign({}, DEFAULT_OPTIONS, this.options)
  },
  mounted() {
    this.hadShowPageList.push(this.currentIndex)
    this.slide = this.$refs.slide
  },
  methods: {
    scrollEnd() {
      this.$emit(EVENT_SCROLL_END, ...arguments, this.slide)
    },
    scroll() {
      this.$emit(EVENT_SCROLL, ...arguments, this.slide)
    },
    change(index) {
      this.$emit(EVENT_CHANGE, ...arguments)
      this.pushHadShowPageList(index)
      let route = {}
      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          route.path = item.path
        }
      })
      this.$router.push(route)
    },
    pushHadShowPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    },
  }
}
</script>

<style>

</style>

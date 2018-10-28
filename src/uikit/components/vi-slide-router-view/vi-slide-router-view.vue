<template>
  <vi-slide ref="slide"
    :options="slideOptions"
    :initPageIndex="currentIndex"
    :scroll-events="scrollEvents"
    @change="change">
    <div class="slide-item" v-for="(item, index) in siblingsRoute" :key="index">
      <template v-if="$route.matched[1].regex.test(item.path)">
        <component :is="item.component "></component>
      </template>
      <template v-else>
        <component :is=" hadShowPageList.indexOf(index) !== -1 ? item.component : Background"></component>
      </template>
    </div>
  </vi-slide>
</template>

<script>
import ViSlide from '../vi-slide/vi-slide.vue'
import Background from './vi-slide-router-view-background.vue'

const EVENT_SCROLL = 'scroll'
const EVENT_SCROLL_END = 'scroll-end'

const EVENT_CHANGE = 'change'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_SCROLL_END]

const DEFAULT_OPTIONS = {
  probeType: 3,
  directionLockThreshold: 1,
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
  components: {
    ViSlide
  },
  beforeCreate() {
    const findSiblingsRoute = (routeList) => {
      for (let i = 0; i < routeList.length; i++) {
        let item = routeList[i]
        if (this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)) {
          this.siblingsRoute = routeList
        } else if (item.children) {
          findSiblingsRoute(item.children)
        }
      }
    }
    findSiblingsRoute(this.$router.options.routes)
  },
  created() {
    this.slideOptions = Object.assign({}, DEFAULT_OPTIONS, this.options)
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
        return ['scroll-end']
      },
      validator(arr) {
        return arr.every((item) => {
          return SCROLL_EVENTS.indexOf(item) !== -1
        })
      }
    },
  },
  computed: {
    titleList() {
      return this.routerList.map((item) => {
        return item.meta.title
      })
    },
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
      Background: Background,
      keepAliveInclude: [],
      hadShowPageList: [],
    }
  },
  mounted() {
    this.hadShowPageList.push(this.currentIndex)
  },
  methods: {
    change() {
      this.$emit(EVENT_CHANAGE, ...arguments)
    },
    clickIndex(index) {
      this._pushHadShowPageListPageList(index)
    },
    changeTab(index) {
      this._pushHadShowPageListPageList(index)
      let route = {}
      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          route.path = item.path
        }
      })
      this.$router.push(route)
    },
    _pushHadShowPageListPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    }
  }
}
</script>

<style>

</style>

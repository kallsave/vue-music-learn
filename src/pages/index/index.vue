<template>
  <div class="index">
    <vi-sticky ref="sticky">
      <m-header></m-header>
      <vi-sticky-ele :ele-key="'tab'">
        <!-- <tab></tab> -->
        <slide-tab
          :data="titleList"
          :initIndex="currentIndex"
         @click-index="clickIndex"></slide-tab>
      </vi-sticky-ele>
      <!-- <vi-slide-router-transition
        slide-right-class="scroll-right"
        slide-left-class="scroll-left"
        mode="in-out"
        :router-list="siblingsRoute">
        <keep-alive exclude="no-keep-alive">
          <router-view></router-view>
        </keep-alive>
      </vi-slide-router-transition> -->

      <vi-slide ref="slide"
        :options="slideOptions"
        :initPageIndex="currentIndex"
        :scroll-events="['scroll']"
        @change="changeTab"
        @scroll="scroll">
        <div class="slide-item" v-for="(item, index) in siblingsRoute" :key="index">
          <template v-if="$route.matched[1].regex.test(item.path)">
            <component :is="item.component "></component>
          </template>
          <template v-else>
            <component :is=" hadShowPageList.indexOf(index) !== -1 ? item.component : Background"></component>
          </template>
        </div>
      </vi-slide>
    </vi-sticky>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'

import SlideTab from './components/slide-tab/slide-tab.vue'
import Background from './components/background/background.vue'

export default {
  components: {
    MHeader,
    Tab,
    SlideTab
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
  data() {
    return {
      keepAliveInclude: [],
      Background: Background,
      hadShowPageList: [],
      slideOptions: {
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
    }
  },
  computed: {
    titleList() {
      return this.siblingsRoute.map((item) => {
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
  mounted() {
    this.hadShowPageList.push(this.currentIndex)
  },
  methods: {
    clickIndex(index) {
      this.pushHadShowPageListPageList(index)
    },
    changeTab(index) {
      this.pushHadShowPageListPageList(index)
      let route = {}
      this.siblingsRoute.forEach((item, n) => {
        if (index === n) {
          route.path = item.path
        }
      })
      this.$router.push(route)
    },
    pushHadShowPageListPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    },
    scroll(pos) {
      console.log(pos)
    }
  },
}
</script>

<style lang="stylus" scoped>
.index
  height: 100vh
  position: relative

.scroll-right-enter
  transform:  translate3d(100%, 0px, 0px)

.scroll-right-enter-active
  will-change: transform
  transition: transform 0.2s
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-right-enter-to
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-right-leave-active
  will-change: transform
  transition: transform 0.2s
  display: none

.scroll-right-leave-to
  transform:  translate3d(-100%, 0px, 0px)
  display: none

.scroll-left-enter
  transform:  translate3d(-100%, 0px, 0px)

.scroll-left-enter-active
  will-change: transform
  transition: transform 0.2s
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-left-enter-to
  z-index: 100
  width: 100%
  height: calc(100vh - 44px)
  top: 88px
  position: absolute

.scroll-left-enter-to
  transform:  translate3d(0px, 0px, 0px)
  will-change: transform
  transition: transform 0.2s

.scroll-left-leave-active
  will-change: transform
  transition: transform 0.2s
  display: none

.scroll-left-leave-to
  transform:  translate3d(100%, 0px, 0px)
  display: none

</style>

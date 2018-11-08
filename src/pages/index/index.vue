<template>
  <div class="index">
    <vi-sticky ref="sticky">
      <m-header></m-header>
      <vi-sticky-ele :ele-key="'tab'">
        <tab></tab>
      </vi-sticky-ele>
      <!-- <vi-slide-router-transition
        slide-right-class="scroll-right"
        slide-left-class="scroll-left"
        mode="in-out">
        <keep-alive :include="[IMMUTABLE_KEEP_ALIVE_NAME, mutableKeepAliveName]">
          <router-view></router-view>
        </keep-alive>
      </vi-slide-router-transition> -->

      <vi-slide-router-view
        :scroll-events="['scroll']"
        :options="slideRouterOptions"
        @scroll="scroll"
        @change="change"
      ></vi-slide-router-view>
    </vi-sticky>
  </div>
</template>

<script>
import { IMMUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { mapGetters } from 'vuex'
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import SlideTab from './components/slide-tab/slide-tab.vue'
import Background from './components/background/background.vue'

export default {
  // 从其他页面转这个页面,不会keep-alive,子路由之间跳转可以keep-alive
  name: NO_KEEP_ALIVE_NAME,
  components: {
    MHeader,
    Tab,
    SlideTab
  },
  data() {
    return {
      IMMUTABLE_KEEP_ALIVE_NAME: IMMUTABLE_KEEP_ALIVE_NAME,
      slideRouterOptions: {
        name: 'a',
        snap: {
          loop: false,
          a: 1
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  methods: {
    change(index) {
      console.log(index)
    },
    scroll(pos) {
      // console.log(pos)
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

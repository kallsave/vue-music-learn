<template>
  <div id="app" class="app">
    <transition :name="transitionName" :mode="mode">
      <keep-alive :include="[IMMUTABLE_KEEP_ALIVE_NAME, mutableKeepAliveName]">
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import { IMMUTABLE_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { mapGetters } from 'vuex'
import Player from '@/components/player/player.vue'

export default {
  name: 'App',
  components: {
    Player
  },
  data() {
    return {
      IMMUTABLE_KEEP_ALIVE_NAME: IMMUTABLE_KEEP_ALIVE_NAME,
      transitionName: '',
      mode: '',
      routerHistory: []
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  watch: {
    $route: {
      handler(to, from) {
        if (!to.meta || !to.meta.isUseRouterTransition || !from || !from.meta || !from.meta.isUseRouterTransition) {
          this.transitionName = ''
          this.mode = ''
        } else {
          if (to.fullPath === this.routerHistory[1]) {
            this.transitionName = 'move-left'
            // 返回到一个页面,相当于新打开一个页面
            this.routerHistory = []
          } else {
            this.transitionName = 'move-right'
          }
        }

        this.insertArray({
          arr: this.routerHistory,
          val: to.fullPath,
          maxLength: 2
        })
      },
      immediate: true
    },
  },
  methods: {
    insertArray({ arr, val, compare = (item) => {
      return item === val
    }, maxLength } = {}) {
      const index = arr.findIndex(compare)

      if (index === 0) {
        return
      }

      if (index > 0) {
        arr.splice(index, 1)
      }
      arr.unshift(val)
      if (maxLength && arr.length > maxLength) {
        arr.pop()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.router-view
  &.move-right-enter
    will-change: transform
    transform: translate3d(100%, 0, 0)
  &.move-right-enter-active
    will-change: transform
    transition: transform 0.3s cubic-bezier(.61,0,.44,1)
  &.move-right-enter-to
    will-change: auto
    transform: none

  &.move-right-leave
    will-change: transform
  &.move-right-leave-active
    transform: translate3d(-30%, 0, 0)
    transition: transform 0.28s cubic-bezier(.61,0,.44,1)
  &.move-right-leave-to
    will-change: auto
    transform: translate3d(-30%, 0, 0)

  &.move-left-enter
    transform: translate3d(-30%, 0, 0)
    will-change: transform
  &.move-left-enter-active
    will-change: transform
    transition: transform 0.3s cubic-bezier(.61,0,.44,1)
  &.move-left-enter-to
    will-change: auto
    transform: none

  &.move-left-leave
    will-change: transform
  &.move-left-leave-active
    transform: translate3d(100%, 0, 0)
    transition: transform 0.28s cubic-bezier(.61,0,.44,1)
  &.move-left-leave-to
    will-change: auto
    transform: translate3d(100%, 0, 0)
</style>

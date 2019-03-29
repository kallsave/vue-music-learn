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
import { IMMUTABLE_KEEP_ALIVE_NAME } from '@/store/modules/keep-alive-name/config.js'
import { mapGetters, mapMutations } from 'vuex'
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
      'mutableKeepAliveName',
      'routerTransitionName'
    ])
  },
  watch: {
    $route: {
      handler(to, from) {
        if (!to.meta || !to.meta.isUseRouterTransition || !from || !from.meta || !from.meta.isUseRouterTransition) {
          this.transitionName = ''
          this.mode = ''
        } else {
          if (this.routerTransitionName) {
            this.transitionName = this.routerTransitionName
            this.mode = ''
            this.setRouterTransitionName('')
            // 返回到一个页面,相当于新打开一个页面
            this.routerHistory = []
          } else {
            if (to.fullPath === this.routerHistory[1]) {
              this.transitionName = 'move-left'
              this.mode = ''
              // 返回到一个页面,相当于新打开一个页面
              this.routerHistory = []
            } else {
              this.transitionName = 'move-right'
              this.mode = ''
            }
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
    ...mapMutations({
      setRouterTransitionName: 'SET_ROUTER_TRANSITION_NAME'
    }),
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

<style lang="stylus" modules>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/ease.styl"

.app
  background: $color-background
  .router-view
    &.move-right-enter
      transform: translate3d(100%, 0, 0)
    &.move-right-enter-active
      transition: transform 0.3s $ease-out-in
    &.move-right-enter-to
      transform: none

    &.move-right-leave
    &.move-right-leave-active
      transition: transform 0.28s $ease-out-in
    &.move-right-leave-to
      transform: translate3d(-50%, 0, 0)

    &.move-left-enter
      transform: translate3d(-20%, 0, 0)
    &.move-left-enter-active
      transition: transform 0.3s $ease-out-in
    &.move-left-enter-to
      transform: none

    &.move-left-leave
    &.move-left-leave-active
      transform: translate3d(100%, 0, 0)
      transition: transform 0.28s $ease-out-in
    &.move-left-leave-to
      transform: translate3d(100%, 0, 0)
</style>

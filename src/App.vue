<template>
  <div ref="app" id="app" class="app">
    <transition
      :name="transitionName"
      :mode="mode"
      :duration="routerDuration"
      @after-enter="afterEnter">
      <keep-alive :include="keepAliveRouteList">
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import { AFTER_ENTER, FINISH } from '@/store/modules/router-transition-state/config.js'
import { mapGetters, mapMutations } from 'vuex'
import Player from '@/components/player/player.vue'
import Stack from '@/common/class/stack.js'

const forwardBackCache = new Stack(2)

export default {
  name: 'App',
  components: {
    Player
  },
  data() {
    return {
      transitionName: '',
      mode: '',
      forwardBackCache: forwardBackCache,
      routerDuration: {
        enter: 300,
        leave: 300
      },
    }
  },
  computed: {
    ...mapGetters([
      'routerTransition',
      'keepAliveRouteList',
    ])
  },
  watch: {
    $route: {
      handler(to, from) {
        if (!to.meta || !to.meta.isUseRouterTransition || !from || !from.meta || !from.meta.isUseRouterTransition) {
          this.transitionName = ''
          this.mode = ''
        } else {
          if (this.routerTransition.name) {
            this.transitionName = this.routerTransition.name
            this.mode = this.routerTransition.mode
            this.setRouterTransition({
              name: '',
              mode: ''
            })
          } else if (to.fullPath === this.forwardBackCache.getByIndex(1)) {
            this.transitionName = 'move-left'
            this.mode = ''
            // 返回到一个页面,相当于重新清空了前进和后退的关系
            this.forwardBackCache.clearAll()
          } else {
            this.transitionName = 'move-right'
            this.mode = ''
          }
        }
        this.forwardBackCache.add(to.fullPath)
      },
      immediate: true
    },
  },
  methods: {
    ...mapMutations({
      setRouterTransition: 'SET_ROUTER_TRANSITION',
      setRouterTransitionState: 'SET_ROUTER_TRANSITION_STATE'
    }),
    afterEnter() {
      this.setRouterTransitionState(AFTER_ENTER)
      window.setTimeout(() => {
        this.setRouterTransitionState(FINISH)
      }, 100)
    }
  }
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/ease.styl"

.app
  background: $color-background
  min-height: 100vh
  .router-view
    &.move-right-enter
      transform: translate3d(100%, 0, 0)
    &.move-right-enter-active
      transition: transform 300ms $ease-in
    &.move-right-enter-to
      transform: none

    &.move-right-leave
    &.move-right-leave-active
      transition: transform 280ms $ease-out-in
    &.move-right-leave-to
      transform: translate3d(-20%, 0, 0)

    &.move-left-enter
      transform: translate3d(-20%, 0, 0)
    &.move-left-enter-active
      transition: transform 300ms $ease-in
    &.move-left-enter-to
      transform: none

    &.move-left-leave
    &.move-left-leave-active
      transform: translate3d(100%, 0, 0)
      transition: transform 280ms $ease-out-in
    &.move-left-leave-to
      transform: translate3d(100%, 0, 0)

</style>

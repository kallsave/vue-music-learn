<template>
  <div ref="app"
    :class="$style['app']">
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Player from '@/components/player/player.vue'
import Stack from '@/common/class/stack.js'

let historyStack = new Stack(2)

export default {
  name: 'App',
  components: {
    Player
  },
  data() {
    return {
      transitionName: '',
      mode: '',
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
        if (this.$route.name) {
          this.keepAliveRouteAdd(this.$route.name)
          // console.log('this.keepAliveRouteList', this.keepAliveRouteList)
        }
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
          } else {
            this.transitionName = 'move-right'
            this.mode = ''
          }
        }
        historyStack.add(window.location.href)
      },
      immediate: true
    },
  },
  mounted() {
    this.addEventListenerPopstate()
  },
  methods: {
    ...mapMutations({
      setRouterTransition: 'SET_ROUTER_TRANSITION',
      setRouterTransitionState: 'SET_ROUTER_TRANSITION_STATE'
    }),
    ...mapActions([
      'keepAliveRouteAdd',
      'keepAliveRouteRemove'
    ]),
    afterEnter() {
      this.setRouterTransitionState(AFTER_ENTER)
      window.setTimeout(() => {
        this.setRouterTransitionState(FINISH)
      }, 100)
    },
    addEventListenerPopstate() {
      window.addEventListener('hashchange', (e) => {
        // 第一次触发hashchange肯定是浏览器的点击后退
        let newURL = e.newURL
        if (historyStack.getByIndex(1) === newURL) {
          historyStack.clearAll()
          this.lastRouteName = this.$route.name
          this.keepAliveRouteRemove(this.lastRouteName)
          this.setRouterTransition({
            name: 'move-left',
            mode: ''
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/ease.styl"

.app
  background-color: #222
  :global
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

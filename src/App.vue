<template>
  <div ref="app"
    :class="$style['app']">
    <transition
      :name="transitionName"
      :mode="mode"
      :duration="routerDuration"
      @after-enter="afterEnter">
      <router-cache>
        <router-view class="router-view"></router-view>
      </router-cache>
    </transition>
    <!-- <player></player> -->
  </div>
</template>

<script>
import { AFTER_ENTER, FINISH } from '@/store/modules/router-transition-state/config.js'
import { mapGetters, mapMutations, mapdirection } from 'vuex'
import Player from '@/components/player/player.vue'
import Stack from '@/common/class/stack.js'

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
    ])
  },
  watch: {
    $route: {
      handler(to, from) {
        console.log(to.params.direction)
        // 没有配置useRouterTransition的页面的过渡效果
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
            if (to.params.direction === 'back') {
              this.transitionName = 'move-left'
              this.mode = ''
            } else {
              this.transitionName = 'move-right'
              this.mode = ''
            }
          }
        }
      }
    }
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
    },
  }
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/ease.styl"

.app
  height: 100%
  background-color: #222
  :global
    .router-view
      &.move-right-enter
        transform: translate3d(100%, 0, 0)
      &.move-right-enter-active
        transition: transform 300ms ease-in-out
      &.move-right-enter-to
        transform: none

      &.move-right-leave
      &.move-right-leave-active
        transition: transform 280ms ease-in-out
      &.move-right-leave-to
        transform: translate3d(-20%, 0, 0)

      &.move-left-enter
        transform: translate3d(-20%, 0, 0)
      &.move-left-enter-active
        transition: transform 300ms ease-in-out
      &.move-left-enter-to
        transform: none

      &.move-left-leave
      &.move-left-leave-active
        transition: transform 280ms ease-in-out
      &.move-left-leave-to
        transform: translate3d(100%, 0, 0)

// .app {
//   background-color: #222;
//   :global {
//     .router-view {
//       position: absolute;
//       width: 100%;
//       left: 0;
//       top: 0;
//       // 防止布局溢出导致动画抖动
//       overflow-x: hidden;
//       &.move-right-enter {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//         left: 100%;
//       }
//       &.move-right-enter-active {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//         transition: left 300ms @easeInOut;
//       }
//       &.move-right-enter-to {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//       }
//       &.move-right-leave {
//         z-index: 10;
//       }
//       &.move-right-leave-active {
//         z-index: 10;
//         transition: left 300ms @easeInOut;
//       }
//       &.move-right-leave-to {
//         z-index: 10;
//         left: -50%;
//       }
//       &.move-left-enter {
//         z-index: 10;
//         left: -30%;
//       }
//       &.move-left-enter-active {
//         z-index: 10;
//         transition: left 300ms @easeInOut;
//       }
//       &.move-left-enter-to {
//         z-index: 10;
//       }
//       &.move-left-leave {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//         left: 0%;
//       }
//       &.move-left-leave-active {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//         left: 100%;
//         transition: left 300ms @easeInOut;
//       }
//       &.move-left-leave-to {
//         position: fixed;
//         z-index: 20;
//         height: 100vh;
//         left: 100%;
//       }
//     }
//   }
// }

</style>

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
      mode: ''
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  },
  watch: {
    $route(to, from) {
      if (!to.meta || !to.meta.index || !from.meta || !from.meta.index) {
        this.transitionName = ''
        this.mode = ''
        return
      }
      if (to.meta.index >= from.meta.index) {
        this.transitionName = 'move-right'
        this.mode = ''
      } else {
        this.transitionName = 'move-left'
        this.mode = ''
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

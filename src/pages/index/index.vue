<template>
  <div class="index">
    <vi-sticky ref="sticky"
      @sticky-change="stickyChange">
      <m-header></m-header>
      <vi-sticky-ele :ele-key="'tab'">
        <tab></tab>
      </vi-sticky-ele>
      <vi-slide-router :router-list="routerList">
        <keep-alive exclude="no-keep-alive">
          <router-view></router-view>
        </keep-alive>
      </vi-slide-router>
    </vi-sticky>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'

export default {
  components: {
    MHeader,
    Tab,
  },
  data() {
    return {
      routerList: [
        {
          path: '/recommend',
        },
        {
          path: '/singer',
        },
        {
          path: '/rank',
        },
        {
          path: '/search',
        }
      ]
    }
  },
  methods: {
    stickyChange() {
      this.$refs.sticky.scroll.disable()
    }
  },
}
</script>

<style lang="stylus" scoped>
.index
  height: 100vh
  position: relative
</style>

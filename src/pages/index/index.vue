<template>
  <div class="index">
    <vi-sticky ref="sticky"
      @sticky-change="stickyChange">
      <m-header></m-header>
      <vi-sticky-ele :ele-key="'1'">
        <tab></tab>
      </vi-sticky-ele>
      <router-view></router-view>
    </vi-sticky>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'

export default {
  name: 'App',
  methods: {
    stickyChange() {
      this.$refs.sticky.scroll.disable()
    },
  },
  components: {
    MHeader,
    Tab,
  }
}
</script>

<style lang="stylus" scoped>
.index
  height: 100vh
  position: relative
</style>

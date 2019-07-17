<template>
  <transition name="router-slide-css-transform">
    <router-view class="router-view"></router-view>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/transition.styl"
</style>

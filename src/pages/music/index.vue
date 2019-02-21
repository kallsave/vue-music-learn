<template>
  <transition name="router-slide-css-transform">
    <router-view class="router-view"></router-view>
  </transition>
</template>

<script>
export default {
  name: 'no-keep-alive'
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/transition.styl"
</style>

<template>
  <transition name="router-slide">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  name: 'no-keep-alive'
}
</script>

<style lang="stylus">
@import "~@/common/stylus/transition.styl"
</style>

<template>
  <div id="app" class="app">
    <!-- 它的所有后代子路由除了名字为no-keep-alive的组件都有activated钩子 -->
    <keep-alive exclude="no-keep-alive">
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Player from '@/components/player/player.vue'

export default {
  name: 'App',
  components: {
    Player
  }
}
</script>

<style lang="stylus" scoped>
</style>

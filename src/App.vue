<template>
  <div id="app" class="app">
    <router-view></router-view>
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

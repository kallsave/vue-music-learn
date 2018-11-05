<template>
  <div id="app" class="app">
    <keep-alive :include="['immutable-keep-alive', mutableKeepAlive]">
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Player from '@/components/player/player.vue'

export default {
  name: 'App',
  components: {
    Player
  },
  computed: {
    ...mapGetters([
      'mutableKeepAlive'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>

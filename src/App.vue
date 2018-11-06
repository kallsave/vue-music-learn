<template>
  <div id="app" class="app">
    <keep-alive :include="[IMMUTABLE_KEEP_ALIVE_NAME, mutableKeepAliveName]">
      <router-view></router-view>
    </keep-alive>
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
      IMMUTABLE_KEEP_ALIVE_NAME: IMMUTABLE_KEEP_ALIVE_NAME
    }
  },
  computed: {
    ...mapGetters([
      'mutableKeepAliveName'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>

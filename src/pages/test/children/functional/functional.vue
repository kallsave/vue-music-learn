<template>
  <div class="functional">
    <vi-view :list=list :options="options">
      <div>
        <m-header></m-header>
      </div>
    </vi-view>
  </div>
</template>

<script>
import MHeader from './components/header/header.vue'

export default {
  components: {
    MHeader
  },
  data() {
    return {
      list: [1, 2],
      options: {
        probeType: 3
      }
    }
  }
}
</script>

<style>

</style>

<template>
  <div class="inject">
    <vi-inject :vi-inject="list">
      <test></test>
    </vi-inject>
  </div>
</template>

<script>
import Test from './components/test/test.vue'

export default {
  components: {
    Test
  },
  data() {
    return {
      list: [
        {
          name: 'vue'
        }
      ]
    }
  },
}
</script>

<style lang="stylus">

</style>

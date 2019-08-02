<template>
  <div :class="$style['slow']">
    <div class="box"
      v-for="(item, index) in list"
      :key="index"
      @click="clickHandler">
    </div>
  </div>
</template>

<script>
import slow from '@/common/helpers/slow.js'

export default {
  data() {
    return {
      list: [0, 1]
    }
  },
  methods: {
    clickHandler(e) {
      slow(e.target, {
        duration: 400,
        offset: {
          translateY: 200,
          translateX: 200,
        },
        done: () => {
          console.log('done')
        }
      })
    }
  }
}
</script>

<style lang="stylus" module>
.slow
  height: 100vh
  background: #fff
  :global
    .box
      width: 50px
      height: 50px
      background: peru
</style>

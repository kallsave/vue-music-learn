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
      if (!this.hadClick) {
        this.hadClick = !this.hadClick
        if (!this.move) {
          this.move = slow(e.target, {
            duration: 4000,
            offset: {
              translateY: 200,
              translateX: 200,
            },
            done: () => {
              console.log('done')
            }
          })
        }
        return
      }
      this.move.stop()
    }
  }
}
</script>

<style lang="stylus" module>
.slow
  height: 100%
  background: #fff
  :global
    .box
      width: 50px
      height: 50px
      background: peru
</style>

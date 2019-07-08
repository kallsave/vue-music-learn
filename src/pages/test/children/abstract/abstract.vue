<template>
  <div class="abstract">
    <div>abstract</div>
    <throttle-button>
      <div @click="clickHandler">sss</div>
    </throttle-button>
  </div>
</template>

<script>
import ThrottleButton from './components/throttle-button.js'

export default {
  components: {
    ThrottleButton
  },
  methods: {
    clickHandler() {
      console.log(66)
    }
  }
}
</script>

<style lang="stylus" modules>
.abstract
  font-size: 16px
  color: #fff
  .text
    width: 90%
    margin: 0 auto
    height: 40px
    line-height: 40px
    background: peru
    margin-bottom: 30px
    border-radius: 5px
</style>

<template>
  <div :class="$style['source']">
    <div>source</div>
    <div class="text" v-show="isShowText">text</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowText: false,
      map: {
        name: 'source'
      }
    }
  },
  computed: {
    list() {
      return [1]
    }
  },
  methods: {
    show() {
      console.log('source')
    },
    clearData() {
      console.log('clearData')
    },
    showText() {
      this.isShowText = true
    },
    hideText() {
      this.isShowText = false
    }
  }
}
</script>

<style lang="stylus" module>
.source
  width: 100%
  height: 100vh
  color: #fff
  font-size: 16px
  :global
    .text
      height: 30px
      line-height: 30px
      text-align: center
      background: peru
</style>

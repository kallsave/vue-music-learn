<template>
  <div :class="$style['scroll-textarea']">
    <vi-scroll
      ref="scroll"
      :options="scrollOptions">
      <div class="item"
        v-for="(item, index) in list"
        :key="index + 100"
        @click="clickHanlder">
      </div>
      <textarea class="textarea"></textarea>
      <div class="item"
        v-for="(item, index) in list"
        :key="index + 1000"
        @click="clickHanlder">
      </div>
    </vi-scroll>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollOptions: {
        click: true
      },
      list: [1, 2, 3],
    }
  },
  mounted() {
    this.$refs.scroll.refresh()
  },
  methods: {
    clickHanlder() {
      console.log(11)
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-textarea
  height: 100vh
  :global
    .item
      height: 100px
      background: peru
      margin-bottom: 20px
    .textarea
      width: 100%
      height: 200px
</style>

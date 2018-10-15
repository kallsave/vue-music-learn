<template>
  <div class="sticky-view-container">
    <div class="scroll-wrapper">
      <vi-sticky
        ref="sticky"
        :z-index="50"
        :sticky-data="[items1, items2]"
        @change="stickyChange">
        <ul>
          <li v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
        <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
        <!-- 需要做吸顶处理的元素 -->
        <vi-sticky-ele :ele-key="1" v-if="first">
          <div class="title1">256</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items2" :key="index">{{item}}</li>
        </ul>
        <vi-sticky-ele :ele-key="eleNumber">
          <div class="title2 needsclick" @click="clickHandle">999</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items3" :key="index">{{item}}</li>
        </ul>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
      </vi-sticky>
    </div>
  </div>
</template>

<script>

const _data = [
  '😀 😁 😂 🤣 😃 😄 ',
  '🙂 🤗 🤩 🤔 🤨 😐 ',
  '👆🏻 scroll up/down 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👆🏻 scroll up/down 👇🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 ',
  '🤓 🤓 🤓 🤓 🤓 🤓 ',
  '👆🏻 scroll up/down 👇🏻 ',
  '🦔 🦔 🦔 🦔 🦔 🦔 ',
  '🙈 🙈 🙈 🙈 🙈 🙈 ',
  '👆🏻 scroll up/down 👇🏻 ',
  '🚖 🚖 🚖 🚖 🚖 🚖 ',
  '✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 '
]

export default {
  data() {
    return {
      items1: [],
      items2: [],
      items3: _data.concat(),
      items4: _data.concat(),
      first: true,
      eleNumber: 2
    }
  },
  created() {
    setTimeout(() => {
      this.items1 = _data.concat()
      this.items2 = _data.concat()
    }, 2000)
  },
  mounted() {

  },
  methods: {
    imgLoad() {
      this.$refs.sticky && this.$refs.sticky.scrollTop()
    },
    stickyChange(key) {
    },
    clickHandle() {
      this.eleNumber = 1
    }
  }
}
</script>

<style lang="stylus" scoped>
.needsclick
  touch-action: none;
.sticky-view-container
  height: 100vh
  .scroll-wrapper
    height: 100%
    overflow: hidden
    .title1
      background: gold
      color: #fff
      font-size: 20px
      text-align: center
      line-height: 30px
    .title2
      background: peru
      color: #fff
      font-size: 20px
      text-align: center
      line-height: 60px
    img
      vertical-align: top
      width: 100%
      transform: rotate(180deg)
    ul
      li
        padding: 20px 10px
</style>

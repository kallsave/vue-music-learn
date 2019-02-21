<template>
  <div class="sticky-view-container">
    <div class="scroll-wrapper">
      <vi-native-sticky
        ref="sticky"
        :z-index="50"
        :sticky-data="[items1, items2]"
        @change="stickyChange">
        <ul>
          <li v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
        <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
        <vi-native-sticky-ele v-if="first" ele-key="55">
          <div class="title1">256</div>
        </vi-native-sticky-ele>
        <ul>
          <li v-for="(item, index) in items2" :key="index">{{item}}</li>
        </ul>
        <vi-native-sticky-ele>
          <div class="title2" ele-key="56" @click="clickHandle">999</div>
        </vi-native-sticky-ele>
        <ul>
          <li v-for="(item, index) in items3" :key="index">{{item}}</li>
        </ul>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
      </vi-native-sticky>
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
      first: false,
    }
  },
  created() {
    // setTimeout(() => {
    this.items1 = _data.concat()
    this.items2 = _data.concat()
    this.first = true
    // }, 2000)
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

<style lang="stylus" modules>
.sticky-view-container
  height: 100vh
  .scroll-wrapper
    height: 100%
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

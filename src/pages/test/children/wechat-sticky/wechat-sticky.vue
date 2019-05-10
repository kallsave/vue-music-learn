<template>
  <div class="sticky-view-container">
    <div class="scroll-wrapper">
      <vi-sticky
        ref="sticky"
        :z-index="50"
        :sticky-data="[items1, items2]"
        @change="stickyChange">
        <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
        <!-- 需要做吸顶处理的元素 -->
        <vi-sticky-ele v-if="first" merge-ele-key="1">
          <div class="title1">256</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items2" :key="index">{{item}}</li>
        </ul>
        <vi-sticky-ele merge-ele-key="1">
          <div class="title2 needsclick" @click="clickHandle">999</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
        <vi-sticky-ele  merge-ele-key="3">
          <div class="title2 needsclick" @click="clickHandle">3669</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items3" :key="index">{{item}}</li>
        </ul>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
        <vi-sticky-ele  merge-ele-key="4">
          <div class="title2 needsclick" @click="clickHandle">4</div>
        </vi-sticky-ele>
        <ul>
          <li v-for="(item, index) in items4" :key="index">{{item}}</li>
        </ul>
        <vi-sticky-ele  merge-ele-key="5">
          <div class="title2 needsclick" @click="clickHandle">5</div>
        </vi-sticky-ele>
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
    }
  },
  created() {
    this.items1 = _data.concat()
    this.items2 = _data.concat()
    // this.first = true
  },
  methods: {
    imgLoad() {
      this.$refs.sticky && this.$refs.sticky.calculateAllStickyEleTop()
    },
    stickyChange(key) {
    },
    clickHandle() {
      console.log(66)
    }
  }
}
</script>

<style lang="stylus" modules>
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

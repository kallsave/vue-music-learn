<template>
  <div class="vi-native-sticky-page">
    <div style="height: 300px; background: gold"></div>
    <div ref="scroll"
      style="height: calc(100vh - 300px)"
      class="scroll-wrapper">
      <template v-if="isNative">
        <vi-native-sticky
          ref="sticky"
          :data="stickyData">
          <div class="scroll-content">
            <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
            <ul>
              <li v-for="(item, index) in items1" :key="index">{{item}}</li>
            </ul>
            <vi-native-sticky-ele>
              <div class="title1">256</div>
            </vi-native-sticky-ele>
            <ul>
              <li v-for="(item, index) in items2" :key="index">{{item}}</li>
            </ul>
            <vi-native-sticky-ele>
              <div class="title1">789</div>
            </vi-native-sticky-ele>
            <ul>
              <li v-for="(item, index) in items2" :key="index">{{item}}</li>
            </ul>
            <div>结尾</div>
          </div>
        </vi-native-sticky>
      </template>
      <template v-else>
        <vi-scroll
          ref="scroll"
          :options="options"
          :scrollEvents="['scroll']"
          @scroll="scrollHandler">
          <div class="scroll-content">
            <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
            <ul>
              <li v-for="(item, index) in items1" :key="index">{{item}}</li>
            </ul>
            <vi-native-sticky-ele>
              <div class="title1">257</div>
            </vi-native-sticky-ele>
            <ul>
              <li v-for="(item, index) in items2" :key="index">{{item}}</li>
            </ul>
            <vi-native-sticky-ele>
              <div class="title1">789</div>
            </vi-native-sticky-ele>
            <ul>
              <li v-for="(item, index) in items2" :key="index">{{item}}</li>
            </ul>
          </div>
        </vi-scroll>
      </template>
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
      options: {
        probeType: 3,
      },
      scrollEvents: ['scroll'],
      scrollY: 0,
      items1: _data.concat(),
      items2: _data.concat(),
      isNative: true,
      stickyData: []
    }
  },
  mounted() {
    setTimeout(() => {
      window.addEventListener('scroll', (e) => {
        console.log('w')
      }, false)
    }, 200)
  },
  methods: {
    scrollHandler(pos) {
      this.scrollY = pos.y
    },
    imgLoad() {
      if (!this.isNative) {
        this.$refs.scroll.refresh()
        this.$refs.sticky.calculateAllStickyEleTop()
      } else {
        this.stickyData.push(0)
      }
    }
  },
}
</script>

<style lang="stylus">
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
</style>

<style lang="stylus" modules>
.vi-native-sticky-page
  height: 100vh
  color: #fff
  overflow: hidden
  img
    vertical-align: top
    width: 100%
    transform: rotate(180deg)
  .scroll-wrapper
    height: 100%
    .scroll-content
      font-size: 14px
      ul
        li
          padding: 20px 10px
</style>

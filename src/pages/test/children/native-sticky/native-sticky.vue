<template>
  <div :class="$style['vi-native-sticky-page']">
    <div style="height: 300px; background: gold"></div>
    <div class="scroll-wrapper"
      style="height: calc(100vh - 300px)">
      <template v-if="isNativeScroll">
        <vi-native-sticky
          ref="sticky"
          :scroll-y="scrollY"
          :data="stickyData">
          <vi-native-scroll @scroll="scrollHandler">
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
              <div style="line-height: 50px;text-align: center; background: peru">结尾</div>
            </div>
          </vi-native-scroll>
        </vi-native-sticky>
      </template>
      <template v-else>
        <vi-native-sticky
          ref="sticky"
          :scroll-y="scrollY"
          @sticky-change="stickyChange">
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
                <vi-native-sticky-ele v-if="first">
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
                <div style="line-height: 50px;text-align: center; background: peru">结尾</div>
              </div>
          </vi-scroll>
        </vi-native-sticky>
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
      isNativeScroll: false,
      stickyData: [],
      first: false
    }
  },
  mounted() {
    window.addEventListener('scroll', (e) => {
      console.log('w')
    }, false)
    // window.setTimeout(() => {
    //   this.first = true
    //   this.$nextTick(() => {
    //     this.$refs.sticky.recalculate()
    //     this.$refs.scroll.refresh()
    //   })
    // }, 2000)
  },
  methods: {
    scrollHandler(pos) {
      if (this.isNativeScroll) {
        this.scrollY = pos.y
      } else {
        this.scrollY = -pos.y
      }
    },
    imgLoad() {
      if (this.isNativeScroll) {
        this.$refs.sticky.recalculate()
      } else {
        this.$refs.scroll.refresh()
        this.$refs.sticky.recalculate()
      }
    },
    stickyChange() {
      // this.$nextTick(() => {
      //   this.$refs.scroll.refresh()
      // })
    }
  },
}
</script>

<style lang="stylus" module>
.vi-native-sticky-page
  height: 100vh
  color: #fff
  overflow: hidden
  :global
    img
      vertical-align: top
      width: 100%
      transform: rotate(180deg)
    .scroll-wrapper
      .scroll-content
        font-size: 14px
        ul
          li
            padding: 20px 10px
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

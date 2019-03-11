<template>
  <div class="better-sticky-page">
    <div class="scroll-wrapper">
      <better-sticky
        ref="sticky"
        :scroll-y="scrollY">
        <template v-if="isNative">
          <div class="scroll-content">
              <img @load="imgLoad" src="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg">
              <ul>
                <li v-for="(item, index) in items1" :key="index">{{item}}</li>
              </ul>
              <better-sticky-ele>
                <div class="title1">256</div>
              </better-sticky-ele>
              <ul>
                <li v-for="(item, index) in items2" :key="index">{{item}}</li>
              </ul>
              <better-sticky-ele>
                <div class="title1">789</div>
              </better-sticky-ele>
              <ul>
                <li v-for="(item, index) in items2" :key="index">{{item}}</li>
              </ul>
            </div>
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
              <better-sticky-ele>
                <div class="title1">257</div>
              </better-sticky-ele>
              <ul>
                <li v-for="(item, index) in items2" :key="index">{{item}}</li>
              </ul>
              <better-sticky-ele>
                <div class="title1">789</div>
              </better-sticky-ele>
              <ul>
                <li v-for="(item, index) in items2" :key="index">{{item}}</li>
              </ul>
            </div>
          </vi-scroll>
        </template>
      </better-sticky>
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
      isNative: true
    }
  },
  mounted() {
    if (this.isNative) {
      setTimeout(() => {
        window.scrollTo(0, 0)
        this.$refs.sticky.$el.addEventListener('scroll', (e) => {
          this.scrollY = e.target.scrollTop
        }, false)

        window.addEventListener('scroll', (e) => {
          console.log('w')
        }, false)
      }, 200)
    }
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
        this.$refs.sticky.calculateAllStickyEleTop()
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
.better-sticky-page
  height: 100vh
  color: #fff
  .scroll-wrapper
    height: 100%
    .scroll-content
      font-size: 14px
      img
        vertical-align: top
        width: 100%
        transform: rotate(180deg)
      ul
        li
          padding: 20px 10px
</style>

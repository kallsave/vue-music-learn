<template>
  <div class="input-page">
    <vi-popup ref="popup" @mask-click="hidePopup"></vi-popup>
    <div ref="inputWrapper"
      class="input-wrapper">
      <search-box ref="input"
        placeholder="输入"
        @focusout="blurHandler"></search-box>
    </div>
    <div class="box"
      v-for="(item, index) in list"
      :key="index"
      @touchend="clickHandler($event, item)">{{item}}</div>
    <!-- <div class="fixed-bottom"></div> -->
  </div>
</template>

<script>
import SearchBox from '@/base-components/search-box/search-box.vue'

export default {
  components: {
    SearchBox
  },
  data() {
    return {
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      query: '',
      isShowInput: true
    }
  },
  mounted() {
    // const ua = window.navigator.userAgent
    // focusout事件和blur事件之间的主要区别在于后者不会冒泡.
    // document.body.addEventListener('focusout', () => {
    //   console.log(66)
    //   if (ua.indexOf('iPhone') > 0 || ua.index('iPad') > 0) {
    //     // 滚动到底部
    //     document.body.scrollTop = document.body.scrollHeight
    //   }
    // })
    console.log()
  },
  methods: {
    clickHandler(e, item) {
      e.preventDefault()
      if (item === 2) {
        this.$refs.popup.show()
        this.$refs.inputWrapper.style.bottom = `${0}px`
        this.$refs.input.$refs.input.focus()
      }
    },
    blurHandler() {
      this.$refs.inputWrapper.style.bottom = `${-100}px`
    },
    hidePopup() {
      this.$refs.popup.hide()
    }
  }
}
</script>

<style lang="stylus" modules>
.input-page
  background: #f4f4f4
  padding-bottom: 60px
  position: relative
  .box
    line-height: 100px
    height: 100px
    text-align: center
    background: gold
    font-size: 18px
    margin-bottom: 20px
  .input-wrapper
    position: fixed
    width: 100%
    bottom: -100px
    transition: all 300ms
    z-index: 10000
    &.input-enter
      bottom: 0
    &.input-enter-active
      transition: all 300ms
    &.input-enter-to
      bottom: 60px
    &.input-leave
      bottom: 60px
    &.input-leave-active
      transition: all 300ms
    &.input-leave-to
      bottom: 0
  .fixed-bottom
    position: fixed
    bottom: 0
    width: 100%
    height: 60px
    background: red

</style>

<template>
  <div :class="$style['scroll-height']">
    <div class="box"
      v-for="(item, index) in list"
      :key="index"
      @click="clickHandler">{{index}}</div>
    <vi-popup
      ref="popup"
      class="popup"
      v-if="isShowPopup"
      @mask-click="maskClick">
        <div class="popup-content" v-stop-propagation-scroll>
          <div class="inner-box"
            v-for="(item, index) in popupList"
            :key="index"
            @click="clickHandler($event)">{{index}}</div>
        </div>
    </vi-popup>
  </div>
</template>

<script>
import stopPropagationScroll from '@/common/directive/stop-propagation-scroll.js'

export default {
  name: 'scroll-popup',
  directives: {
    stopPropagationScroll
  },
  data() {
    return {
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      popupList: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      isShowPopup: true
    }
  },
  methods: {
    clickHandler() {
      // this.$router.push('/test/wechat-popup')
      this.$refs.popup.show()
    },
    maskClick() {
      this.isShowPopup = false
    },
    scrollHandler() {
      // console.log(66)
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-height
  width: 100%
  height: 100vh
  overflow: scroll
  -webkit-overflow-scrolling: touch
  :global
    .box
      height: 80px
      margin-bottom: 20px
      background: peru
      font-size: 30px
      color: #fff
      line-height: 80px
      text-align: center
    .popup-content
      height: 500px
      background: #5698cc
      overflow: scroll
      -webkit-overflow-scrolling: touch
      .inner-box
        width: 300px
        height: 80px
        margin-bottom: 20px
        background: #fe3399
        font-size: 30px
        color: #fff
        line-height: 80px
        text-align: center
</style>

<template>
  <div :class="$style['scroll-height']">
    <div class="box"
      v-for="(item, index) in list"
      :key="index"
      @click="clickHandler">{{index}}</div>
    <vi-popup
      ref="popup"
      class="popup"
      @mask-click="maskClick">
        <div class="popup-content"
          @touchstart="touchstartHandler($event)"
          @touchmove.stop="touchmoveHandler($event)">
          <div class="inner-box"
            v-for="(item, index) in list"
            :key="index"
            @click="clickHandler($event)">{{index}}</div>
        </div>
    </vi-popup>
  </div>
</template>

<script>
export default {
  name: 'scroll-popup',
  data() {
    return {
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    clickHandler() {
      // this.$router.push('/test/wechat-popup')
      this.$refs.popup.show()
    },
    maskClick() {

    },
    touchstartHandler(e) {
      this.startY = e.changedTouches[0].pageY
    },
    touchmoveHandler(e) {
      this.moveY = e.changedTouches[0].pageY
      let disY = this.moveY - this.startY
      // currentTarget是最开始绑定事件的元素,如果是原生的写法,就是this
      let currentTarget = e.currentTarget
      let scrollTop = e.currentTarget.scrollTop
      let scrollHeight = e.currentTarget.scrollHeight
      let clientHeight = e.currentTarget.clientHeight
      if (!scrollTop && disY >= 0) {
        e.preventDefault()
      } else if (scrollHeight - clientHeight <= scrollTop && disY <= 0) {
        e.preventDefault()
      }
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-height
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

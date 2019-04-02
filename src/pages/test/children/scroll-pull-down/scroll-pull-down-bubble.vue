<template>
  <div class="scroll-pull-down-bubble">
    <div class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :options="options"
        @pulling-down="onPullingDown">
        <div class="scroll-content">
          <div class="item"
            v-for="(item, index) in list" :key="index">{{item}}</div>
        </div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import Bubble from './components/bubble/bubble'

export default {
  components: {
    Bubble,
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      options: {
        probeType: 3,
        click: true,
        pullDownRefresh: {
          // 阀值
          threshold: 80,
          // 滞留的位置
          stop: 60,
          txt: '更新成功了',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 2000
        },
        directionLockThreshold: 0,
      }
    }
  },
  mounted() {
  },
  methods: {
    onPullingDown() {
      window.setTimeout(() => {
        // this.$refs.scroll.deblocking()
        // window.setTimeout(() => {
        //   this.$refs.scroll.closePullDown()
        // }, 3000)
      }, 2000)
    }
  }
}
</script>

<style lang="stylus" modules>
.scroll-pull-down-bubble
  height: 100vh
  background: #f4f4f4
  .scroll-wrapper
    height: 100%
    position: relative
    .pull-down-content
      position: absolute
      left: 0
      right: 0
      z-index: -1
      .pull-down-normal
        box-sizing: content-box
        height: 52px
        padding-top: 8px
    .scroll-content
      background: #ccc
      .item
        line-height: 50px
        font-size: 18px
        text-align: center
        height: 50px
        background: peru
        margin-bottom: 20px
        &:last-child
          margin-bottom: 0
</style>

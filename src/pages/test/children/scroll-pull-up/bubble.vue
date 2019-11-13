<template>
  <div :class="$style['bubble']">
    <div class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-down="pullingDownHandler">
        <div class="scroll-content">
          <ul class="list">
            <li class="item" v-for="(item, index) in list" :key="index">{{item}}</li>
          </ul>
        </div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      options: {
        probeType: 3,
        click: true,
        scrollbar: true,
        pullDownRefresh: {
          // 阀值
          threshold: 80,
          // 滞留的位置
          stop: 50,
          txt: '更新成功了',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 2000
        },
        directionLockThreshold: 0,
      },
    }
  },
  mounted() {
    // this.$refs.scroll.autoPullDownRefresh()
  },
  methods: {
    pullingDownHandler() {
      window.setTimeout(() => {
        this.$refs.scroll.deblocking()
        window.setTimeout(() => {
          this.$refs.scroll.closePullDownRefresh()
        }, 3000)
      }, 2000)
    },
  }
}
</script>

<style lang="stylus" module>
.bubble
  height: 100vh
  background: #f4f4f4
  :global
    .scroll-wrapper
      height: 100%
      position: relative
</style>

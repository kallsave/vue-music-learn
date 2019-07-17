<template>
  <div :class="$style['scroll-pull-down']">
    <div class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :options="options"
        @pulling-down="onPullingDown">
        <template slot="pull-down" slot-scope="props">
          <div class="pull-down-normal"
            v-show="props.pullDownState == 'normal'"
            :style="{paddingTop: props.pullDownNormalTop + 'px'}">
            <span :class="{rotate: props.pullDownNormalTop > 0}">↓</span>
          </div>
          <div class="pull-down-lock"
            v-show="props.pullDownState == 'locking'">
            <vi-loading :scale="0.8"></vi-loading>
          </div>
          <transition name="finish">
            <div class="pull-down-finish"
              v-show="props.pullDownState == 'finish'">
              <span class="refresh-text">今日头条推荐引擎有x条更新</span>
            </div>
          </transition>
        </template>
        <div class="scroll-content">
          <div class="item" v-for="(item, index) in list" :key="index">{{item}}</div>
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
        pullDownRefresh: {
          // 阀值
          threshold: 80,
          // 滞留的位置
          stop: 56,
          txt: '更新成功了',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 2000
        },
        directionLockThreshold: 0,
      }
    }
  },
  mounted() {
    this.$refs.scroll.autoPullDownRefresh()
  },
  methods: {
    onPullingDown() {
      window.setTimeout(() => {
        this.$refs.scroll.deblocking()
        // window.setTimeout(() => {
        //   this.$refs.scroll.closePullDown()
        // }, 3000)
      }, 2000)
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-pull-down
  height: 100vh
  background: #f4f4f4
  :global
    .scroll-wrapper
      height: 100%
      position: relative
      color: red
      .pull-down-normal
        font-size: 30px
        line-height: 40px
        height: 40px
        span
          display: inline-block
          line-height: 1
          transition: all 0.3s
          color: #666
          padding: 5px 0
          &.rotate
            transform: rotate(180deg)
      .pull-down-lock
        padding: 8px 0
      .pull-down-finish
        height: 40px
        margin: 0 auto
        line-height: 40px
        padding: 8px 0
        color: #498ec2
        background-color: #d6eaf8
        &.finish-enter
          width: 70%
        &.finish-enter-active
          transition: all .5s
        &.finish-enter-to
          width: 100%
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

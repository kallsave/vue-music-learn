<template>
  <div class="scroll-pull-down">
    <div class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :options="options"
        @pulling-down="onPullingDown">
        <template slot="pull-down" slot-scope="props">
          <div class="pull-down-content"
            :style="props.pullDownStyle">
            <div class="pull-down-normal"
              v-show="props.pullDownState == 'normal'"
              :style="{paddingTop: props.bubbleY + 'px'}">
              <span :class="{rotate: props.bubbleY > 0}">↓</span>
            </div>
            <div class="pull-down-lock"
              v-show="props.pullDownState == 'lock'">
              <vi-loading :scale="0.8"></vi-loading>
            </div>
            <transition name="success">
              <div class="pull-down-refresh"
                v-show="props.pullDownState == 'refresh'">
                <span class="refresh-text">今日头条推荐引擎有x条更新</span>
              </div>
            </transition>
          </div>
        </template>
        <div class="item"
          v-for="(item, index) in list" :key="index">{{item}}</div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import Bubble from './components/vi-scroll-bubble.vue'
import loading from './components/vi-scroll-loading'

export default {
  components: {
    Bubble,
    loading
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
          stop: 50,
          txt: '更新成功',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 1000
        },
        directionLockThreshold: 0,
      }
    }
  },
  methods: {
    onPullingDown() {
      window.setTimeout(() => {
        this.$refs.scroll.forceUpdate()
      }, 3000)
    }
  }
}
</script>

<style lang="stylus" scoped>
.scroll-pull-down
  height: 100vh
  .scroll-wrapper
    height: 100%
    position: relative
    .pull-down-content
      position: absolute
      left: 0
      right: 0
      z-index: -1
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
        padding: 2px 0
        margin: 0
      .pull-down-refresh
        margin: 0 auto
        height: 40px
        line-height: 40px
        padding: 5px 0
        color: #498ec2
        background-color: #d6eaf8
        &.success-enter
          width: 70%
        &.success-enter-active
          transition: width .5s
        &.success-enter-to
          width: 100%
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

<template>
  <div class="scroll-pull-down">
    <div class="scroll-wrapper">
      <vi-scroll
        :options="options">
        <template slot="pull-down" slot-scope="scope">
          <div class="gold">{{scope.txt}}</div>
        </template>
        <div class="item"
          v-for="(item, index) in list" :key="index">{{item}}</div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import Bubble from './components/bubble/bubble'

export default {
  components: {
    Bubble
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
          txt: '更新成功',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 1000
        },
        directionLockThreshold: 0,
      }
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
    .gold
      top: 0
      position: absolute
      width: 100%
      height: 50px
      background: gold
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

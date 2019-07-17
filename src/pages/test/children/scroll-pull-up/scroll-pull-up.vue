<template>
  <div :class="$style['scroll-pull-up']">
    <div class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-down="pullingDownHandler"
        @pulling-up="pullingUpHandler">
        <template slot="pull-down" slot-scope="props">
          :style="props.pullDownStyle">
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
          <ul class="list">
            <li class="item" v-for="(item, index) in list" :key="index">{{item}}</li>
          </ul>
          <div class="no-more" v-if="noMore">没有更多的内容了</div>
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
        // pullDownRefresh: false,
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
        pullUpLoad: {
          // 距离底部threshold触发下拉加载事件
          threshold: -50,
          txt: {
            more: '上拉加载更多',
            // 不传则底部不会有空白
            noMore: '没有更多啦'
          }
        }
      },
      number: 0,
      noMore: false
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
    pullingUpHandler() {
      window.setTimeout(() => {
        this.number++
        if (this.number < 3) {
          this.list = this.list.concat([16, 17, 18])
        } else {
          this.$refs.scroll.deblocking({
            // isClosePullUpLoad: true,
            isPullUpNoMore: true
          })
        }
      }, 4000)
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-pull-up
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
        padding: 5px 0
        color: #498ec2
        background-color: #d6eaf8
        &.finish-enter
          width: 70%
        &.finish-enter-active
          transition: all .5s
        &.finish-enter-to
          width: 100%
      .scroll-content
        .list
          background: #ccc
          .item
            line-height: 50px
            height: 50px
            font-size: 18px
            text-align: center
            background: peru
            margin-bottom: 20px
            &:last-of-type
              margin-bottom: 0
        .no-more
          line-height: 50px
          height: 50px
          font-size: 18px
          text-align: center
          background: #f4f4f4
</style>

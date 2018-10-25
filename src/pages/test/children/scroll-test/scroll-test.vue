<template>
  <div class="scroll-test">
    <div class="header">
      <div class="title">scroll</div>
    </div>
    <http>
      <div>ssdwww.baidu.comjj</div>
    </http>
    <div class="match-list">
      <vi-sticky
        ref="scroll"
        :data="matchList"
        :options="options"
        :scroll-events="['scroll', 'scroll-end', 'before-scroll-start']"
        @pulling-down="onPullDown"
        @pulling-up="onPullingUp">
        <ul class="match-inner">
          <li class="match-item" v-for="(item, index) in matchList" :key="index">
            <div class="left-team">
              <img v-lazy="item.hostLogoUrl" alt="" class="logo">
              <p class="name">{{item.hostTeamName}}</p>
            </div>
            <div class="center">
              <p v-if="item.live" class="guest" :class="{end : item.isEnd}">{{item.live}}</p>
              <p v-if="item.order" class="order" @click="subscribe">{{item.order}}</p>
              <p class="score" :class="{last: item.isEnd}">{{item.hostScore}} - {{item.guestScore}}</p>
              <p v-if="!item.isEnd" class="time">{{item.endTime}}</p>
            </div>
            <div class="right-team">
              <img v-lazy="item.guestLogoUrl" class="logo">
              <p class="name">{{item.guestTeamName}}</p>
            </div>
          </li>
        </ul>
      </vi-sticky>
    </div>
  </div>
</template>

<script>
import matchList from '@/common/data/match-list'
import Http from '@/uikit/components/vi-href/vi-href.vue'

const SOURCE = 'soccer'

const TYPE = 'ended'

const UP = 'up'
const DOWN = 'down'

const typesMap = {
  ended: 0,
  live: 1,
  concern: 2
}

const getMatchList = (list, source, type) => {
  return list[source][typesMap[type]]
}

export default {
  components: {
    Http,
  },
  data() {
    return {
      matchList: getMatchList(matchList, SOURCE, TYPE),
      options: {
        // 上拉刷新
        pullDownRefresh: {
          // 阀值
          // 上面空白局域的高度达到阀值会触发拉动
          threshold: 90,
          // 触发拉动后回弹到空白区域50px的位置
          stop: 50,
          txt: '刷新成功'
        },
        // 下拉加载
        pullUpLoad: {
          threshold: 100,
          txt: {
            more: '加载更多',
            // 不传则底部不会有空白
            noMore: '没有更多的比赛啦'
          }
        },
        probyType: 3
      },
      // 新数据有限,只能拉三次
      matchListRefreshCount: 4,
    }
  },
  created() {
  },
  methods: {
    onPullDown() {
      this.loadMatch('down')
    },
    onPullingUp() {
      this.loadMatch('up')
    },
    loadMatch(type) {
      this.matchListRefreshCount--
      // 假数据
      setTimeout(() => {
        if (this.matchListRefreshCount > 0) {
          // 有新数据的情况
          let match = []
          for (let index = 5; index > 0; index--) {
            match.push(this.matchList[index])
          }
          // 如果是下拉刷新
          if (type === DOWN) {
            this.matchList.unshift(...match)
          } else if (type === UP) {
            this.matchList = this.matchList.concat(match)
          }
        } else {
          // data没更新,要手动恢复到正常状态
          this.$refs.scroll.forceUpdate()
          // 如果是下拉刷新,关闭下拉刷新功能
          if (type === UP) {
            this.$nextTick(() => {
              this.options.pullUpLoad = false
            })
          }
        }
      }, 500)
    }
  }
}
</script>

<style lang="stylus">
.scroll-test
  height: 100%
  text-align: center
  .header
    color: white
    background-color: #15191D
    height: 56px
    overflow: hidden
    .title
      padding: 20px 0
      font-size: 16px
      color: white
      display: inline-block
  .match-list
    height: calc(100vh - 56px)
    background-color: #E2E5EA
    // color一直继承给上下拉组件的laoding和no-more
    color: peru
    .match-inner
      background-color: #FFFFFF
      .match-item
        border-bottom: 1px solid #E4E4E4
        padding: 10px 0
        display: flex
        justify-content: space-around
        .left-team,.right-team
          text-align: center
          width: 80px
          img
            display: inline-block
            height: 38px
            margin-bottom: 7px
          .name
            font-size: 14px
        .center
          font-size: 12px
          width: 80px
          .guest
            height: 16px
            background-color: #3D8F29
            color: white
            line-height: 16px
            padding: 3px 10px
            border-radius: 25px
            margin-bottom: 7px
          .order
            border:1px #007100 solid
            color: #49873D
            border-radius: 25px
            line-height: 16px
            padding: 3px 20px
            margin-bottom: 7px
          .end
            background-color: #E86F5D
          .score
            font-size: 14px
            font-weight: 500
            margin-bottom: 7px
            position: relative
            .order
              display: inline-block
              border-radius: 25px
              border:1px #2F6220 solid
              padding: 3px 20px
              font-size: 100%
              position: absolute
              right: -100px
              transform: translateY(-50%)
          .last
            font-size: 22px
            margin-top: 5px
            color: #878F98
          .time
            color: #92929A
</style>

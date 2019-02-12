<template>
  <div class="recommend sticky-content" ref="recommend">
    <div ref="scrollWrapper" class="scroll-wrapper">
      <vi-loading ref="loading"
        v-model="isShowLoading"
        :scale="1"></vi-loading>
      <vi-scroll
        ref="scroll"
        style="color: #ffcd32"
        :options="scrollOptions"
        :data="discList"
        :scrollEvents="['scroll']"
        @scroll="scrollHandler"
        @pulling-down="onPullingDown">
        <div class="slide-wrapper">
          <vi-slide ref="slide"
            v-if="recommends.length"
            :init-page-index="2"
            :data="recommends"
            :options="slideOptions"
            :show-dots="true"
            :auto-play="false"
            @load-image="loadImage">
            <!-- slide最常用的场景中，每个轮播页是一个可跳转链接的图片 -->
            <!-- 同时使用slot也可以支持自定义样式 -->
            <template slot="dots" slot-scope="scope">
              <div class="slide-dots">
                <span class="slide-dot"
                  :class="{active: scope.currentPageIndex === index }"
                  v-for="(item, index) in recommends" :key="index"
                  @click.stop="scope.goToPage(index)"></span>
              </div>
            </template>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
            <!-- <vi-slide-item  v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </vi-slide-item> -->
          </vi-slide>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul class="recommend-ul">
            <li class="item" @click="selectItem($event, item)"
              v-for="item in discList" :key="item.dissname">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME, NO_KEEP_ALIVE_NAME } from '@/common/config/keep-alive-name.js'
import { getRecommend, getDiscList } from '@/api/recommend.js'
import { playListMixin } from '@/common/mixins/player.js'
import { mapMutations } from 'vuex'
import { injectStickyMixin } from '../../mixins/inject-sticky.js'
import createThrottleInstanceMixin from '../../mixins/create-throttle-instance.js'

export default {
  // 可变keep-alive
  name: MUTABLE_KEEP_ALIVE_NAME,
  mixins: [injectStickyMixin, playListMixin, createThrottleInstanceMixin],
  data() {
    return {
      recommends: [],
      discList: [],
      scrollOptions: {
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
      },
      slideOptions: {
        probeType: 1,
        click: true,
        snap: {
          loop: true,
          threshold: 0.5
        },
        eventPassthrough: 'vertical',
      },
      isShowLoading: false
    }
  },
  mounted() {
    this._getData()

    // this.$refs.loading.show()

    // setTimeout(() => {
    //   this.$refs.loading.hide()
    // }, 2000)

    // this.$createViToast({
    //   icon: 'svg-correct'
    // }).show()
  },
  methods: {
    ...mapMutations({
      setRecommendAlbum: 'SET_RECOMMEND_ALBUM',
    }),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${this.playerHeight}px`
      this.$refs.scroll.refresh()
    },
    _getData(forceUpdate) {
      Promise.all([this._getRecommend(forceUpdate), this._getDiscList(forceUpdate)]).then((res) => {
        // 两个接口都拿到数据的操作
        // promise在组件销毁后还是会执行的
      })
    },
    _getRecommend(forceUpdate) {
      return getRecommend().then((res) => {
        this.recommends = res.data.slider
      })
    },
    _getDiscList(forceUpdate) {
      return new Promise((resolve, reject) => {
        getDiscList().then((res) => {
          setTimeout(() => {
            this.discList = res.data.list
            resolve(res)
          }, 1000)
        })
      })
    },
    loadImage() {
      // 图片是异步撑开的,所以要@load监听第一张图片的下载
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    lazyComponentShow() {
      // console.log('handler')
    },
    selectItem(e, item) {
      this.throttle.run(() => {
        this.setRecommendAlbum(item)
        // this.$router.push({
        //   path: `/music/recommend-detail/${item.dissid}`
        // })
        this.$router.push({
          path: `/new-music/recommend-detail/${item.dissid}`
        })
      })
    },
    onPullingDown() {
      this._getData(true)
    },
  },
  destroyed() {

  }
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/variable.styl"

.recommend
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  background: $color-background
  // position: relative
  .scroll-wrapper
    box-sizing: border-box
    width: 100%
    height: calc(100vh - 44px)
    // position: absolute
    // top: 88px
    // bottom: 0
    .slide-wrapper
      overflow: hidden
      .slide-item
        box-sizing: border-box
        float: left
        overflow: hidden
        text-align: center
        a
          display: block
          overflow: hidden
          text-decoration: none
          img
            // 让img的空白像素去掉
            display: block
            // img width100%会穿透宽度自适应的div(比如float)而得到一个宽度
            // 上层的float不设置宽度会得到img的宽度
            // 然后width生效后得到一个height,又会把上层的float的高度生效
            // 所以slide-wrapper的高度应该由img撑起来的
            width: 100%
      .slide-dots
        position: absolute
        right: 30px
        bottom: 12px
        text-align: center
        font-size: 0
        .slide-dot
          display: inline-block
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            border-radius: 5px
            background: $color-theme
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .recommend-ul
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            padding-right: 20px
          .text
            position: relative
            display: flex
            flex-direction: column
            // 轴上元素的位置,column方向设置上下
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            height: 60px
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
            .load-list-con
              position: absolute
              bottom: 10px
              width: 100%
              box-sizing: border-box
              &:before,&:after
                height: 15px
                background: $color-highlight-background
                content: ''
                display: block
              &:before
                margin-top: 7px
                width: 30%
              &:after
                margin-top: 12px
                width: 60%

</style>

<template>
  <div class="recommend sticky-content" ref="recommend">
    <div ref="scrollWrapper" class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        :scroll-events="['scroll']"
        :options="scrollOptions"
        :data="discList"
        @scroll="scrollHandler">
        <vi-loading
          ref="allLoading"
          :scale="0.8"
          :title-color="'#ffcd32'"
          :icon-color="'#ffcd32'"></vi-loading>
        <div class="slide-wrapper">
          <vi-slide ref="slide"
            :init-page-index="currentPageIndex"
            :data="recommends"
            :loop="true"
            :show-dots="true"
            :auto-play="true"
            @scroll-end="scrollEnd"
            @load-image="loadImage">
            <!-- slide是一个功能型组件 -->
            <!-- 最常用的场景中，每个轮播页是一个可跳转链接的图片 -->
            <!-- 同时使用slot也可以支持自定义样式 -->
            <!-- 使用slot,样式写在当前组件 -->
            <template slot="dots">
              <div class="slide-dots">
                <span class="slide-dot" :key="index"
                  v-for="(item, index) in recommends"
                  :class="{active: currentPageIndex === index }"></span>
              </div>
            </template>
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
                <lazy-component @show="lazyComponentShow">
                  <template slot="default">
                    <h2 class="name" v-html="item.creator.name"></h2>
                    <p class="desc" v-html="item.dissname"></p>
                  </template>
                  <template slot="loading">
                    <vi-load-list-con>
                      <div class="load-list-con"></div>
                    </vi-load-list-con>
                  </template>
                </lazy-component>
              </div>
            </li>
          </ul>
        </div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend.js'
import { playListMixin } from '@/common/mixins/player.js'
import { mapMutations } from 'vuex'
import { sticky } from '../../mixins/inject-sticky.js'
import { setTimeout } from 'timers'

export default {
  // keep-alive用
  // keep-alive可以是暂时的,用vuex设置时间点,让exclude改变,然后马上有生效
  name: 'no-keep-alive',
  mixins: [sticky, playListMixin],
  data() {
    return {
      recommends: [],
      currentPageIndex: 2,
      discList: [],
      loadingPic: require('@/assets/images/loading.png'),
      scrollOptions: {
        probeType: 3,
        click: true
      }
    }
  },
  mounted() {
    this._getData()
  },
  methods: {
    ...mapMutations({
      setRecommendAlbum: 'SET_RECOMMEND_ALBUM'
    }),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${60}px`
      this.$refs.scroll.refresh()
    },
    _getData() {
      this.$refs.allLoading.show()
      Promise.all([this._getRecommend(), this._getDiscList()]).then((res) => {
        // 两个接口都拿到数据的操作
        // promise在组件销毁后还是会执行的
        this.$refs.allLoading && this.$refs.allLoading.hide().then(() => {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        })
      })
    },
    _getRecommend() {
      return getRecommend().then((res) => {
        this.recommends = res.data.slider
      })
    },
    _getDiscList() {
      return new Promise((resolve, reject) => {
        getDiscList().then((res) => {
          this.discList = res.data.list
          resolve(res)
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
    scrollEnd(pageIndex) {
      this.currentPageIndex = pageIndex
    },
    lazyComponentShow() {
      // console.log('handler')
    },
    selectItem(e, item) {
      if (!e._constructed) {
        return
      }
      // 先跳转后设置vuex
      this.$router.push({
        path: `/music/recommend-detail/${item.dissid}`
      })
      this.setRecommendAlbum(item)
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"

.recommend
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  .scroll-wrapper
    box-sizing: border-box
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
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

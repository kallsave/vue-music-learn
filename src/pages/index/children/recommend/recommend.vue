<template>
  <div ref="recommend"
    :class="$style['recommend']">
    <div ref="scrollWrapper"
      class="scroll-wrapper">
      <vi-scroll
        ref="scroll"
        style="color: gold;"
        :options="scrollOptions"
        :data="discList"
        :scrollEvents="['scroll']"
        @scroll="scrollHandler"
        @pulling-down="onPullingDown">
        <div class="slide-wrapper">
          <vi-slide
            ref="slide"
            :init-page-index="0"
            :data="recommendList"
            :options="slideOptions"
            :show-dots="true"
            :auto-play="true"
            @load-image="loadImage">
          </vi-slide>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <vi-swipe-group>
            <vi-collapse-transition-group
              class="recommend-ul"
              tag="ul">
              <li class="item"
                v-for="(item, index) in discList"
                :key="item.dissname"
                @click="selectItem($event, item)">
                <vi-swipe
                  :index="index"
                  :menu-list="menuList"
                  @menu-click="menuClick"
                  @confirm="confirmDelete">
                  <div class="item-wrapper">
                    <div class="icon">
                      <img width="60" height="60" v-lazy="item.imgurl">
                    </div>
                    <div class="text">
                      <h2 class="name" v-html="item.creator.name"></h2>
                      <p class="desc" v-html="item.dissname"></p>
                    </div>
                  </div>
                </vi-swipe>
              </li>
            </vi-collapse-transition-group>
          </vi-swipe-group>
        </div>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend.js'
import playerPaddingBottom from '@/common/mixins/play-padding-bottom.js'
import { mapMutations } from 'vuex'
import { injectSticky } from '../../mixins/inject-sticky.js'
import createThrottleInstance from '@/common/mixins/create-throttle-instance.js'

export default {
  mixins: [
    injectSticky,
    playerPaddingBottom,
    createThrottleInstance,
  ],
  data() {
    return {
      recommendList: [],
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
          stopTime: 1500
        },
        directionLockThreshold: 0,
      },
      slideOptions: {
        probeType: 1,
        click: true,
        snap: {
          threshold: 0.5,
          loop: true,
        },
      },
      menuList: [
        {
          content: '取消',
          style: {
            'background-color': '#c8c7cd',
            'color': '#fff'
          }
        },
        {
          content: '收藏',
          style: {
            'background-color': '#ffcd32',
            'color': '#fff'
          }
        }
      ]
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.scroll.autoPullDownRefresh()
    // })
    this._getData()
  },
  methods: {
    ...mapMutations({
      setRecommendAlbum: 'SET_RECOMMEND_ALBUM',
    }),
    handlePlayList() {
      this.$refs.scrollWrapper.style.paddingBottom = `${this.playerHeight}px`
      this.$refs.scroll.refresh()
    },
    _getData() {
      Promise.race([this._getRecommend(), this._getDiscList()]).then((res) => {})
    },
    _getRecommend() {
      return getRecommend().then((res) => {
        this.recommendList = res.focus.data.content.map((item) => {
          return {
            linkUrl: item.jump_info.url,
            picUrl: item.pic_info.url,
          }
        })
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
    },
    _getDiscList() {
      return getDiscList().then((res) => {
        window.setTimeout(() => {
          this.discList = res.data.list
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }, 1000)
      })
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$nextTick(() => {
          if (this.hadLoad) {
            return
          }
          this.hadLoad = true
          this.$refs.scroll.refresh()
        })
      }
    },
    selectItem(e, item) {
      this.throttle.run(() => {
        this.setRecommendAlbum(item)
        this.$router.push({
          name: 'DetailRecommend',
          params: {
            id: item.dissid
          }
        })
      })
    },
    onPullingDown() {
      this._getData()
    },
    menuClick(menu, index, shrink, toggleConfirmMenu) {
      if (menu.content === '取消') {
        shrink()
      } else {
        toggleConfirmMenu(true)
      }
    },
    confirmDelete(index) {
      this.discList.splice(index, 1)
    },
  },
}
</script>

<style lang="stylus" module>
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"

.recommend
  width: 100%
  height: calc(100vh - 44px)
  overflow: hidden
  :global
    .scroll-wrapper
      box-sizing: border-box
      width: 100%
      height: 100%
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
        background: $color-background
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .recommend-ul
          .item
            box-sizing: border-box
            margin: 0 0 20px 20px
            .item-wrapper
              display: flex
              align-items: center
              padding-right: 20px
              box-sizing: border-box
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
                    content: ""
                    display: block
                  &:before
                    margin-top: 7px
                    width: 30%
                  &:after
                    margin-top: 12px
                    width: 60%
</style>

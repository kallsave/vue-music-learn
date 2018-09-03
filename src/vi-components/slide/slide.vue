 <!-- slide外围必须有一个父元素,因为slide的高度是由外围父元素决定的 -->
<template>
  <div class="vi-slide-wrapper" ref="slide">
    <div class="vi-slide-group" ref="slideGroup">
      <slot>
        <!-- 默认的场景 -->
        <!-- 进来的数据要对好格式 -->
        <div v-for="item in data" :key="item.linkUrl">
          <a :href="item.linkUrl">
            <img @load="loadImage" :src="item.picUrl" />
          </a>
        </div>
      </slot>
    </div>
    <!-- 默认的dots样式 -->
    <template v-if="showDots">
      <slot name="dots">
        <div class="vi-slide-dots">
          <span class="vi-slide-dot" :key="index"
            v-for="(item, index) in dots"
            :class="{active: currentPageIndex === index }"
            @click="_slideToPage(index)"></span>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
import { addClass } from '@/common/helpers/dom'
import BScroll from 'better-scroll'

const COMPONENT_NAME = 'vi-slide'

const EVENT_SCROLL_END = 'scroll-end'
const EVENT_LOAD_IMAGE = 'load-image'

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    loop: {
      type: Boolean,
      default: false
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 4000
    },
    showDots: {
      type: Boolean,
      default: false
    },
    initPageIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: this.initPageIndex
    }
  },
  mounted() {
    // 封装vi组件请不要使用setTimeout20,
    // 这会造成父组件$nextTick拿不到slide滚动条
    this.$nextTick(() => {
      this.setSlideWidth()
      this._initDots()
      this._initslide()
      if (this.autoPlay) {
        this._play()
      }
      window.addEventListener('resize', this._resizeHandler)
    })
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.setSlideWidth()
      })
    },
  },
  methods: {
    // slide的content盒子的宽度是要用js计算的,和scroll不一样
    // 并且如果loop了,那么会创建两个缓冲div
    setSlideWidth(isResize) {
      let width = 0
      let slideWidth = this.$refs.slide.clientWidth
      this.children = this.$refs.slideGroup.children
      Array.apply(null, this.children).forEach((item) => {
        addClass(item, 'vi-slide-item')
        // item本来的width是靠img撑开的,现在要固定,这样img就依赖了固定高度
        item.style.width = slideWidth + 'px'
        width += slideWidth
      })

      if (this.loop && !isResize) {
        // 如果需要loop无缝滚动功能,还有两个缓冲div
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _initslide() {
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // slide的设置
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
      })

      this.slide.goToPage(this.initPageIndex, 0, 0)

      this.slide.on('scrollEnd', () => {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        this.$emit(EVENT_SCROLL_END, pageIndex)
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      // dots是原始的children.length,如果是loop=true
      // _initDots方法要在_initslide之前
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      this.timer = setTimeout(() => {
        this.slide.next(500)
      }, this.interval)
    },
    _resizeHandler() {
      if (!this.slide) {
        return
      }
      // 已经创造过两个div了,不需要再创造
      this.setSlideWidth(true)
      this.slide.refresh()
    },
    _slideToPage(index) {
      this.slide.goToPage(index, 0, 400)
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$emit(EVENT_LOAD_IMAGE)
      }
    }
  }
}
</script>

<style lang="stylus">
// 基础组件不应该用scoped,加前缀标识
// 基础组件的样式最好不依赖reset的样式,保持通用性
@import "~@/common/stylus/variable"
// 考虑到vi-slide-wrapper不仅仅是做轮播图那么简单的功能
// 还有整个页面的slide动作,height是100%外围父元素
.vi-slide-wrapper
  min-height: 1px
  position: relative
  height: 100%
  .vi-slide-group
    position: relative
    overflow: hidden
    height: 100%
    // white-space: nowrap
    .vi-slide-item
      float: left
      // box-sizing: border-box
      // overflow: hidden
      // text-align: center
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

  .vi-slide-dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .vi-slide-dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      cursor: pointer
      &.active
        width: 20px
        border-radius: 5px
        background: $color-theme

</style>

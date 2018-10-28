 <!-- slide外围必须有一个父元素,因为slide的高度是由外围父元素决定的 -->
<template>
  <div ref="slide" class="vi-slide-wrapper"
    :style="setStyle">
    <div ref="slideGroup" class="vi-slide-group">
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
            @click="slideToPage(index)"></span>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
import { addClass } from '../../common/helpers/dom.js'
import { camelize, assignArray, spliceArray } from '../../common/helpers/utils.js'
import BScroll from 'better-scroll'

const COMPONENT_NAME = 'vi-slide'

const EVENT_SCROLL = 'scroll'
const EVENT_SCROLL_END = 'scroll-end'

const EVENT_CHANGE = 'change'
const EVENT_LOAD_IMAGE = 'load-image'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_SCROLL_END]

const BIND_SCROLL_EVENTS = [EVENT_SCROLL_END]

const DEFAULT_OPTIONS = {
  // 多层嵌套会触发多次,所以需要click的场景自主添加
  probeType: 3,
  scrollbar: false,
  scrollX: true,
  scrollY: true,
  momentum: false,
  // slide的设置
  snap: {
    loop: false,
    threshold: 0.3,
    speed: 400
  }
}

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {
          snap: {
            loop: false,
          }
        }
      }
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
    },
    setStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    scrollEvents: {
      type: Array,
      default() {
        return []
      },
      validator(arr) {
        return arr.every((item) => {
          return SCROLL_EVENTS.indexOf(item) !== -1
        })
      }
    },
  },
  data() {
    return {
      dots: [],
      currentPageIndex: this.initPageIndex
    }
  },
  computed: {
    loop() {
      let options = Object.assign({}, DEFAULT_OPTIONS, this.options)
      return options.snap.loop
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this._destroy()
          this.setSlideWidth()
          this._initDots()
          this._initSlide()
        })
        if (this.autoPlay) {
          this._play()
        }
        if (!this.isListenResize) {
          this.isListenResize = true
          window.addEventListener('resize', this._resizeHandler, false)
        }
      },
      deep: true,
      immediate: true
    },
  },
  created() {
  },
  methods: {
    // slide的content盒子的宽度是要用js计算
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

      if (this.loop && !isResize && this.children.length > 1) {
        // 如果需要loop无缝滚动功能,还有两个缓冲div
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _listenScrollEvents() {
      const finalScrollEvents = spliceArray(this.scrollEvents, BIND_SCROLL_EVENTS)
      console.log(finalScrollEvents)
      finalScrollEvents.forEach((event) => {
        this.slide.on(camelize(event), (...args) => {
          this.$emit(event, ...args, this.slide)
        })
      })
    },
    _initSlide() {
      let options = Object.assign({}, DEFAULT_OPTIONS, this.options)
      this.slide = new BScroll(this.$refs.slide, options)
      this.slide.goToPage(this.initPageIndex, 0, 0)

      this.slide.on(camelize(EVENT_SCROLL_END), () => {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.$emit(EVENT_SCROLL_END, pageIndex)
        if (this.currentPageIndex !== pageIndex) {
          this.currentPageIndex = pageIndex
          this.$emit(EVENT_CHANGE, pageIndex)
        }
        if (this.autoPlay) {
          this._play()
        }
      })

      this._listenScrollEvents()
    },
    _initDots() {
      this.dots = new Array(this.$refs.slideGroup.children.length)
    },
    _play() {
      clearTimeout(this.timer)
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
    slideToPage(index) {
      this.slide.goToPage(index, 0, 400)
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$emit(EVENT_LOAD_IMAGE)
      }
    },
    _destroy() {
      this.slide && this.slide.destroy()
      this.slide = null
    },
    destroyed() {
      this._destroy()
      window.removeEventListener('resize', this._resizeHandler, false)
    },
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"
// 考虑到vi-slide-wrapper不仅仅是做轮播图那么简单的功能
// 还有整个页面的slide动作,height是100%外围父元素
.vi-slide-wrapper
  position: relative
  height: 100%
  .vi-slide-group
    position: relative
    overflow: hidden
    height: 100%
    white-space: nowrap
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

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
            @click.stop="slideToPage(index)"></span>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
// TODO: slot支持slideToPage
import { addClass } from '../../common/helpers/dom.js'
import { camelize, spliceArray, mulitDeepClone } from '../../common/helpers/utils.js'
import BScroll from 'better-scroll'

const COMPONENT_NAME = 'vi-slide'

// better-scroll原始的事件(不推荐在父组件中使用,会存在嵌套事件触发多次的,主动触发的问题)
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'
const EVENT_TOUCH_END = 'touch-end'
// 需要传scrollEvents = ['scroll-start']
const EVENT_SCROLL_START = 'scroll-start'
// 需要传scrollEvents = ['scroll']
const EVENT_SCROLL = 'scroll'
// 需要传scrollEvents = ['scroll-cancel']
const EVENT_SCROLL_CANCEL = 'scroll-cancel'

// better-scroll原始的scrollEvents事件集合
const SCROLL_EVENTS = [
  EVENT_BEFORE_SCROLL_START,
  EVENT_SCROLL_END,
  EVENT_TOUCH_END,
  EVENT_SCROLL,
  EVENT_SCROLL_START
]

// before-scroll-start,scroll-end,touch-end事件是必须监听的
// before-scroll-start只会在touchstart触发(主动触发的标志)
// 并且考虑到slide如果外围有slide
// 需要before-scroll-start时disable外围所有的slide
// 在scroll-end时enable外围所有的slide
// scroll-end产生新的change事件判断处于哪一页
const BIND_SCROLL_EVENTS = [
  EVENT_SCROLL_END,
  EVENT_BEFORE_SCROLL_START,
  EVENT_TOUCH_END
]

// 派生出来的事件(推荐在父组件中使用)
const EVENT_CHANGE = 'change'
const EVENT_LOAD_IMAGE = 'load-image'
// 需要在scrollEvents传['scroll']
const EVENT_TOUCH_SCROLL = 'touch-scroll'

const DEFAULT_OPTIONS = {
  // 多层嵌套会触发多次,所以需要click的场景自主添加
  click: false,
  probeType: 1,
  scrollX: true,
  scrollY: false,
  momentum: false,
  // slide的设置
  snap: {
    loop: false,
    threshold: 0.3,
    speed: 400
  },
  useTransition: true,
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
          snap: {}
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
      currentPageIndex: this.initPageIndex,
    }
  },
  computed: {
    loop() {
      let options = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
      return options.snap.loop
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this._destroySlide()
          this.setSlideWidth()
          this._initDots()
          this._initSlide()
        })
      },
      deep: true
    },
  },
  mounted() {
    this.name = COMPONENT_NAME
    this.setSlideWidth()
    this._initDots()
    this._initSlide()
    if (this.autoPlay) {
      this._play()
    }
    if (!this.isListenResize) {
      this.isListenResize = true
      window.addEventListener('resize', this._resizeHandler, false)
    }
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
      this.slideWidth = width
      if (this.loop && !isResize && this.children.length > 1) {
        // 如果需要loop无缝滚动功能,还有两个缓冲div
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _listenScrollEvents() {
      const finalScrollEvents = spliceArray(this.scrollEvents, BIND_SCROLL_EVENTS)
      finalScrollEvents.forEach((event) => {
        if (event === EVENT_SCROLL) {
          this.slide.on(camelize(event), (...args) => {
            this.$emit(event, ...args)
            // slide存在loop: true自动轮播,
            // 导致外层的scroll,slide的监听到scroll事件发生
            // 有场景是需要主动触发的scroll
            if (this.touch) {
              this.$emit(EVENT_TOUCH_SCROLL, ...args)
            }
          })
        } else {
          this.slide.on(camelize(event), (...args) => {
            this.$emit(event, ...args)
          })
        }
      })
    },
    _initSlide() {
      let options = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
      // better-scroll会改变options的值(浅引用)
      this.slide = new BScroll(this.$refs.slide, options)

      // before-scroll-start其实是touch-start
      this.slide.on(camelize(EVENT_BEFORE_SCROLL_START), () => {
        this.touch = true
        this.toggleAbleParentSlide(this.$parent, false)
        this.$emit(EVENT_BEFORE_SCROLL_START)
      })

      // scroll-end
      // scroll-end在换页过程中至少会触发两次,因为有两页
      this.slide.on(camelize(EVENT_SCROLL_END), (...args) => {
        this.toggleAbleParentSlide(this.$parent, true)
        let pageIndex = this.slide.getCurrentPage().pageX
        this.$emit(EVENT_SCROLL_END, ...args)
        if (this.currentPageIndex !== pageIndex) {
          this.currentPageIndex = pageIndex
          this.$emit(EVENT_CHANGE, pageIndex)
        }
        if (this.autoPlay) {
          this._play()
        }
      })

      // touch-end
      this.slide.on(camelize(EVENT_TOUCH_END), () => {
        this.touch = false
        this.$emit(EVENT_TOUCH_END)
      })

      this.slide.goToPage(this.initPageIndex, 0, 0)

      this._listenScrollEvents()
    },
    _initDots() {
      this.dots = new Array(this.$refs.slideGroup.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slide && this.slide.next(500)
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
      clearTimeout(this.timer)
      this.slide.goToPage(index, 0, 400)
      this.currentPageIndex = index
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$emit(EVENT_LOAD_IMAGE)
      }
    },
    _destroySlide() {
      this.slide.destroy()
      this.slide = null
    },
    enableSlide() {
      this.slide && this.slide.enable()
    },
    disableSlide() {
      this.slide && this.slide.disable()
    },
    toggleAbleParentSlide(vNode, toggle) {
      if (vNode && vNode.enableSlide && vNode.disableSlide) {
        if (toggle) {
          vNode.enableSlide()
        } else {
          vNode.disableSlide()
        }
      } else if (vNode && vNode.$parent) {
        this.toggleAbleParentSlide(vNode.$parent, toggle)
      }
    },
    getSlideWidth() {
      return this.slideWidth
    }
  },
  destroyed() {
    this.timer = null
    this._destroySlide()
    window.removeEventListener('resize', this._resizeHandler, false)
  },
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"
// 考虑到vi-slide-wrapper不仅仅是做轮播图那么简单的功能
// 还有整个页面的slide动作,height是100%外围父元素
.vi-slide-wrapper
  position: relative
  height: 100%
  // 这个很重要,better-scroll会根据wrapper的高宽做判断
  min-height: 1px;
  .vi-slide-group
    position: relative
    overflow: hidden
    height: 100%
    white-space: nowrap
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

<template>
  <div ref="slide"
    class="vi-slide-wrapper"
    :style="setStyle">
    <div ref="slideGroup"
      class="vi-slide-group">
      <slot>
        <vi-slide-item
          v-for="(item, index) in data" :key="index"
          :item="item"
          @load-image=loadImage>
        </vi-slide-item>
      </slot>
    </div>
    <template v-if="showDots">
      <slot name="dots"
        :go-to-page="goToPage"
        :dots="dots"
        :current-page-index="currentPageIndex">
        <div class="vi-slide-dots">
          <span class="vi-slide-dot"
            v-for="(item, index) in dots" :key="index"
            :class="{active: currentPageIndex === index }"
            @click.stop="clickHandler($event, index)">
          </span>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
import { addClass } from '../../common/helpers/dom.js'
import { camelize, spliceArray, deepClone, Debounce } from '../../common/helpers/utils.js'
import BScroll from 'better-scroll'
import ViSlideItem from './vi-slide-item.vue'

const COMPONENT_NAME = 'vi-slide'

const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'
const EVENT_SCROLL_START = 'scroll-start'
const EVENT_SCROLL = 'scroll'

// better-scroll原始的scrollEvents事件集合
const SCROLL_EVENTS = [
  EVENT_BEFORE_SCROLL_START,
  EVENT_SCROLL_END,
  EVENT_SCROLL_START,
  EVENT_SCROLL,
]

const BIND_SCROLL_EVENTS = [
  EVENT_SCROLL_END,
  EVENT_BEFORE_SCROLL_START,
]

const EVENT_CHANGE_PAGE = 'change-page'
const EVENT_LOAD_IMAGE = 'load-image'
const EVENT_TOUCH_SCROLL = 'touch-scroll'

const SCROLL_STOP_TIME = 2500

const DEFAULT_OPTIONS = {
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
  // 不用transition而是requestAnimationFrame帧滚动,这样不会出现白屏
  useTransition: false,
  stopPropagation: false,
  eventPassthrough: 'vertical',
  bounce: false
}

export default {
  name: COMPONENT_NAME,
  components: {
    ViSlideItem
  },
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
      default: true
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
      let options = deepClone({}, DEFAULT_OPTIONS, this.options)
      return options.snap.loop
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.$nextTick(() => {
          this._destroySlide()
          this.setSlideWidth()
          this._initDots()
          this._initSlide()
        })
      },
    },
  },
  mounted() {
    this._initDots()
    this.setSlideWidth()
    this.$nextTick(() => {
      this._initSlide()
    })
    // if (this.autoPlay) {
    //   this._play()
    // }
    window.addEventListener('resize', this._resizeHandler, false)
  },
  methods: {
    _initDots() {
      this.dots = new Array(this.$refs.slideGroup.children.length)
    },
    setSlideWidth(isResize) {
      let width = 0
      let slideWidth = this.$refs.slide.clientWidth
      this.children = this.$refs.slideGroup.children
      Array.apply(null, this.children).forEach((item) => {
        addClass(item, 'vi-slide-float')
        // item本来的width是靠img撑开的,现在要固定,这样img就依赖了固定高度
        item.style.width = slideWidth + 'px'
        width += slideWidth
      })
      this.slideWidth = width
      if (this.loop && !isResize) {
        // 如果需要loop无缝滚动功能,还有两个缓冲div
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _initSlide() {
      let options = deepClone({}, DEFAULT_OPTIONS, this.options)
      this.slide = new BScroll(this.$refs.slide, options)

      // before-scroll-start其实是touch-start
      this.slide.on(camelize(EVENT_BEFORE_SCROLL_START), () => {
        this.touchTrigger = true
        this.toggleAbleParentSlide(this.$parent, false)
        this.$emit(EVENT_BEFORE_SCROLL_START)
      })

      // scroll-end
      // scroll-end在换页过程中至少会触发两次,因为有两页,所以需要节流
      this.slide.on(camelize(EVENT_SCROLL_END), (...args) => {
        this.toggleAbleParentSlide(this.$parent, true)
        let pageIndex = this.slide.getCurrentPage().pageX
        this.$emit(EVENT_SCROLL_END, pageIndex)
        if (this.currentPageIndex !== pageIndex) {
          this.currentPageIndex = pageIndex
          this.$emit(EVENT_CHANGE_PAGE, pageIndex)
        }
        if (this.autoPlay) {
          this._play()
        }
        if (!this.debounceInstance) {
          this.debounceInstance = new Debounce(SCROLL_STOP_TIME)
        }
        this.debounceInstance.run(() => {
          this.touchTrigger = false
        })
      })

      this.slide.goToPage(this.initPageIndex, 0, 0)

      this._listenScrollEvents()
    },
    _listenScrollEvents() {
      const finalScrollEvents = spliceArray(this.scrollEvents, BIND_SCROLL_EVENTS)
      finalScrollEvents.forEach((event) => {
        if (event === EVENT_SCROLL) {
          this.slide.on(camelize(event), (...args) => {
            this.$emit(event, ...args)
            if (this.touchTrigger) {
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
    _play() {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        this.slide && this.slide.next(0)
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
    clickHandler(event, index) {
      this.goToPage(index)
    },
    goToPage(index, time = 400) {
      window.clearTimeout(this.timer)
      this.slide.goToPage(index, 0, time)
      if (this.currentPageIndex !== index) {
        this.currentPageIndex = index
        this.$emit(EVENT_CHANGE_PAGE, index)
      }
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$emit(EVENT_LOAD_IMAGE)
      }
    },
    _destroySlide() {
      this.slide && this.slide.destroy()
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
    },
    refresh() {
      this.slide.refresh()
    },
    _destroy() {
      window.clearTimeout(this.timer)
      this.timer = null
      this._destroySlide()
      window.removeEventListener('resize', this._resizeHandler, false)
    }
  },
  beforeDestroy() {
    this._destroy()
  },
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"

.vi-slide-wrapper
  position: relative
  // 这个很重要,better-scroll会根据wrapper的高宽做判断
  min-height: 1px
  height: 100%
  overflow: hidden
  .vi-slide-group
    position: relative
    height: 100%
    white-space: nowrap
    .vi-slide-float
      float: left
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

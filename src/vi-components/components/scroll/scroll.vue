<!-- scroll需要一个父元素给高度,即scroll-wrapper -->
<template>
  <div ref="wrapper" class="vi-scroll-wrapper">
    <div class="vi-scroll-content">
      <slot></slot>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="vi-scroll-pullup-wrapper" v-if="pullUpLoad && isPullUpLoad">
          <div class="vi-scroll-before-trigger">{{pullUpTxt}}</div>
          <div class="vi-scroll-after-trigger">
            <loading></loading>
          </div>
          <div>
          </div>
        </div>
        <div class="vi-scroll-pullup-close-wrapper" v-if="!pullUpLoad && noMoreTxt">{{noMoreTxt}}</div>
      </slot>
    </div>
    <div ref="pulldown" class="vi-scroll--pulldown" v-if="pullDownRefresh">
      <slot name="pulldown"
        :pullDownRefresh="pullDownRefresh"
        :pullDownStyle="pullDownStyle"
        :beforePullDown="beforePullDown"
        :isPullingDown="isPullingDown"
        :bubbleY="bubbleY">
        <div class="vi-scroll-pulldown-wrapper" :style="pullDownStyle">
          <div class="vi-scroll-before-trigger" v-show="beforePullDown">
            <bubble class="bubble" :y="bubbleY"></bubble>
          </div>
          <div class="vi-scroll-after-trigger" v-show="!beforePullDown">
            <div v-show="isPullingDown" class="vi-scroll-loading">
              <loading></loading>
            </div>
            <div v-show="!isPullingDown" class="vi-scroll-pulldown-loaded">{{refreshTxt}}</div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Loading from './scroll-loading.vue'
import Bubble from './scroll-bubble.vue'
import ViLoading from '../loading/loading'

import BScroll from 'better-scroll'
import { camelize } from '@/common/helpers/util.js'
import { getRect } from '@/common/helpers/dom.js'

const COMPONENT_NAME = 'vi-scroll'

const EVENT_PULLING_DOWN = 'pulling-down'
const EVENT_PULLING_UP = 'pulling-up'

const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_BEFORE_SCROLL_START, EVENT_SCROLL_END]

const DEFAULT_REFRESH_TXT = 'Refresh success'

const DEFAULT_OPTIONS = {
  observeDOM: false,
  // 多层嵌套会触发多次,所以需要click的时候再自主添加
  click: false,
  probeType: 1,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false,
  preventDefault: false
}

const DEFAULT_STOP_TIME = 600

export default {
  name: COMPONENT_NAME,
  components: {
    Loading,
    Bubble,
    ViLoading
  },
  props: {
    options: {
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
    data: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
      // 如果传入pullDownRefresh是true,启用这个stop
      // 但是最终pullDownStop的值是由pulldown的dom的高度决定的
      bubbleY: 0,
      pullDownStop: 40,
      pullDownHeight: 60,
      pullDownStyle: '',
      isPullUpLoad: false,
      pullUpDirty: true,
      noMoreTxt: ''
    }
  },
  mounted() {
    this._initScroll()
  },
  computed: {
    pullDownRefresh() {
      let pullDownRefresh = this.options.pullDownRefresh
      if (!pullDownRefresh) {
        return pullDownRefresh
      }
      if (pullDownRefresh === true) {
        pullDownRefresh = {}
      }
      return Object.assign({stop: this.pullDownStop}, pullDownRefresh)
    },
    refreshTxt() {
      const pullDownRefresh = this.pullDownRefresh
      return (pullDownRefresh && pullDownRefresh.txt) || DEFAULT_REFRESH_TXT
    },
    pullUpLoad() {
      return this.options.pullUpLoad
    },
    pullUpTxt() {
      const pullUpLoad = this.pullUpLoad
      const txt = pullUpLoad && pullUpLoad.txt
      const moreTxt = (txt && txt.more) || ''
      return moreTxt
    },
  },
  watch: {
    // 父组件数据更新===子组件传递的props更新
    // watch也是基于promiseA+的异步,watch执行,但是是优先于DOM更新执行的
    // 不写deep也行,因为vue的props和data的数组的部分方法是变异的,是改变指针的
    data: {
      handler() {
        console.log('watch scroll data')
        this.$nextTick(() => {
          this.forceUpdate(true)
        })
      }
    },
    pullDownRefresh: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.scroll.openPullDown(newVal)
          if (!oldVal) {
            this._onPullDownRefresh()
          }
        }

        if (!newVal && oldVal) {
          this.scroll.closePullDown()
          this._offPullDownRefresh()
        }
      },
      deep: true
    },
    // 动态关闭下拉加载
    // 适用于数据加载完毕的情况
    pullUpLoad: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.scroll.openPullUp(newVal)
          if (!oldVal) {
            this._onPullUpLoad()
          }
        }

        if (!newVal && oldVal) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.scroll.closePullUp()
          this._offPullUpLoad()
          this.$nextTick(() => {
            this.refresh()
          })
        }
      },
      deep: true
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }

      let options = Object.assign({}, DEFAULT_OPTIONS, this.options)
      this.scroll = new BScroll(this.$refs.wrapper, options)
      this._listenScrollEvents()

      // 开启了下拉更新的功能
      if (this.pullDownRefresh) {
        this._getPullDownEleHeight()
        this._onPullDownRefresh()
      }
      // 开启了上拉加载
      if (this.pullUpLoad) {
        this._onPullUpLoad()
        this.noMoreTxt = this.pullUpLoad.txt.noMore
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    _listenScrollEvents() {
      const finalScrollEvents = this.scrollEvents.slice()
      finalScrollEvents.forEach((event) => {
        this.scroll.on(camelize(event), (...args) => {
          this.$emit(event, ...args, this.scroll)
        })
      })
    },
    destroy() {
      this.scroll && this.scroll.destroy()
      this.scroll = null
    },
    _onPullDownRefresh() {
      this.scroll.on('pullingDown', this._pullDownHandle)
      // better-scroll的事件监听系统可以重复叠加
      this.scroll.on('scroll', this._pullDownScrollHandle)
    },
    _offPullDownRefresh() {
      this.scroll.off('pullingDown', this._pullDownHandle)
      // better-scroll的事件监听取消机制
      this.scroll.off('scroll', this._pullDownScrollHandle)
    },
    _getPullDownEleHeight() {
      const pulldown = this.$refs.pulldown.firstChild
      this.pullDownHeight = getRect(pulldown).height

      this.beforePullDown = false
      this.isPullingDown = true
      this.$nextTick(() => {
        this.pullDownStop = getRect(pulldown).height
        this.beforePullDown = true
        this.isPullingDown = false
      })
    },
    // 达到阀值只会一瞬间触发
    _pullDownHandle() {
      // 达到了阀值
      this.beforePullDown = false
      // 正处长下拉的卡死状态
      this.isPullingDown = true
      this.$emit(EVENT_PULLING_DOWN)
    },
    // 下拉时,scroll会一直卡在pullDownStop高度的位置
    // 只要没回到正常的位置,这个scrollHandler一直在触发
    _pullDownScrollHandle(pos) {
      if (this.resetPullDownTimer) {
        clearTimeout(this.resetPullDownTimer)
      }
      if (this.beforePullDown) {
        this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
        // 没有达到pulldown阀值的scroll
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownHeight, 0)}px`
      } else {
        // 达到pulldown阀值得scroll
        this.bubbleY = 0
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownStop, 0)}px`
      }
    },
    // 已经watch了data,data更新就会触发forceUpdate
    // 如果data没更新,就要在外部手动触发forceUpdate恢复原来状态的方法
    // dirty如果是true则refresh
    forceUpdate(dirty = false) {
      // 上拉没有finish的状态
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this._reboundPullDown(() => {
          this._afterPullDown(dirty)
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      } else {
        // 参数带true,说明数据改变,需要重新refresh
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      }
    },
    // finishPullDown回弹
    _reboundPullDown(next) {
      // 如果pullDownRefresh没有设置stopTime,stop = DEFAULT_STOP_TIME
      const {stopTime = DEFAULT_STOP_TIME} = this.pullDownRefresh
      setTimeout(() => {
        this.scroll.finishPullDown()
        next()
      }, stopTime)
    },
    // 在finishPullDown后调用,调回pulldown位置和beforePullDown
    _afterPullDown(dirty) {
      this.resetPullDownTimer = setTimeout(() => {
        this.pullDownStyle = `top: -${this.pullDownHeight}px`
        this.beforePullDown = true
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      }, this.scroll.options.bounceTime)
    },
    _onPullUpLoad() {
      this.scroll.on('pullingUp', this._pullUpHandle)
    },
    // 达到阀值只会一瞬间触发
    _offPullUpLoad() {
      this.scroll.off('pullingUp', this._pullUpHandle)
    },
    _pullUpHandle() {
      // 处于上拉状态
      this.isPullUpLoad = true
      this.$emit(EVENT_PULLING_UP)
    },
  },
  beforeDestroy() {
    this.destroy()
  },
}
</script>

<style lang="stylus">
.vi-scroll-wrapper
  position: relative
  height: 100%
  // 开启了下拉更新功能要设置overflow:hidden
  overflow: hidden
  .vi-scroll-content
    .vi-scroll-pullup-wrapper
      width: 100%
      display: flex
      justify-content: center
      align-items: center
      .vi-scroll-before-trigger
        padding: 22px 0
        min-height: 1em
        margin-right: 20px
      .vi-scroll-after-trigger
        padding: 19px 0
    .vi-scroll-pullup-close-wrapper
      width: 100%
      text-align: center
      line-height: 50px
  .vi-scroll-pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content: center
    align-items: center
    transition: all
    .vi-scroll-before-trigger
      height: 54px
      line-height: 0
      padding-top: 6px
    .vi-scroll-after-trigger
      .vi-scroll-loading
        padding: 8px 0
      .vi-scroll-pulldown-loaded
        box-sizing: border-box
        padding: 12px 0
        line-height: 40px

</style>

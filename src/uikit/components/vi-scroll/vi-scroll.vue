<!-- scroll需要一个父元素给高度,即scroll-wrapper -->
<template>
  <div ref="wrapper" class="vi-scroll-wrapper">
    <div class="vi-scroll-content">
      <slot></slot>
      <div v-if="pullUpLoad" class="vi-scroll-pullup">
        <slot name="pullup"
          :pullUpLoad="pullUpLoad"
          :isPullUpLoad="isPullUpLoad"
          :pullUpTxt="pullUpTxt"
          :pullUpDirty="pullUpDirty"
          :noMoreTxt="noMoreTxt"
          :data="data">
            <div v-if="isPullUpLoad" class="vi-scroll-pullup-trigger">
              <div class="vi-scroll-pullup-before-trigger">{{pullUpTxt}}</div>
              <div class="vi-scroll-pullup-after-trigger">
                <loading></loading>
              </div>
            </div>
            <div v-if="!isPullUpLoad && pullUpDirty && data.length && noMoreTxt"
              class="vi-scroll-pullup-no-more">{{noMoreTxt}}</div>
        </slot>
      </div>
    </div>
    <div ref="pulldown" v-if="pullDownRefresh" class="vi-scroll-pulldown">
        <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :afterPullDown="afterPullDown"
          :bubbleY="bubbleY">
          <div class="vi-scroll-pulldown-wrapper" :style="pullDownStyle">
            <div v-show="beforePullDown && !afterPullDown" class="vi-scroll-pulldown-before-trigger">
              <bubble class="bubble" :y="bubbleY"></bubble>
            </div>
            <div v-show="!beforePullDown" class="vi-scroll-pulldown-after-trigger">
              <div v-show="isPullingDown && !afterPullDown" class="vi-scroll-loading">
                <loading></loading>
              </div>
              <div v-show="isPullingDown && afterPullDown" class="vi-scroll-pulldown-loaded">{{refreshTxt}}</div>
            </div>
          </div>
        </slot>
      </div>
  </div>
</template>

<script>

import Loading from './vi-scroll-loading.vue'
import Bubble from './vi-scroll-bubble.vue'

import BScroll from 'better-scroll'
import { camelize } from '../../common/helpers/utils.js'
import { getRect } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-scroll'

const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'

const EVENT_PULLING_DOWN = 'pulling-down'
const EVENT_PULLING_UP = 'pulling-up'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_BEFORE_SCROLL_START, EVENT_SCROLL_END]

const DEFAULT_REFRESH_TXT = 'Refresh success'

const DEFAULT_OPTIONS = {
  observeDOM: false,
  // 多层嵌套会触发多次,所以需要click的场景自主添加
  click: false,
  probeType: 1,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false,
  // 会阻止原生的其他事件的事件冒泡,开启需要巨大的代价
  // 配置class有better-scroll的元素不会阻止,在最子代的元素添加class
  // preventDefaultException: {
  //   className: /^(.+\s)?better-scroll(\s.+)?$/
  // }
}

// finishPullDown后恢复原来状态的延迟时间
const FINISH_PULLDOWN_STOP_TIME = 600

export default {
  name: COMPONENT_NAME,
  components: {
    Loading,
    Bubble
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
      // 是否没有达到下拉的阀值
      beforePullDown: true,
      // 是否是处于下拉的恢复状态
      afterPullDown: false,
      // 是否处于下来卡死状态
      isPullingDown: false,
      bubbleY: 0,
      // 如果传入pullDownRefresh是true,启用这个stop
      // 但是最终pullDownStop的值是由pulldown的dom的高度决定的
      pullDownStop: 40,
      pullDownHeight: 60,
      pullDownStyle: '',
      // 是否处于上拉状态
      isPullUpLoad: false,
      // 第一次noMore是不展示的,要data的指针发生变化后
      pullUpDirty: false,
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
    data: {
      handler() {
        console.log('watch scroll data')
        this.pullUpDirty = true
        this.$nextTick(() => {
          this.forceUpdate(true)
        })
      },
      deep: true
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
    // 动态关闭下拉加载,有两种交互情形
    // 一种是没有数据后还是可以下拉
    // 一种是没有数据后关闭下拉功能,通过父组件this.scrollOptions.pullUpLoad = false
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
      let options = Object.assign({}, DEFAULT_OPTIONS, this.options)
      this.scroll = new BScroll(this.$refs.wrapper, options)
      this._listenScrollEvents()

      // 如果开启了下拉更新的功能
      if (this.pullDownRefresh) {
        this._getPullDownEleHeight()
        this._onPullDownRefresh()
      }
      // 如果开启了上拉加载
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
      // better-scroll的事件监听系统可以重复叠加
      this.scroll.on('pullingDown', this._pullDownHandle)
      this.scroll.on('scroll', this._pullDownScrollHandle)
    },
    _offPullDownRefresh() {
      this.scroll.off('pullingDown', this._pullDownHandle)
      this.scroll.off('scroll', this._pullDownScrollHandle)
    },
    // 计算默认的停滞位置
    _getPullDownEleHeight() {
      const pulldown = this.$refs.pulldown.firstChild
      this.pullDownHeight = getRect(pulldown).height
      this.$nextTick(() => {
        this.pullDownStop = getRect(pulldown).height
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
      // 没有达到阀值的未触发pullDown
      if (this.beforePullDown && !this.afterPullDown) {
        this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
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
        this._reboundPullDown(() => {
          this._afterPullDown(dirty)
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
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
    // finishPullDown回弹,数据已经变更
    _reboundPullDown(next) {
      this.afterPullDown = true
      // 如果pullDownRefresh没有设置stopTime,stopTime = FINISH_PULLDOWN_STOP_TIME
      const { stopTime = FINISH_PULLDOWN_STOP_TIME } = this.pullDownRefresh
      setTimeout(() => {
        this.scroll.finishPullDown()
        this.isPullingDown = false
        next()
      }, stopTime)
    },
    // 在finishPullDown调用后,调回pulldown位置和beforePullDown
    _afterPullDown(dirty) {
      // this.scroll.options.bounceTime(默认800ms)后大概就是finishPullDown恢复到原点的时间
      this.resetPullDownTimer = setTimeout(() => {
        this.pullDownStyle = `top: -${this.pullDownHeight}px`
        this.afterPullDown = false
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
    _offPullUpLoad() {
      this.scroll.off('pullingUp', this._pullUpHandle)
    },
    _pullUpHandle() {
      // 处于上拉状态
      this.isPullUpLoad = true
      this.$emit(EVENT_PULLING_UP)
    }
  },
  beforeDestroy() {
    this.destroy()
  }

}
</script>

<style lang="stylus">
.vi-scroll-wrapper
  position: relative
  height: 100%
  // 开启了下拉更新功能要设置overflow:hidden
  overflow: hidden
  .vi-scroll-content
    .vi-scroll-pullup
      .vi-scroll-pullup-trigger
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        .vi-scroll-pullup-before-trigger
          padding: 22px 0
          min-height: 1em
          margin-right: 20px
        .vi-scroll-pullup-after-trigger
          padding: 19px 0
      .vi-scroll-pullup-no-more
        width: 100%
        text-align: center
        line-height: 80px
  .vi-scroll-pulldown
    .vi-scroll-pulldown-wrapper
      position: absolute
      width: 100%
      left: 0
      display: flex
      justify-content: center
      align-items: center
      transition: all
      .vi-scroll-pulldown-before-trigger
        height: 54px
        line-height: 0
        padding-top: 6px
      .vi-scroll-pulldown-after-trigger
        .vi-scroll-loading
          padding: 8px 0
        .vi-scroll-pulldown-loaded
          box-sizing: border-box
          padding: 12px 0
          line-height: 40px

</style>

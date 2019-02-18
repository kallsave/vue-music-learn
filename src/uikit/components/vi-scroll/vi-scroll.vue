<!-- scroll需要一个父元素给高度,即scroll-wrapper -->
<template>
  <div ref="wrapper"
    class="vi-scroll-wrapper">
    <div class="vi-scroll-content">
      <slot></slot>
      <div class="vi-scroll-pull-up"
        v-if="pullUpLoad">
        <slot name="pull-up"
          :is-pull-up-load="isPullUpLoad"
          :pull-up-txt="pullUpTxt"
          :pull-up-dirty="pullUpDirty"
          :no-nore-txt="noMoreTxt"
          :data="data">
            <div>scroll</div>
            <div class="vi-scroll-pull-up-trigger"
              v-if="isPullUpLoad">
              <div class="vi-scroll-pull-up-before-trigger">{{pullUpTxt}}</div>
              <div class="vi-scroll-pull-up-after-trigger">
                <loading></loading>
              </div>
            </div>
            <div v-if="!isPullUpLoad && pullUpDirty && data.length && noMoreTxt"
              class="vi-scroll-pull-up-no-more">{{noMoreTxt}}</div>
        </slot>
      </div>
    </div>
    <div ref="pullDown"
      class="vi-scroll-pull-down-wrapper">
      <slot name="pull-down"
        :pull-down-refresh="pullDownRefresh"
        :pull-down-style="pullDownStyle"
        :pull-down-state="pullDownState"
        :bubble-y="bubbleY">
          <div class="vi-scroll-pull-down-content"
            v-if="pullDownRefresh"
            :style="pullDownStyle">
            <div class="vi-scroll-pull-down-normal"
              v-show="pullDownState === PULL_DOWN_STATE[0]">
              <bubble class="bubble" :y="bubbleY"></bubble>
            </div>
            <div class="vi-scroll-pull-down-lock"
              v-show="pullDownState === PULL_DOWN_STATE[1]">
              <vi-loading :scale="0.8"></vi-loading>
            </div>
            <div class="vi-scroll-pull-down-refresh"
              v-show="pullDownState === PULL_DOWN_STATE[2]"
            >{{refreshTxt}}</div>
          </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Bubble from './vi-scroll-bubble.vue'
import ViLoading from '../vi-loading/vi-loading'
import BScroll from 'better-scroll'
import { camelize, mulitDeepClone } from '../../common/helpers/utils.js'
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
  directionLockThreshold: 1,
  // 会阻止原生的其他事件的事件冒泡,开启需要巨大的代价
  // 配置class有better-scroll的元素不会阻止,在最子代的元素添加class
  // preventDefaultException: {
  //   className: /^(.+\s)?better-scroll(\s.+)?$/
  // }
}

// finishPullDown后恢复原来状态的延迟时间
const FINISH_PULLDOWN_STOP_TIME = 600

const PULL_DOWN_STATE = [
  'normal',
  'lock',
  'refresh',
]

export default {
  name: COMPONENT_NAME,
  components: {
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
      bubbleY: 0,
      // 最终pullDownStop的值是由pull-down的dom的高度决定的
      pullDownStop: 40,
      pullDownHeight: 60,
      // 提高pull-down-content或者pull-down插槽的top值
      pullDownStyle: {},
      pullDownState: PULL_DOWN_STATE[0],
      PULL_DOWN_STATE: PULL_DOWN_STATE,
      // 是否处于上拉状态
      isPullUpLoad: false,
      // 第一次noMore是不展示的,要data的指针发生变化后
      pullUpDirty: false,
      noMoreTxt: '',
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
      return mulitDeepClone({stop: this.pullDownStop}, pullDownRefresh)
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
            this._initPullDownEle()
          }
        }
        if (!newVal && oldVal) {
          this.scroll.closePullDown()
          this._offPullDown()
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
      this.name = COMPONENT_NAME
      let options = mulitDeepClone({}, DEFAULT_OPTIONS, this.options)
      this.scroll = new BScroll(this.$refs.wrapper, options)
      this._listenScrollEvents()

      // 如果开启了下拉更新的功能
      if (this.pullDownRefresh) {
        this._getPullDownEleHeight()
        this._initPullDownEle()
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
          this.$emit(event, ...args)
        })
      })
    },
    _initPullDownEle() {
      // better-scroll的事件监听系统可以重复叠加
      this.scroll.on('pullingDown', this._pullDownHandler)
      this.scroll.on('scroll', this._pullDownScrollHandler)
    },
    _offPullDown() {
      this.scroll.off('pullingDown', this._pullDownHandler)
      this.scroll.off('scroll', this._pullDownScrollHandler)
    },
    // 计算pull-down-content的高度,并且初始化它的top
    _getPullDownEleHeight() {
      const pullDown = this.$refs.pullDown.firstChild
      this.pullDownHeight = getRect(pullDown).height
      console.log(this.pullDownHeight)
      this.pullDownStyle = {
        top: `${-this.pullDownHeight}px`
      }
    },
    // 达到阀值只会一瞬间触发
    _pullDownHandler() {
      // 达到了阀值,松手后会处于卡死状态
      this.pullDownState = PULL_DOWN_STATE[1]
      this.$emit(EVENT_PULLING_DOWN)
    },
    // 下拉时,scroll会一直卡在pullDownStop高度的位置
    // 只要没回到正常的位置,这个scrollHandlerr一直在触发
    _pullDownScrollHandler(pos) {
      // 没有达到阀值的未触发pullDown
      if (this.pullDownState === PULL_DOWN_STATE[0]) {
        this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
        this.pullDownStyle = {
          top: `${Math.min(pos.y - this.pullDownHeight, 0)}px`
        }
      } else {
        if (this.pullDownState === PULL_DOWN_STATE[1] && this.bubbleY === 0) {
          return
        }
        this.bubbleY = 0
        this.pullDownStyle = {
          top: `${Math.min(pos.y - this.pullDownStop, 0)}px`
        }
      }
    },
    // data更新就会触发forceUpdate, dirty如果是true则refresh
    // 如果data没更新,就要在外部手动触发forceUpdate恢复原来状态的方法
    forceUpdate(dirty = false) {
      if (this.pullDownRefresh && this.pullDownState === PULL_DOWN_STATE[1]) {
        this.refreshPullDown(() => {
          this.normalPullDown(dirty)
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
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      }
    },
    // 数据已经更新,stopTime后回弹finishPullDown
    refreshPullDown(next) {
      this.pullDownState = PULL_DOWN_STATE[2]
      // 如果pullDownRefresh没有设置stopTime,stopTime = FINISH_PULLDOWN_STOP_TIME
      const { stopTime = FINISH_PULLDOWN_STOP_TIME } = this.pullDownRefresh
      this.refreshPullDownTimer = window.setTimeout(() => {
        this.scroll.finishPullDown()
        next()
      }, stopTime)
    },
    // 在finishPullDown回弹后,复原原始状态
    normalPullDown(dirty) {
      // this.scroll.options.bounceTime(默认800ms)后大概就是finishPullDown恢复到原点的时间
      this.normalPullDownTimer = window.setTimeout(() => {
        this.pullDownStyle = {
          top: `-${this.pullDownHeight}px`
        }
        this.$nextTick(() => {
          this.pullDownState = PULL_DOWN_STATE[0]
        })
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      }, this.scroll.options.bounceTime)
    },
    _onPullUpLoad() {
      this.scroll.on('pullingUp', this._pullUpHandler)
    },
    _offPullUpLoad() {
      this.scroll.off('pullingUp', this._pullUpHandler)
    },
    _pullUpHandler() {
      // 处于上拉状态
      this.isPullUpLoad = true
      this.$emit(EVENT_PULLING_UP)
    },
    destroy() {
      this.scroll && this.scroll.destroy()
      this.scroll = null
      this.clearTimer()
    },
    clearTimer() {
      window.clearTimeout(this.refreshPullDownTimer)
      this.refreshPullDownTimer = null
      window.clearTimeout(this.normalPullDownTimer)
      this.normalPullDownTimer = null
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
  z-index: 0
  .vi-scroll-content
    .vi-scroll-pull-up
      .vi-scroll-pull-up-trigger
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        .vi-scroll-pull-up-before-trigger
          padding: 22px 0
          min-height: 1em
          margin-right: 20px
        .vi-scroll-pull-up-after-trigger
          padding: 19px 0
      .vi-scroll-pull-up-no-more
        width: 100%
        text-align: center
        line-height: 80px
  .vi-scroll-pull-down-wrapper
    text-align: center
    .vi-scroll-pull-down-content
      position: absolute
      left: 0
      right: 0
      top: 0
      display: flex
      justify-content: center
      align-items: center
      transition: all
      .vi-scroll-pull-down-normal
        height: 54px
        line-height: 0
        padding-top: 6px
      .vi-scroll-pull-down-lock
        padding: 8px 0
      .vi-scroll-pull-down-refresh
        box-sizing: border-box
        padding: 12px 0
        line-height: 40px

</style>

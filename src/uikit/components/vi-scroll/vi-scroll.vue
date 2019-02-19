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
            <div class="vi-scroll-pull-up-before-trigger"
              v-show="pullUpState === pullUpStateList[0]">{{pullUpTxt + isPullUpLoad}}</div>
            <div class="vi-scroll-pull-up-after-trigger"
              v-show="pullUpState === pullUpStateList[1]">
              <vi-loading :scale="0.8"></vi-loading>
            </div>
            <div v-show="pullUpState === pullUpStateList[0] && pullUpDirty && data.length && noMoreTxt"
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
        :pull-down-state-list="pullDownStateList"
        :pull-down-normal-top="pullDownNormalTop"
        :pull-down-scroll-y="pullDownScrollY">
          <div class="vi-scroll-pull-down-content"
            v-if="pullDownRefresh"
            :style="pullDownStyle">
            <div class="vi-scroll-pull-down-normal"
              v-show="pullDownState === pullDownStateList[0]">
              <bubble class="bubble" :y="pullDownNormalTop"></bubble>
            </div>
            <div class="vi-scroll-pull-down-lock"
              v-show="pullDownState === pullDownStateList[1]">
              <vi-loading :scale="0.8"></vi-loading>
            </div>
            <div class="vi-scroll-pull-down-success"
              v-show="pullDownState === pullDownStateList[2]"
            >{{pullDownRefresh.txt}}</div>
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

// 开启pullDownRefresh的默认配置
const PULL_DOWN_REFRESH_DEFAULT_OPTIONS = {
  // 阀值
  threshold: 80,
  // 滞留的位置
  stop: 56,
  txt: '更新成功',
  // 更新到数据,调用finishPullDown的延迟时间,
  // 会影响到txt的显示持续时间
  stopTime: 1000
}

// 开启pullUpLoad的默认配置
const PULL_UP_LOAD_DEFAULT_OPTIONS = {
  threshold: 10000000,
  txt: {
    more: '加载更多',
    // 不传则底部不会有空白
    noMore: '没有更多的比赛啦'
  }
}

const PULL_DOWN_STATE_LIST = [
  'normal',
  'lock',
  'success',
]

const PULL_UP_STATE_LIST = [
  'normal',
  'lock',
  'success',
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
      pullDownNormalTop: 0,
      pullDownScrollY: 0,
      // 提供pull-down-content或者pull-down插槽的top值
      pullDownStyle: {},
      pullDownState: PULL_DOWN_STATE_LIST[0],
      pullDownStateList: PULL_DOWN_STATE_LIST,
      // 是否处于上拉状态
      isPullUpLoad: false,
      // 第一次noMore是不展示的,要data的指针发生变化后
      pullUpDirty: false,
      noMoreTxt: '',
      pullUpState: PULL_UP_STATE_LIST[0],
      pullUpStateList: PULL_UP_STATE_LIST
    }
  },
  mounted() {
    this._initScroll()
  },
  computed: {
    pullDownRefresh() {
      if (this.options.pullDownRefresh === true) {
        return mulitDeepClone({}, PULL_DOWN_REFRESH_DEFAULT_OPTIONS)
      } else if (!this.options.pullDownRefresh) {
        return false
      } else {
        return mulitDeepClone({}, PULL_DOWN_REFRESH_DEFAULT_OPTIONS, this.options.pullDownRefresh)
      }
    },
    pullUpLoad() {
      if (this.options.pullUpLoad === true) {
        return mulitDeepClone({}, PULL_UP_LOAD_DEFAULT_OPTIONS)
      } else if (!this.options.pullUpLoad) {
        return false
      } else {
        return mulitDeepClone({}, PULL_UP_LOAD_DEFAULT_OPTIONS, this.options.pullUpLoad)
      }
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
    // 去掉这种模式,使用方法自动关闭
    // 动态关闭下拉加载,有两种交互情形
    // 一种是没有数据后还是可以下拉
    // 一种是没有数据后关闭下拉功能,通过父组件this.scrollOptions.pullUpLoad = false
    // pullUpLoad: {
    //   handler(newVal, oldVal) {
    //     if (newVal) {
    //       this.scroll.openPullUp(newVal)
    //       if (!oldVal) {
    //         this._onPullUpLoadEvent()
    //       }
    //     }
    //     if (!newVal && oldVal) {
    //       this.isPullUpLoad = false
    //       this.scroll.finishPullUp()
    //       this.scroll.closePullUp()
    //       this._offPullUpLoadEvent()
    //       this.$nextTick(() => {
    //         this.refresh()
    //       })
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    _initScroll() {
      let extraOptions = {}
      if (this.pullDownRefresh) {
        extraOptions.pullDownRefresh = this.pullDownRefresh
      }
      if (this.pullUpLoad) {
        extraOptions.pullUpLoad = this.pullUpLoad
      }
      let options = mulitDeepClone({}, DEFAULT_OPTIONS, extraOptions, this.options)
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.pullDownRefresh) {
        this._calculatelPullDownEleHeight()
        this._onPullDownEvent()
      }
      // 如果开启了上拉加载
      if (this.pullUpLoad) {
        this._onPullUpLoadEvent()
        this.noMoreTxt = this.pullUpLoad.txt.noMore
      }
      this._listenScrollEvents()
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
    // 计算pull-down-content的高度,并且初始化它的top
    _calculatelPullDownEleHeight() {
      const pullDown = this.$refs.pullDown.firstChild
      this.pullDownHeight = getRect(pullDown).height
      this.pullDownStyle = {
        top: `${-this.pullDownHeight}px`
      }
    },
    _onPullDownEvent() {
      if (this.isUsePullDown) {
        return
      }
      this.isUsePullDown = true
      this.scroll.on('pullingDown', this._pullDownHandler)
      this.scroll.on('scroll', this._pullDownScrollHandler)
    },
    _offPullDownEvent() {
      if (!this.isUsePullDown) {
        return
      }
      this.isUsePullDown = false
      this.scroll.off('pullingDown', this._pullDownHandler)
      this.scroll.off('scroll', this._pullDownScrollHandler)
    },
    // 达到阀值只会一瞬间触发
    _pullDownHandler() {
      // 达到了阀值,松手后会处于卡死状态
      this.pullDownState = PULL_DOWN_STATE_LIST[1]
      this.$emit(EVENT_PULLING_DOWN)
    },
    // 下拉超过阀值时会一直卡在stop高度的位置
    _pullDownScrollHandler(pos) {
      // 没有达到阀值的未触发pullDown
      this.pullDownScrollY = pos.y
      if (this.pullDownState === PULL_DOWN_STATE_LIST[0]) {
        this.pullDownNormalTop = Math.max(0, this.pullDownScrollY - this.pullDownHeight)
        this.pullDownStyle = {
          top: `${Math.min(this.pullDownScrollY - this.pullDownHeight, 0)}px`
        }
      } else {
        if (this.pullDownState === PULL_DOWN_STATE_LIST[1] && this.stopY === this.pullDownScrollY) {
          return
        }
        this.stopY = this.pullDownScrollY
        this.pullDownNormalTop = 0
        this.pullDownStyle = {
          top: `${Math.min(this.scrollY - this.pullDownHeight, 0)}px`
        }
      }
    },
    // 如果data没更新,就要在外部手动触发forceUpdate恢复原来状态的方法
    forceUpdate(dirty = false) {
      if (this.pullDownRefresh && this.pullDownState === PULL_DOWN_STATE_LIST[1]) {
        this.refreshPullDown(() => {
          this.normalPullDown(dirty)
        })
      } else if (this.pullUpLoad && this.pullUpState === PULL_UP_STATE_LIST[1]) {
        this.pullUpState = PULL_UP_STATE_LIST[0]
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
      this.pullDownState = PULL_DOWN_STATE_LIST[2]
      this.refreshPullDownTimer = window.setTimeout(() => {
        this.scroll.finishPullDown()
        next()
      }, this.pullDownRefresh.stopTime)
    },
    // 在finishPullDown回弹后,复原原始状态
    normalPullDown(dirty) {
      // this.scroll.options.bounceTime(默认800ms)后大概就是finishPullDown恢复到原点的时间
      this.normalPullDownTimer = window.setTimeout(() => {
        this.pullDownStyle = {
          top: `-${this.pullDownHeight}px`
        }
        this.$nextTick(() => {
          this.pullDownState = PULL_DOWN_STATE_LIST[0]
        })
        if (dirty) {
          this.$nextTick(() => {
            this.refresh()
          })
        }
      }, this.scroll.options.bounceTime)
    },
    // 手动开启pullDown
    openPullDown() {
      this.scroll.openPullDown(this.pullDownRefresh)
      this._onPullDownEvent()
    },
    // 手动关闭pullDown
    closePullDown() {
      this.scroll.closePullDown()
      this._offPullDownEvent()
    },
    // 自动触发下拉刷新
    autoPullDownRefresh() {
      if (!this.isUsePullDown) {
        return
      }
      this.scroll.autoPullDownRefresh()
    },
    _onPullUpLoadEvent() {
      this.scroll.on('pullingUp', this._pullUpHandler)
      this.scroll.on('scroll', this._pullUpScrollHandler)
    },
    _offPullUpLoadEvent() {
      this.scroll.off('pullingUp', this._pullUpHandler)
    },
    _pullUpHandler() {
      // 处于上拉状态
      // this.isPullUpLoad = true
      this.pullUpState = PULL_UP_STATE_LIST[1]
      this.$emit(EVENT_PULLING_UP)
    },
    _pullUpScrollHandler(pos) {
      console.log('s', pos.y)
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
      text-align: center
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
      z-index: -1
      .vi-scroll-pull-down-normal
        box-sizing: content-box
        height: 48px
        padding-top: 8px
      .vi-scroll-pull-down-lock
        box-sizing: content-box
        width: 100%
        padding: 8px 0
      .vi-scroll-pull-down-success
        box-sizing: content-box
        padding: 8px 0
        line-height: 40px

</style>

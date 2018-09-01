<!-- scroll需要一个父元素给高度,即scroll-wrapper -->
<template>
  <div ref="wrapper" class="vi-scroll-wrapper">
    <div class="vi-scroll-content">
      <slot></slot>
    </div>
    <div ref="pulldown" class="vi-pulldown" v-if="pullDownRefresh">
      <slot name="pulldown">
        <div class="vi-pulldown-wrapper"
          :style="pullDownStyle">pulldown</div>
      </slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { camelize } from '@/common/helpers/util.js'
import { getRect } from '@/common/helpers/dom.js'

const COMPONENT_NAME = 'vi-scroll'

const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_BEFORE_SCROLL_START, EVENT_SCROLL_END]

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
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // 这个refreshData是scroll组件包住的元素里面的数据
    // 这个数据会影响高度
    refreshData: {
      type: [Object, Array],
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
      isPullingDown: false,
      // 如果传入pullDownRefresh是true,启用这个stop
      // 但是最终pullDownStop的值是由pulldown的dom的高度决定的
      pullDownStop: 40,
      pullDownHeight: 60,
      pullDownStyle: ''
    }
  },
  created() {
    console.log(this.options)
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
    }
  },
  watch: {
    // 父组件数据更新===子组件传递的props更新
    // watch也是基于promiseA+的异步,watch执行,但是是优先于DOM更新执行的
    refreshData: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          console.log('refresh')
          this.refresh()
        })
      }
    },
    // 这个data不仅仅是refresh更是告诉scroll上下拉加载完成
    data() {
      this.$nextTick(() => {
        this.forceUpdate(true)
      })
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

      if (this.pullDownRefresh) {
        this._getPullDownEleHeight()
        this._onPullDownRefresh()
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
    _onPullDownRefresh() {
      this.scroll.on('pullingDown', this._pullDownHandle)
      this.scroll.on('scroll', this._pullDownScrollHandle)
    },
    _getPullDownEleHeight() {
      const pulldown = this.$refs.pulldown.firstChild
      this.pullDownHeight = getRect(pulldown).height

      // this.beforePullDown = false
      // this.isPullingDown = true
      this.$nextTick(() => {
        this.pullDownStop = getRect(pulldown).height
        // this.beforePullDown = true
        // this.isPullingDown = false
      })
    },
    // 下拉是,scroll会一直卡在pullDownStop高度的位置
    _pullDownScrollHandle(pos) {
      // 把dom转移到顶部
      if (this.beforePullDown) {
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownHeight, 0)}px`
      } else {
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownStop, 0)}px`
      }
    },
    _pullDownHandle() {
      this.beforePullDown = false
      this.isPullingDown = true
    },
    forceUpdate(dirty = false) {

    },
    _reboundPullDown(next) {
      // 如果pullDownRefresh没有设置stopTime,stop = DEFAULT_STOP_TIME
      const {stopTime = DEFAULT_STOP_TIME} = this.pullDownRefresh
      setTimeout(() => {
        this.scroll.finishPullDown()
        next()
      }, stopTime)
    },
  }
}
</script>

<style lang="stylus">
.vi-scroll-wrapper
  // 不设置overflow,需要overflow在父元素设置
  position: relative
  height: 100%
  .vi-pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content: center
    align-items: center
    transition: all
</style>

<template>
  <div class="vi-sticky">
    <vi-scroll ref="scroll"
      :data="data"
      :scroll-events="scrollEvents"
      :options="stickyOptions"
      @scroll="scrollHandle">
      <slot></slot>
      <template slot="pull-up" slot-scope="pullUpScope">
        <slot name="pull-up" :pull-up-scope="pullUpScope"></slot>
      </template>
    </vi-scroll>
    <div ref="fixed"
      class="vi-sticky-box"
      v-show="fixedVisable"
      :style="fixedStyle"></div>
  </div>
</template>

<script>
import ViScroll from '../vi-scroll/vi-scroll.vue'
import {
  getRect,
  prefixStyle
} from '@/common/helpers/dom.js'
import { mulitDeepClone } from '../../common/helpers/utils.js'
const TRANSFORM = prefixStyle('transform')
const COMPONENT_NAME = 'vi-sticky'
const EVENT_STICKY_CHANGE = 'sticky-change'
const EVENT_STICKY_CANCEL = 'sticky-cancel'
const EVENT_STICKY_REMOVE_MERGE = 'sticky-remove-merge'
const EVENT_SCROLL = 'scroll'
const EVENT_PULLING_DOWN = 'pulling-down'
const EVENT_PULLING_UP = 'pulling-up'
const DEFAULT_OPTIONS = {
  click: true
}
const BIND_OPTIONS = {
  probeType: 3,
}
export default {
  name: COMPONENT_NAME,
  components: {
    ViScroll
  },
  provide() {
    return {
      ViSticky: this
    }
  },
  props: {
    zIndex: {
      type: Number,
      default: 1000
    },
    // refresh
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 重新计算位置
    stickyData: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    fixedY: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    scrollEvents: {
      type: Array,
      default() {
        return ['scroll']
      }
    },
  },
  data() {
    return {
      scrollY: 0,
      fixedStyle: {},
      fixedVisable: false,
      stickyMap: {},
      diff: 0,
      transformTop: 0,
      listHeight: [],
      stickyOptions: {},
    }
  },
  computed: {
    pullDownRefresh() {
      return this.options.pullDownRefresh
    },
    pullUpLoad() {
      return this.options.pullUpLoad
    },
  },
  watch: {
    // 影响sticky位置计算的data
    stickyData: {
      deep: true,
      handler() {
        this.forceCalculateStickyTop()
      }
    },
    scrollY(newVal) {
      if (newVal > 0) {
        return
      }
      let length = this.listHeight.length
      if (!length) {
        return
      }
      // TODO: fixed bug
      newVal = Math.abs(newVal)
      for (let i = 0; i < length; i++) {
        let item1 = this.listHeight[i]
        let item2 = this.listHeight[i + 1]
        let item3 = this.listHeight[i + 2]
        if (!item2 && newVal >= item1.stickyTop) {
          // 如果只有一个sticky-ele并且滚动到了stikcy的位置
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          return
        } else if (item2 && newVal > item1.stickyTop && newVal <= item2.stickyTop) {
          // 如果有多个sticky-ele并且滚动的位置处于两者中间
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          let nextDiff = item2.stickyTop - newVal
          // transformTop > 0表示两者已经碰上了
          let transformTop = item1.clientHeight - nextDiff
          // 如果这两者是可以合并的sticky-ele
          if (item2.mergeEleKey && item2.mergeEleKey === item1.mergeEleKey) {
            // 合并
            if (transformTop >= 0 && !this.hadMergeEle) {
              this.fixedElement.appendChild(this.stickyMap[item2.eleKey].$el)
              this.hadMergeEle = true
              return
            } else if (transformTop < 0 && this.hadMergeEle) {
              // 分离
              this.hadMergeEle = false
              const remove = this.fixedElement.removeChild(this.stickyMap[item2.eleKey].$el)
              for (let key in this.stickyMap) {
                if (this.stickyMap[key].$el === remove) {
                  this.stickyMap[key].eleComponent.$el.appendChild(remove)
                  this.$emit(EVENT_STICKY_REMOVE_MERGE)
                }
              }
            }
            return
          } else {
            this.transformTop = transformTop
          }
        } else if (item2 && newVal >= item2.stickyTop) {
          // 如果有多个sticky-ele并且滚动到了后者的sticky
          this.diff = newVal - item1.stickyTop
          let nextDiff = item2.stickyTop - newVal
          let transformTop = item1.clientHeight - nextDiff
          // 如果这两者是可以合并的sticky-ele
          if (item2.mergeEleKey && item2.mergeEleKey === item1.mergeEleKey) {
            if (transformTop >= 0 && !this.hadMergeEle) {
              this.fixedElement.appendChild(this.stickyMap[item2.eleKey].$el)
              this.hadMergeEle = true
              return
            }
            // 修改这里
            if (item3 && newVal > item2.stickyTop && newVal <= item3.stickyTop) {
            }
            return
          } else {
            this.currentSticky = this.stickyMap[item2.eleKey]
            this.transformTop = 0
            this.diff = newVal - item2.stickyTop
          }
        } else {
          this.reset()
        }
      }
      this.fixedStyle = {}
      this.fixedVisable = false
    },
    diff(newVal) {
      // 如果已经在吸顶了
      if (this.current === this.currentSticky && this.fixedVisable) {
        return
      }
      this.current = this.currentSticky
      this.fixedVisable = true
      this.fixedStyle = {
        'position': 'absolute',
        'top': `${this.fixedY}px`,
        'z-index': this.zIndex,
        'width': `${this.currentSticky.clientWidth}px`,
        'height': `${this.currentSticky.clientHeight}px`,
      }
      this.reset()
      const element = this.currentSticky.$el
      this.fixedElement.appendChild(element)
      this.$emit(EVENT_STICKY_CHANGE, this.currentSticky)
    },
    transformTop(newVal) {
      let fixTransformTop = newVal > 0 ? -newVal : 0
      if (this.fixTransformTop === fixTransformTop) {
        return
      }
      this.fixTransformTop = fixTransformTop
      this.fixedElement.style[TRANSFORM] = `translateY(${fixTransformTop}px)`
    }
  },
  created() {
    this._propChildren()
  },
  mounted() {
    this._findFixedElement()
    this._findScroll()
    if (this.pullDownRefresh) {
      this.$refs.scroll.$on(EVENT_PULLING_DOWN, () => {
        this.$emit(EVENT_PULLING_DOWN, arguments)
      })
    }
    if (this.pullUpLoad) {
      this.$refs.scroll.$on(EVENT_PULLING_UP, () => {
        this.$emit(EVENT_PULLING_UP, arguments)
      })
    }
  },
  methods: {
    _propChildren() {
      // created => children.props => children.data => children.created
      this.stickyOptions = mulitDeepClone({}, DEFAULT_OPTIONS, this.options, BIND_OPTIONS)
    },
    scrollHandle(pos) {
      this.scrollY = pos.y
      this.$emit(EVENT_SCROLL, pos, this.scroll)
    },
    _findFixedElement() {
      if (!this.$refs.fixed) {
        return
      }
      this.fixedElement = this.$refs.fixed
    },
    calculateAllStickyEleTop() {
      for (let key in this.stickyMap) {
        this.stickyMap[key].calculate()
      }
      this._calculateListHeight()
    },
    _calculateListHeight() {
      let result = []
      for (let key in this.stickyMap) {
        result.push({
          eleKey: key,
          stickyTop: this.stickyMap[key].stickyTop,
          clientHeight: this.stickyMap[key].clientHeight,
          mergeEleKey: this.stickyMap[key].mergeEleKey
        })
      }
      this.listHeight = result.sort((a, b) => {
        return a.stickyTop - b.stickyTop
      })
    },
    _findScroll() {
      if (!this.$refs.scroll) {
        return
      }
      this.scroll = this.$refs.scroll.scroll
    },
    refresh() {
      this.$refs.scroll && this.$refs.scroll.refresh()
    },
    scrollTop() {
      this.reset()
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0)
    },
    // 吸顶元素复位
    reset() {
      if (this.fixedElement.firstElementChild) {
        const remove = this.fixedElement.removeChild(this.fixedElement.firstElementChild)
        for (let key in this.stickyMap) {
          if (this.stickyMap[key].$el === remove) {
            this.stickyMap[key].eleComponent.$el.appendChild(remove)
            this.$emit(EVENT_STICKY_CANCEL)
          }
        }
      }
      this.refresh()
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(arguments)
    },
    forceUpdate() {
      this.$refs.scroll.forceUpdate(arguments)
    },
    forceCalculateStickyTop() {
      this.scrollTop()
      this.$nextTick(() => {
        this.calculateAllStickyEleTop()
        this.refresh()
      })
    },
  }
}
</script>

<style lang="stylus">
.vi-sticky
  position: relative
  height: 100%
</style>

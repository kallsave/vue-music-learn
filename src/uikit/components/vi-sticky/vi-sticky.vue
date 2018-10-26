<template>
  <div class="vi-sticky">
    <vi-scroll
      ref="scroll"
      :data="data"
      :scroll-events="scrollEvents"
      :options="options"
      @scroll="scrollHandle">
      <slot></slot>
      <template slot="pullup" slot-scope="pullupScope"
        v-if="pullupScope.pullUpLoad">
        <slot name="pullup" :pullupScope="pullupScope"></slot>
      </template>
    </vi-scroll>
    <div ref="fixed" v-show="fixedVisable" :style="fixedStyle"></div>
  </div>
</template>

<script>
import ViScroll from '../vi-scroll/vi-scroll.vue'

import {
  getRect,
  prefixStyle
} from '@/common/helpers/dom.js'

import { isEmptyObject } from '@/common/helpers/utils.js'

const transformStyleKey = prefixStyle('transform')

const COMPONENT_NAME = 'vi-sticky'

const EVENT_CHANGE = 'sticky-change'
const EVENT_CANCEL = 'sticky-cancel'
const EVENT_SCROLL = 'scroll'
const EVENT_PULLING_DOWN = 'pulling-down'
const EVENT_PULLING_UP = 'pulling-up'

export default {
  name: COMPONENT_NAME,
  components: {
    ViScroll
  },
  provide() {
    return {
      Sticky: this
    }
  },
  props: {
    zIndex: {
      type: Number,
      default: 10
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
        return {
          probeType: 3,
          click: true
        }
      }
    },
    scrollEvents: {
      type: Array,
      default() {
        return ['scroll']
      }
    }
  },
  data() {
    return {
      scrollY: 0,
      fixedStyle: {},
      fixedVisable: false,
      stickyMap: {},
      stickyTop: 0,
      diff: 0,
      transformTop: 0,
      listHeight: [],
    }
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
    // 所有子组件的this.$nextTick之后
    this.$nextTick(() => {
      this._calculateStickyTop()
    })
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
      newVal = Math.abs(newVal)
      for (let i = 0; i < length; i++) {
        let item1 = this.listHeight[i]
        let item2 = this.listHeight[i + 1]
        if (!item2 && newVal >= item1.stickyTop) {
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          return
        } else if (item2 && newVal > item1.stickyTop && newVal < item2.stickyTop) {
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          this.nextDiff = item2.stickyTop - newVal
          this.transformTop = item1.clientHeight - this.nextDiff
          return
        } else if (item2 && newVal >= item2.stickyTop) {
          this.currentSticky = this.stickyMap[item2.eleKey]
          this.transformTop = 0
          this.diff = newVal - item2.stickyTop
          return
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
        'width': `${this.currentSticky.clientWidth}px`,
        'z-index': this.zIndex,
        'height': `${this.currentSticky.clientHeight}px`
      }
      this.reset()
      const element = this.currentSticky.$el
      this.fixedElement.appendChild(element)
      // deepAppendChild(this.fixedElement, element)
      this.$emit(EVENT_CHANGE, this.currentSticky)
    },
    transformTop(newVal) {
      let fixTransformTop = newVal > 0 ? -newVal : 0
      if (this.fixTransformTop === fixTransformTop) {
        return
      }
      this.fixTransformTop = fixTransformTop
      this.fixedElement.style[transformStyleKey] = `translateY(${fixTransformTop}px)`
    }
  },
  methods: {
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
    _calculateStickyTop() {
      this.stickyTop = this.$el.getBoundingClientRect().top
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
          clientHeight: this.stickyMap[key].clientHeight
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
    reset() {
      if (this.fixedElement.firstElementChild) {
        const remove = this.fixedElement.removeChild(this.fixedElement.firstElementChild)
        if (remove.eleKey) {
          this.stickyMap[remove.eleKey].eleComponent.$el.appendChild(remove)
          // deepAppendChild(this.stickyMap[remove.eleKey].eleComponent.$el, remove)
          this.$emit(EVENT_CANCEL)
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
        this._calculateStickyTop()
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

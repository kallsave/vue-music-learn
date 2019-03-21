<template>
  <div ref="sticky"
    class="vi-native-sticky">
    <slot></slot>
    <div ref="fixed"
      class="vi-native-sticky-box"
      v-show="fixedVisable"
      :style="fixedStyle"></div>
  </div>
</template>

<script>
import {
  prefixStyle
} from '../../common/helpers/dom.js'

const TRANSFORM = prefixStyle('transform')

const COMPONENT_NAME = 'vi-native-sticky'

const EVENT_STICKY_CHANGE = 'sticky-change'
const EVENT_STICKY_CANCEL = 'sticky-cancel'
const EVENT_STICKY_REMOVE_MERGE = 'sticky-remove-merge'

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      ViNativeSticky: this
    }
  },
  props: {
    scrollY: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    data: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    isUseAbsolute: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fixedStyle: {},
      fixedVisable: false,
      stickyMap: {},
      diff: 0,
      transformTop: 0,
      listHeight: [],
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.$nextTick(() => {
          this.recalculate()
        })
      },
    },
    scrollY: {
      handler(newVal) {
        this.watchScrollY(newVal)
      }
    },
    diff: {
      handler(newVal) {
        // 如果已经在吸顶了
        if (this.current === this.currentSticky && this.fixedVisable) {
          return
        }
        this.current = this.currentSticky
        this.fixedVisable = true
        if (this.isUseAbsolute) {
          this.fixedStyle = {
            'position': 'absolute',
            'top': `${0}px`,
            'z-index': this.zIndex,
            'width': `${this.currentSticky.clientWidth}px`,
            'height': `${this.currentSticky.clientHeight + 1}px`,
          }
        } else {
          this.fixedStyle = {
            'position': 'fixed',
            'top': `${this.fixedTop}px`,
            'z-index': this.zIndex,
            'width': `${this.currentSticky.clientWidth}px`,
            'height': `${this.currentSticky.clientHeight + 1}px`,
          }
        }
        this.reset()
        const element = this.currentSticky.$el
        this.fixedElement.appendChild(element)
        this.$emit(EVENT_STICKY_CHANGE, this.currentSticky)
      }
    },
    transformTop: {
      handler(newVal) {
        let fixTransformTop = newVal > 0 ? -newVal : 0
        if (this.fixTransformTop === fixTransformTop) {
          return
        }
        this.fixTransformTop = fixTransformTop
        this.fixedElement.style[TRANSFORM] = `translateY(${fixTransformTop}px)`
      }
    }
  },
  mounted() {
    this._findFixedElement()
    this.recalculate()
  },
  methods: {
    watchScrollY(newVal) {
      if (newVal < 0) {
        return
      }
      let length = this.listHeight.length
      if (!length) {
        return
      }
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
          this.transformTop = item1.clientHeight - nextDiff
          return
        } else if (item2 && newVal >= item2.stickyTop) {
          let nextDiff = item2.stickyTop - newVal
          let transformTop = item1.clientHeight - nextDiff
          if (!item3) {
            // 如果后面再没有了
            this.currentSticky = this.stickyMap[item2.eleKey]
            this.transformTop = 0
            this.diff = newVal - item2.stickyTop
            return
          } else {
            continue
          }
        } else {
          this.reset()
        }
      }
      this.fixedStyle = {}
      this.fixedVisable = false
    },
    recalculate() {
      this._calculateFixedTop()
      this.calculateAllStickyEleTop()
    },
    _findFixedElement() {
      if (!this.$refs.fixed) {
        return
      }
      this.fixedElement = this.$refs.fixed
    },
    _calculateFixedTop() {
      this.fixedTop = this.$refs.sticky.getBoundingClientRect().top
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
    },
  }
}
</script>

<style lang="stylus">
.vi-native-sticky
  height: 100%
  position: relative
</style>

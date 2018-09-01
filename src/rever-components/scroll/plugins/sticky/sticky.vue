<template>
  <div class="rever-sticky">
    <slot></slot>
    <div ref="fixed" :style="fixedStyle" v-show="fixedVisable">
      <slot name="fixed"><div></div></slot>
    </div>
  </div>
</template>

<script>

import {
  getRect,
  prefixStyle
} from '@/common/helpers/dom.js'

const COMPONENT_NAME = 'rever-sticky'

const EVENT_CHANGE = 'change'

const transformStyleKey = prefixStyle('transform')

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      Sticky: this
    }
  },
  inject: ['Scroll'],
  props: {
    zIndex: {
      type: Number,
      default: 30
    },
    data: {
      type: Array,
      default() {
        return []
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
      listHeight: []
    }
  },
  created() {
    this.Scroll.$on('scroll', this.scrollHandle)
  },
  mounted() {
    this._calculateStickyTop()
    this._findFixedElement()
  },
  watch: {
    scrollY(newVal) {
      let length = this.listHeight.length
      if (!length) {
        return
      }

      for (let i = 0; i < length; i++) {
        let item1 = this.listHeight[i]
        let item2 = this.listHeight[i + 1]
        if (!item2 && newVal >= item1.stickyTop) {
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          break
        } else if (item2 && newVal > item1.stickyTop && newVal < item2.stickyTop) {
          this.currentSticky = this.stickyMap[item1.eleKey]
          this.diff = newVal - item1.stickyTop
          this.nextDiff = item2.stickyTop - newVal
          this.transformTop = item1.clientHeight - this.nextDiff
          break
        } else if (item2 && newVal >= item2.stickyTop) {
          this.currentSticky = this.stickyMap[item2.eleKey]
          this.transformTop = 0
          this.diff = newVal - item2.stickyTop
          break
        } else {
          this.fixedVisable = false
          return
        }
      }

      // 这种scroll包裹着sticky的做法导致fixed无法使用(fixed是相对body的)
      // 而不得使用absolute
      // 然而不停得重绘位置导致抖动
      requestAnimationFrame(() => {
        this.fixedElement.style.top = `${this.scrollY}px`
      })
    },
    diff(newVal) {
      // 如果已经在吸顶了
      if (this.current === this.currentSticky && this.fixedVisable) {
        return
      }
      this.current = this.currentSticky
      this.fixedVisable = true
      this.fixedStyle = {
        'position': 'fixed',
        'top': `${this.scrollY}px`,
        'width': `${this.currentSticky.$el.firstElementChild.clientWidth}px`,
        'z-index': this.zIndex
      }
      this.fixedElement.removeChild(this.fixedElement.firstElementChild)
      const clone = this.currentSticky.$el.firstElementChild.cloneNode(true)
      this.fixedElement.appendChild(clone)
      this.$emit(EVENT_CHANGE, this.currentSticky.eleKey)
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
    scrollHandle({ y }) {
      this.scrollY = Math.abs(y)
    },
    _findFixedElement() {
      if (!this.$refs.fixed) {
        return
      }
      this.fixedElement = this.$refs.fixed
    },
    _calculateStickyTop() {
      this.stickyTop = this.$el.getBoundingClientRect().top
    },
    calculateListHeight() {
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
      this.current = null
    },
    refresh() {
      this.Scroll && this.Scroll.refresh()
    },
    scrollTop() {
      this.Scroll && this.Scroll.scrollTo(0, 0, 0)
    }
  }
}
</script>

<style lang="stylus" scoped>
.rever-sticky
  position: relative
  height: 100%
  overflow: hidden
</style>

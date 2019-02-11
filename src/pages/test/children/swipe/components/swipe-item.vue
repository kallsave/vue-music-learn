<template>
  <div ref="swipeItem"
    class="cube-swipe-item"
    @transitionend="onTransitionEnd"
    @touchstart.stop.prevent="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend.stop.prevent="onTouchEnd">
    <slot></slot>
    <ul class="cube-swipe-btns">
      <li ref="btns"
        class="cube-swipe-btn"
        v-for="(btn, index) in btns" :key="index"
        :style="genBtnStyl(btn)"
        @click.prevent="clickBtn(btn)">
        <span class="text">{{btn.text}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getRect,
  prefixStyle
} from '@/common/helpers/dom.js'

const COMPONENT_NAME = 'cube-swipe-item'
const EVENT_ITEM_CLICK = 'item-click'
const EVENT_BTN_CLICK = 'btn-click'
const EVENT_SCROLL = 'scroll'
const EVENT_ACTIVE = 'active'
const DIRECTION_LEFT = 1
const DIRECTION_RIGHT = -1
const STATE_SHRINK = 0
const STATE_GROW = 1
const easingTime = 600
const momentumLimitTime = 300
const momentumLimitDistance = 15
const directionLockThreshold = 5

const transform = prefixStyle('transform')
const transitionProperty = prefixStyle('transitionProperty')
const transitionDuration = prefixStyle('transitionDuration')
const transitionTimingFunction = prefixStyle('transitionTimingFunction')

export const easeOutCubic = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

export default {
  name: COMPONENT_NAME,
  inject: ['swipe'],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    btns: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number,
      index: -1
    },
    autoShrink: {
      type: Boolean,
      default: false
    }
  },
  created() {
    // transform距离
    this.x = 0
    // 收缩状态
    this.state = STATE_SHRINK
    this.swipe.addItem(this)
    this.$on(EVENT_SCROLL, this._handleBtns)
  },
  mounted() {
    this.scrollerStyle = this.$refs.swipeItem.style
    this._initCachedBtns()
    this._calculateBtnsWidth()
  },
  methods: {
    // 计算按钮的原始宽度
    _initCachedBtns() {
      this.cachedBtns = []
      const len = this.$refs.btns.length
      for (let i = 0; i < len; i++) {
        this.cachedBtns.push({
          width: getRect(this.$refs.btns[i]).width
        })
      }
    },
    // 计算最大的滚动距离
    _calculateBtnsWidth() {
      let width = 0
      const len = this.cachedBtns.length
      for (let i = 0; i < len; i++) {
        width += this.cachedBtns[i].width
      }
      this.maxScrollX = -width
    },
    genBtnStyl(btn) {
      return `background: ${btn.color}`
    },
    onTouchStart(e) {
      this.moved = false
      this.movingDirectionX = 0
      const point = e.touches[0]
      this.pointX = point.pageX
      this.pointY = point.pageY
      this.distX = 0
      this.distY = 0
      this.startX = this.x
      this._transitionTime()
      this.startTime = new Date().getTime()
    },
    onTouchMove(e) {
      const point = e.touches[0]
      let deltaX = point.pageX - this.pointX
      let deltaY = point.pageY - this.pointY
      this.pointX = point.pageX
      this.pointY = point.pageY

      this.distX += deltaX
      this.distY += deltaY

      let absDistX = Math.abs(this.distX)
      let absDistY = Math.abs(this.distY)

      let timestamp = new Date().getTime()

      this.movingDirectionX = deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0

      let newX = this.x + deltaX
      if (newX > 0) {
        newX = 0
      }
      if (newX < this.maxScrollX) {
        newX = this.x + deltaX / 3
      }
      if (!this.moved) {
        this.moved = true
      }
      this._translate(newX, true)
      if (timestamp - this.startTime > momentumLimitTime) {
        this.startTime = timestamp
        this.startX = this.x
      }

      this.$emit(EVENT_SCROLL, this.x)
    },
    onTouchEnd() {
      this.endTime = new Date().getTime()
      let duration = this.endTime - this.startTime
      let absDistX = Math.abs(this.x - this.startX)
      if ((duration < momentumLimitTime && absDistX > momentumLimitDistance) || this.x < this.maxScrollX / 2) {
        this.grow()
      } else {
        this.shrink()
      }
    },
    onTransitionEnd() {

    },
    _handleBtns(x, isUseTransition) {
      if (this.btns.length === 0) {
        return
      }
      const len = this.$refs.btns.length
      let delta = 0
      let totalWidth = -this.maxScrollX
      for (let i = 0; i < len; i++) {
        const btn = this.$refs.btns[i]
        let rate = (totalWidth - delta) / totalWidth
        let width
        // btn要位移上一个btn的宽度(当x === this.maxScrollX)
        let translate = (-delta / totalWidth) * x
        if (x < this.maxScrollX) {
          width = this.cachedBtns[i].width + rate * (this.maxScrollX - x)
        } else {
          width = this.cachedBtns[i].width
        }
        delta += this.cachedBtns[i].width

        // 在滚动时,btn的位移不应该出现过渡效果
        if (!isUseTransition) {
          btn.style[transitionDuration] = '0ms'
        } else {
          btn.style[transform] = `translate(${translate}px,0) translateZ(0)`
          btn.style[transitionProperty] = 'all'
          btn.style[transitionTimingFunction] = easeOutCubic
          btn.style[transitionDuration] = `${easingTime}ms`
        }
        btn.style.width = `${width}px`
        btn.style[transform] = `translate(${translate}px)`
      }
    },
    _translate(x, useZ) {
      let translateZ = useZ ? ' translateZ(0)' : ''
      this.scrollerStyle[transform] = `translate(${x}px,0)${translateZ}`
      this.x = x
    },
    scrollTo(x, time, easing) {
      this.scrollerStyle[transitionProperty] = ''
      this.scrollerStyle[transitionTimingFunction] = easing
      this.scrollerStyle[transitionDuration] = `${time}ms`
      this._transitionTime(easingTime)
      this._translate(x, true)
      if (time) {
        this.isInTransition = true
      }
    },
    grow() {
      this.state = STATE_GROW
      const extend = this.x < this.maxScrollX
      let easing = easeOutCubic
      this.scrollTo(this.maxScrollX, easingTime, easing)
      // this._translateBtns(easingTime, easing, extend)
      this._handleBtns(this.maxScrollX, true)
    },
    shrink() {

    },
    _translateBtns(time, easing, extend) {
      /* istanbul ignore if */
      if (this.btns.length === 0) {
        return
      }
      const len = this.$refs.btns.length
      let delta = 0
      let translate = 0
      for (let i = 0; i < len; i++) {
        const btn = this.$refs.btns[i]
        if (this.state === STATE_GROW) {
          translate = delta
        } else {
          translate = 0
        }
        delta += this.cachedBtns[i].width
        btn.style[transform] = `translate(${translate}px,0) translateZ(0)`
        btn.style[transitionProperty] = 'all'
        btn.style[transitionTimingFunction] = easing
        btn.style[transitionDuration] = `${time}ms`
        if (extend) {
          btn.style.width = `${this.cachedBtns[i].width}px`
        }
      }
    },
    clickBtn() {

    },
  }
}
</script>

<style lang="stylus" scoped>
.cube-swipe-item
  position: relative

.cube-swipe-item-inner
  height: 60px
  line-height: 60px
  font-size: 20px
  padding-left: 20px

.cube-swipe-btn
  display: flex
  align-items: center
  position: absolute
  top: 0
  left: 100%
  height: 100%
  text-align: left
  font-size: 20px
  // transition: none
  .text
    flex: 1
    padding: 0 20px
    white-space: nowrap
    color: #fff
</style>

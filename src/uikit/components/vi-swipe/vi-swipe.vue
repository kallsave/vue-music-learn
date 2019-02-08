<template>
  <div class="vi-swipe-item-wrapper">
    <div ref="swipeItem"
      class="vi-swipe-item"
      @transitionend="transitionendHandler"
      @touchstart.stop="touchstartHandler"
      @touchmove.stop="touchmoveHandler"
      @touchend.stop="touchendHandler">
      <slot></slot>
      <div class="menu-wrapper" ref="menuWrapper">
        <slot name="menu">
          <div class="vi-swipe-menu">
            <div class="vi-swipe-menu-item">删除</div>
            <div class="vi-swipe-menu-item">删除</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-swipe'

const TRANSFORM = prefixStyle('transform')
const TRANSFORM_PROPERTY = prefixStyle('transitionProperty')
const TRANSFORM_DURATION = prefixStyle('transitionDuration')
const TRANSFORM_TIMING_FUNCTION = prefixStyle('transitionTimingFunction')
const TRANSITION = prefixStyle('transition')

const DIRECTION_LEFT = 1
const DIRECTION_RIGHT = -1
const momentumLimitTime = 300

export default {
  name: COMPONENT_NAME,
  props: {
    directionLockThreshold: {
      type: Number,
      default: 5
    },
    menu: {
      type: Array,
      default() {
        return {}
      }
    },
    threshold: {
      type: Number,
      default: 20
    }
  },
  created() {
    this.x = 0
  },
  mounted() {
    this._findScrollerStyle()
    this._calculateMaxScrollX()
    this._calculateThreshold()
    this.scrollerStyle[TRANSITION] = 'all 0.3s'
  },
  methods: {
    touchstartHandler(e) {
      const point = e.touches[0]
      this.pointX = point.pageX
      this.moved = false
      this.startX = this.x
      this.startTime = new Date().getTime()
    },
    touchmoveHandler(e) {
      const point = e.touches[0]
      // 距离上一次位置的距离
      let deltaX = point.pageX - this.pointX
      this.pointX = point.pageX
      // 从开始滚动到当前位置的位移
      this.distX += deltaX
      // 位移
      let absDistX = Math.abs(this.distX)

      if (deltaX > 0) {
        this.movingDirectionX = DIRECTION_RIGHT
      } else if (deltaX < 0) {
        this.movingDirectionX = DIRECTION_LEFT
      } else {
        this.movingDirectionX = 0
      }

      let timestamp = new Date().getTime()

      let newX = this.x + deltaX
      if (newX > 0) {
        newX = 0
      }
      if (newX < this.maxScrollX) {
        newX = this.maxScrollX
      }
      this._translate(newX)

      // 如果在移动的过程中有停留,相当于重新开始
      if (timestamp - this.startTime > momentumLimitTime) {
        this.startTime = timestamp
        this.startX = this.x
      }
    },
    touchendHandler(e) {

    },
    _findScrollerStyle() {
      this.scrollerStyle = this.$refs.swipeItem.style
    },
    _transitionProperty(property = 'transform') {
      this.scrollerStyle[TRANSFORM_PROPERTY] = property
    },
    _transitionTimingFunction(easing) {

    },
    _transitionTime(time) {

    },
    _translate(x) {
      this.scrollerStyle[TRANSFORM] = `translate(${x}px, 0)`
      this.x = x
    },
    _calculateMaxScrollX() {
      let children = this.$refs.menuWrapper.children
      let len = children.length
      let width = 0
      for (let i = 0; i < len; i++) {
        width += children[i].clientWidth
      }
      this.maxScrollX = -width
    },
    _calculateThreshold() {
      if (this.threshold + this.maxScrollX > 0) {
        this._threshold = this.maxScrollX
      } else {
        this._threshold = this.threshold
      }
    },
    transitionendHandler() {
      console.log(666)
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"

.vi-swipe-item-wrapper
  overflow: hidden
  .vi-swipe-item
    position: relative
    .vi-swipe-menu
      display: flex
      position: absolute
      left: 100%
      top: 0
      height: 100%
      .vi-swipe-menu-item
        flex: 1
        display: flex
        align-items:center
        padding: 0 20px
        height: 100%
        font-size: $font-size-medium-xxx
        white-space: nowrap
        background-color: red
</style>

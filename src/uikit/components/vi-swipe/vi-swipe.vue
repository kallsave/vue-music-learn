<template>
  <div ref="swipe"
    class="vi-swipe"
    @touchstart="touchstartHandler"
    @touchmove="touchmoveHandler"
    @touchend="touchendHandler"
    @transitionend="transitionendHandler"
    @click="clickHandler">
    <slot></slot>
    <ul class="vi-swipe-menu-list">
      <li ref="menu"
        class="vi-swipe-menu"
        v-for="(menu, index) in menuList" :key="index"
        v-html="menu.content"
        :style="setMenuStyle(menu)"
        @click.stop.prevent="clickMenu(menu)"></li>
    </ul>
  </div>
</template>

<script>
import {
  getRect,
  prefixStyle
} from '../../common/helpers/dom.js'

import {
  EASE_OUT_QUART,
} from '../../common/helpers/ease.js'

const COMPONENT_NAME = 'vi-swipe'

const EVENT_MENU_CLICK = 'menu-click'
const EVENT_START = 'start'
const EVENT_SCROLL = 'scroll'

const DIRECTION_LEFT = 1
const DIRECTION_RIGHT = -1
const STATE_SHRINK = 0
const STATE_GROW = 1
const EASING_TIME = 600
const MOMENTUMLIMIT_TIME = 300
const MOMENTUMLIMIT_DISTANCE = 15
const AFTER_SHRINK_TIME = 100

const TRANSFORM = prefixStyle('transform')
const TRANSITION = prefixStyle('transition')
const TRANSITION_PROPERTY = prefixStyle('transitionProperty')
const TRANSITION_DURATION = prefixStyle('transitionDuration')
const TRANSITION_TIMING_FUNCTION = prefixStyle('transitionTimingFunction')

const DEFAULT_MENU_LIST = [
  {
    isAutoShrink: true,
    content: '取消',
    style: {
      'background-color': '#c8c7cd',
      'color': '#fff'
    }
  },
  {
    isAutoShrink: false,
    content: '删除',
    style: {
      'background-color': '#ff3a32',
      'color': '#fff'
    }
  }
]

export default {
  name: COMPONENT_NAME,
  inject: {
    swipeGroup: {
      default: null
    }
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return DEFAULT_MENU_LIST
      }
    },
    index: {
      type: Number,
      default: -1,
      required: !!this.swipeGroup
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 锁定方向
    // 1的时候是45度角
    // 越小越不容易触发切换
    directionLockThreshold: {
      type: Number,
      default: 0.8
    },
  },
  created() {
    // transform距离
    this.x = 0
    // 收缩状态
    this.state = STATE_SHRINK
    this.swipeGroup && this.swipeGroup.addItem(this)
  },
  mounted() {
    this._initScroller()
    this._initCachedMenus()
    this._calculateMaxScrollX()
  },
  methods: {
    _initScroller() {
      this.scrollerStyle = this.$refs.swipe.style
      this.scrollerStyle[TRANSITION_PROPERTY] = 'transform'
      this.scrollerStyle[TRANSITION_TIMING_FUNCTION] = EASE_OUT_QUART
    },
    // 计算按钮的原始宽度
    _initCachedMenus() {
      this.cachedMenus = []
      const len = this.$refs.menu.length
      for (let i = 0; i < len; i++) {
        const menu = this.$refs.menu[i]
        const menuStyle = menu.style
        this.cachedMenus.push({
          width: getRect(menu).width
        })
        menuStyle[TRANSITION_PROPERTY] = 'all'
        menuStyle[TRANSITION_TIMING_FUNCTION] = EASE_OUT_QUART
      }
    },
    // 计算最大的滚动距离
    _calculateMaxScrollX() {
      let width = 0
      const len = this.cachedMenus.length
      for (let i = 0; i < len; i++) {
        width += this.cachedMenus[i].width
      }
      this.maxScrollX = -width
    },
    setMenuStyle(menu) {
      return menu.style
    },
    touchstartHandler(e) {
      if (this.disabled) {
        return
      }
      this.swipeGroup && this.swipeGroup.activeItem(this.index)
      this.$emit(EVENT_START, this.index)
      this.moved = false
      this.movingDirectionX = 0
      const point = e.touches[0]
      this.pointX = point.pageX
      this.pointY = point.pageY
      this.distX = 0
      this.distY = 0
      this.startX = this.x
      this.startTime = new Date().getTime()
    },
    touchmoveHandler(e) {
      if (this.moved) {
        e.stopPropagation()
        this.clearTimer()
      }
      if (this.disabled) {
        return
      }
      if (this.isInTransition) {
        return
      }
      const point = e.touches[0]
      let deltaX = point.pageX - this.pointX
      let deltaY = point.pageY - this.pointY
      this.pointX = point.pageX
      this.pointY = point.pageY

      this.distX += deltaX
      this.distY += deltaY

      let directionLockThreshold = Math.abs(this.distY / this.distX)

      if (directionLockThreshold > this.directionLockThreshold) {
        return
      }

      let newX = this.x + deltaX
      if (newX > 0) {
        newX = 0
      }
      if (newX < this.maxScrollX) {
        newX = this.x + deltaX / 3
      }
      if (!this.moved) {
        this.moved = true
        this.scrollerStyle[TRANSITION_DURATION] = `${0}ms`
      }

      let timestamp = new Date().getTime()
      if (timestamp - this.startTime > MOMENTUMLIMIT_TIME) {
        this.startTime = timestamp
        this.startX = this.x
      }

      this._translate(newX)
      this._translateMenus(this.x)

      this.$emit(EVENT_SCROLL, this.x)
    },
    touchendHandler(e) {
      if (this.disabled) {
        return
      }
      if (this.moved) {
        e.stopPropagation()
      }
      if (this.x <= this.maxScrollX) {
        this.grow()
        this.isInTransition = false
        return
      }
      if (this.x >= 0) {
        this.shrink()
        this.isInTransition = false
        return
      }
      this.endTime = new Date().getTime()
      let duration = this.endTime - this.startTime
      let distX = this.x - this.startX
      if (duration < MOMENTUMLIMIT_TIME && -distX > MOMENTUMLIMIT_DISTANCE) {
        this.grow()
      } else if (duration < MOMENTUMLIMIT_TIME && distX > MOMENTUMLIMIT_DISTANCE) {
        this.shrink()
      } else {
        if (this.state === STATE_SHRINK) {
          this.shrink()
        } else {
          this.grow()
        }
      }
    },
    clickHandler(e) {
      if (this.state === STATE_GROW) {
        e.stopPropagation()
        this.shrinkTimer = window.setTimeout(() => {
          this.shrink()
        }, AFTER_SHRINK_TIME)
      }
    },
    _translateMenus(x, isUseTransition) {
      if (this.menuList.length === 0) {
        return
      }
      const len = this.$refs.menu.length
      let delta = 0
      let totalWidth = -this.maxScrollX
      for (let i = 0; i < len; i++) {
        const menu = this.$refs.menu[i]
        const menuStyle = menu.style
        let rate = (totalWidth - delta) / totalWidth
        let width
        let translate = (-delta / totalWidth) * x
        if (x < this.maxScrollX) {
          width = this.cachedMenus[i].width + rate * (this.maxScrollX - x)
        } else {
          width = this.cachedMenus[i].width
        }
        delta += this.cachedMenus[i].width

        // 在滚动时,menu的位移不应该出现过渡效果
        if (!isUseTransition) {
          menuStyle.width = `${width}px`
          menuStyle[TRANSITION_DURATION] = '0ms'
          menuStyle[TRANSFORM] = `translate(${translate}px)`
        } else {
          menuStyle.width = `${this.cachedMenus[i].width}px`
          menuStyle[TRANSITION_DURATION] = `${EASING_TIME}ms`
          menuStyle[TRANSFORM] = `translate(${translate}px)`
        }
      }
    },
    _translate(x) {
      this.scrollerStyle[TRANSFORM] = `translate(${x}px,0)`
      this.x = x
    },
    scrollTo(x) {
      this.isInTransition = true
      this.scrollerStyle[TRANSITION_DURATION] = `${EASING_TIME}ms`
      this._translate(x)
    },
    grow() {
      this.state = STATE_GROW
      this.scrollTo(this.maxScrollX)
      this._translateMenus(this.maxScrollX, true)
    },
    shrink() {
      this.state = STATE_SHRINK
      this.scrollTo(0)
      this._translateMenus(0, true)
    },
    transitionendHandler() {
      this.isInTransition = false
    },
    clickMenu(menu) {
      if (menu.isAutoShrink) {
        this.shrink()
      }
      this.$emit(EVENT_MENU_CLICK, menu, this.index, this.shrink)
    },
    clearTimer() {
      window.clearTimeout(this.shrinkTimer)
      this.shrinkTimer = null
    }
  },
  destroyed() {
    this.swipeGroup && this.swipeGroup.removeItem(this)
    this.clearTimer()
  }
}
</script>

<style lang="stylus">
.vi-swipe
  position: relative
  .vi-swipe-menu-list
    .vi-swipe-menu
      display: flex
      align-items: center
      position: absolute
      top: 0
      left: 100%
      height: 100%
      text-align: left
      font-size: 18px
      padding: 0 20px
      white-space: nowrap
      color: #fff
</style>

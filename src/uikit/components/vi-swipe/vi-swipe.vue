<template>
  <div ref="swipe"
    class="vi-swipe"
    @touchstart.capture="touchstartHandler"
    @touchmove.capture="touchmoveHandler"
    @touchend.capture="touchendHandler"
    @transitionend="transitionendHandler"
    @click.capture="clickCaptureHandler">
    <slot></slot>
    <div ref="menuWrapper"
      class="vi-swipe-menu-wrapper">
      <div ref="menu"
        class="vi-swipe-menu"
        v-for="(menu, index) in menuList" :key="index"
        v-html="menu.content"
        :style="setMenuStyle(menu)"
        @click.stop.prevent="clickMenuHandler(menu)"></div>
      <div ref="confirmMenu"
        class="vi-swipe-confirm-menu"
        :style="setMenuStyle(confirmMenuOptions)"
        v-html="confirmMenuOptions.content"
        @click.stop="clickConfirmMenuHandler"></div>
    </div>
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

import {
  mulitDeepClone
} from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-swipe'

const EVENT_MENU_CLICK = 'menu-click'
const EVENT_START = 'start'
const EVENT_SCROLL = 'scroll'
const EVENT_CONFIRM = 'confirm'

const STATE_SHRINK = 'shrink'
const STATE_GROW = 'grow'
const MENU_DURATION_TIME = 600
const CONFIRM_MENU_DURATION_TIME = 200
const MOMENTUMLIMIT_TIME = 300
const MOMENTUMLIMIT_DISTANCE = 15
const AFTER_SHRINK_TIME = 100

const TRANSITION = prefixStyle('transition')
const TRANSITIONEND = prefixStyle('transitionend')
const TRANSFORM = prefixStyle('transform')
const TRANSITION_PROPERTY = prefixStyle('transitionProperty')
const TRANSITION_DURATION = prefixStyle('transitionDuration')
const TRANSITION_TIMING_FUNCTION = prefixStyle('transitionTimingFunction')

const DEFAULT_MENU_LIST = [
  {
    content: '取消',
    style: {
      'background-color': '#c8c7cd',
      'color': '#fff'
    }
  },
  {
    content: '删除',
    style: {
      'background-color': '#ff3a32',
      'color': '#fff'
    }
  }
]

const DEFAULT_CONFIRM_OPTIONS = {
  content: '确定删除',
  style: {
    'background-color': '#ff3a32',
    'color': '#fff'
  }
}

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
    confirmOptions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      confirmMenuOptions: {},
    }
  },
  watch: {
    menuList: {
      handler(newVal) {
        this._initCachedMenus()
        this._calculateMaxScrollX()
        this._initMenuWrapperStyle()
      }
    }
  },
  created() {
    // transform距离
    this.x = 0
    // 收缩状态
    this.state = STATE_SHRINK
    this.swipeGroup && this.swipeGroup.addItem(this)
    this.confirmMenuOptions = mulitDeepClone({}, DEFAULT_CONFIRM_OPTIONS)
  },
  mounted() {
    this._initCachedMenus()
    this._calculateMaxScrollX()
    this._initScrollerStyle()
    this._initMenuWrapperStyle()
    this._initConfirmMenuStyle()
  },
  methods: {
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
    _initScrollerStyle() {
      this.scrollerStyle = this.$refs.swipe.style
      this.scrollerStyle[TRANSITION_PROPERTY] = 'transform'
      this.scrollerStyle[TRANSITION_TIMING_FUNCTION] = EASE_OUT_QUART
    },
    _initMenuWrapperStyle() {
      let menuWrapperStyle = this.$refs.menuWrapper.style
      menuWrapperStyle.width = `${-this.maxScrollX}px`
    },
    _initConfirmMenuStyle() {
      let confirmMenuStyle = this.$refs.confirmMenu.style
      confirmMenuStyle[TRANSITION_PROPERTY] = 'all'
      confirmMenuStyle[TRANSITION_PROPERTY] = EASE_OUT_QUART
      confirmMenuStyle[TRANSITION_DURATION] = `${CONFIRM_MENU_DURATION_TIME}ms`
    },
    setMenuStyle(menu) {
      let menuStyle = {}
      menuStyle[TRANSITION_PROPERTY] = 'all'
      menuStyle[TRANSITION_TIMING_FUNCTION] = EASE_OUT_QUART
      return mulitDeepClone(menuStyle, menu.style)
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
      this._translateMenus(newX)

      this.$emit(EVENT_SCROLL, this.x)
    },
    touchendHandler(e) {
      if (this.moved) {
        e.stopPropagation()
      }
      if (this.disabled) {
        return
      }
      // this.x >= 0 说明touchmove阶段translate为零,不会触发transitionend
      if (this.x >= 0) {
        this.isInTransition = false
        this.state = STATE_SHRINK
        this._translateMenus(0, true)
        this.toggleConfirmMenu(false)
        return
      }

      let distX = this.x - this.startX
      // 说明是点击
      if (!distX) {
        let isSwipeMenuWrapper = this.isMenuWrapper(e.target)
        if (!isSwipeMenuWrapper) {
          this.shrink()
          return
        }
      }

      if (this.x <= this.maxScrollX) {
        this.grow()
        return
      }

      this.endTime = new Date().getTime()
      let duration = this.endTime - this.startTime
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
    isMenuWrapper(node) {
      if (node === this.$refs.menuWrapper) {
        return true
      } else if (node.parentNode) {
        return this.isMenuWrapper(node.parentNode)
      } else {
        return false
      }
    },
    clickCaptureHandler(e) {
      let isSwipeMenuWrapper = this.isMenuWrapper(e.target)
      if (this.state === STATE_GROW && !isSwipeMenuWrapper) {
        e.stopImmediatePropagation()
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
          menuStyle[TRANSITION_DURATION] = `${MENU_DURATION_TIME}ms`
          menuStyle[TRANSFORM] = `translate(${translate}px)`
        }
      }
    },
    toggleConfirmMenu(isShowConfirm) {
      const confirmMenuStyle = this.$refs.confirmMenu.style
      if (isShowConfirm) {
        confirmMenuStyle.display = 'flex'
        window.clearTimeout(this.reflowTimer)
        this.reflowTimer = window.setTimeout(() => {
          this._translateConfirmMenus(this.maxScrollX)
        }, 30)
      } else {
        confirmMenuStyle.display = 'none'
        window.clearTimeout(this.reflowTimer)
        this.reflowTimer = window.setTimeout(() => {
          this._translateConfirmMenus(0)
        }, 30)
      }
    },
    _translateConfirmMenus(x) {
      const confirmMenuStyle = this.$refs.confirmMenu.style
      confirmMenuStyle[TRANSFORM] = `translate(${x}px)`
    },
    _translate(x) {
      this.scrollerStyle[TRANSFORM] = `translate(${x}px, 0)`
      this.x = x
    },
    // 非手动滚动
    scrollTo(x) {
      this.isInTransition = true
      this.scrollerStyle[TRANSITION_DURATION] = `${MENU_DURATION_TIME}ms`
      this._translate(x)
    },
    grow() {
      this.action = STATE_GROW
      this.scrollTo(this.maxScrollX)
      this._translateMenus(this.maxScrollX, true)
    },
    shrink() {
      this.action = STATE_SHRINK
      this.scrollTo(0)
      this._translateMenus(0, true)
      this.toggleConfirmMenu(false)
    },
    transitionendHandler() {
      this.isInTransition = false
      this.state = this.action
    },
    clickMenuHandler(menu) {
      if (this.state === STATE_GROW) {
        this.$emit(EVENT_MENU_CLICK, menu, this.index, this.shrink, this.toggleConfirmMenu)
      }
    },
    clickConfirmMenuHandler() {
      this.$emit(EVENT_CONFIRM, this.index, this.shrink)
    },
    clearTimer() {
      window.clearTimeout(this.shrinkTimer)
      this.shrinkTimer = null
      window.clearTimeout(this.reflowTimer)
    },
  },
  beforeDestroy() {
    this.swipeGroup && this.swipeGroup.removeItem(this)
    this.clearTimer()
  }
}
</script>

<style lang="stylus">
.vi-swipe
  position: relative
  .vi-swipe-menu-wrapper
    position: absolute
    top: 0
    left: 100%
    height: 100%
    .vi-swipe-menu
      display: flex
      align-items: center
      position: absolute
      z-index: 1
      top: 0
      left: 0
      height: 100%
      font-size: 18px
      padding: 0 18px
      white-space: nowrap
      color: #fff
    .vi-swipe-confirm-menu
      display: none
      align-items: center
      justify-content: center
      position: absolute
      z-index: 2
      top: 0
      left: 100%
      width: 100%
      height: 100%
      font-size: 18px
      white-space: nowrap
      color: #fff
</style>

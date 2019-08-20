<template>
  <transition
    :name="transitionName"
    :duration="transitionDuration"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div ref="popup"
      class="vi-popup"
      v-show="isVisible"
      :style="popupStyle"
      @touchmove.prevent>
      <div class="vi-popup-mask"
        @touchstart="maskTouchstart($event)">
        <div class="vi-popup-mask-gray"
          v-show="isShowMask && !$slots.mask"></div>
        <slot name="mask"></slot>
        <template v-if="customMask">
          <div class="vi-popup-custom-mask" v-html="customMask"></div>
        </template>
      </div>
      <div class="vi-popup-content-center"
        v-if="$slots.default"
        @touchstart="contentTouchstartHandler($event)"
        @touchmove.stop="contentTouchmoveHandler($event)">
        <slot></slot>
      </div>
      <template v-if="$slots['custom-content']">
        <slot name="custom-content"></slot>
      </template>
    </div>
  </transition>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import popupMixin from '../../common/mixins/popup.js'

const COMPONENT_NAME = 'vi-popup'

const EVENT_MASK_CLICK = 'mask-click'
const EVENT_AFTER_ENTER = 'after-enter'
const EVENT_AFTER_LEAVE = 'after-leave'

export default {
  name: COMPONENT_NAME,
  mixins: [
    visibilityMixin,
    popupMixin
  ],
  props: {
    isShowMask: {
      type: Boolean,
      default: true
    },
    customMask: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 200
    },
    transitionName: {
      type: String,
      default: ''
    },
    transitionDuration: {
      type: Object,
      default() {
        return {
          enter: 0,
          leave: 0
        }
      }
    },
    // 有input框推荐开启
    isUseAbsolute: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popupStyle: {
        'z-index': this.zIndex
      },
    }
  },
  methods: {
    _setPopupStyle() {
      if (this.isUseAbsolute) {
        this.popupStyle['position'] = 'absolute'
        this.popupStyle['top'] = `${this.top}px`
        this.popupStyle['bottom'] = ''
        this.popupStyle['height'] = `100vh`
      } else {
        this.popupStyle['position'] = 'fixed'
        this.popupStyle['top'] = `0`
        this.popupStyle['bottom'] = `0`
      }
    },
    show() {
      this._setPopupStyle()
      this.isVisible = true
    },
    maskTouchstart(e) {
      this.$emit(EVENT_MASK_CLICK)
    },
    contentTouchstartHandler(e) {
      if (!this.isLockScroll) {
        return
      }
      this.startY = e.changedTouches[0].pageY
    },
    contentTouchmoveHandler(e) {
      if (!this.isLockScroll) {
        return
      }
      // currentTarget是最开始绑定事件的元素
      let currentTarget = e.currentTarget
      // 必须是第一个元素作为scrollWrapper
      let scrollWrapper = currentTarget.children[0]
      this.moveY = e.changedTouches[0].pageY
      let disY = this.moveY - this.startY
      let scrollTop = scrollWrapper.scrollTop
      let scrollHeight = scrollWrapper.scrollHeight
      let clientHeight = scrollWrapper.clientHeight
      // 修复ios弹窗内部滚动触发body滚动
      if (!scrollTop && disY >= 0) {
        e.preventDefault()
      } else if (scrollHeight - clientHeight <= scrollTop && disY <= 0) {
        e.preventDefault()
      }
    },
    afterEnter() {
      this.$emit(EVENT_AFTER_ENTER)
    },
    afterLeave() {
      this.$emit(EVENT_AFTER_LEAVE)
    }
  },
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"
@import "../../common/stylus/var/z-index.styl"

.vi-popup
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: $z-index-popup
  .vi-popup-mask
    position: absolute
    width: 100%
    height: 100%
  .vi-popup-mask-gray
    position: absolute
    width: 100%
    height: 100%
    background: $color-popup-background
  .vi-popup-content-center
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>

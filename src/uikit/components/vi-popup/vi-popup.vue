<template>
  <transition
    :name="transitionName"
    :duration="transitionDuration">
    <div ref="popop"
      class="vi-popup"
      v-show="isVisible"
      :style="popupStyle">
      <div class="vi-popup-mask"
        @touchstart="touchstart($event)">
        <div class="vi-popup-mask-gray"
          v-show="isShowMask && !$slots.mask"></div>
        <!-- 自定义背景板 -->
        <!-- slot的局限性在于只在两级组件中使用,不能多级组件传递 -->
        <slot name="mask"></slot>
        <!-- 自定义背景板,v-html可以多级调用结构 -->
        <!-- 对于需求变动过多的组件,比如dialog组件,使用createAPI的createElement来重写 -->
        <template v-if="customMask">
          <div class="vi-popup-custom-mask"
            @touchmove.prevent
            v-html="customMask"></div>
        </template>
      </div>
      <div class="vi-popup-content-center"
        v-if="$slots.default"
        @touchmove.prevent>
        <slot></slot>
      </div>
      <!-- 不是居中的content,自定义样式,或者可以做关闭按钮小组件插槽 -->
      <template v-if="$slots['custom-content']">
        <div class="vi-popup-custom-content"
          @touchmove.prevent>
          <slot name="custom-content"></slot>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import popupMixin from '../../common/mixins/popup.js'

const COMPONENT_NAME = 'vi-popup'

const EVENT_MASK_CLICK = 'mask-click'

export default {
  name: COMPONENT_NAME,
  mixins: [visibilityMixin, popupMixin],
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
    isLockScroll: {
      type: Boolean,
      default: true
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
  },
  data() {
    return {
      popupStyle: {
        'z-index': this.zIndex
      },
    }
  },
  mounted() {
    this._findInput()
    this._addEventListenerBlur()
  },
  methods: {
    show() {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      this._cachedTop = top
      this.isVisible = true
    },
    touchstart(e) {
      if (this.isLockScroll) {
        e.preventDefault()
      }
      this.$emit(EVENT_MASK_CLICK)
    },
    _findInput() {
      let popop = this.$refs.popop
      this.input = popop.getElementsByTagName('input')
      this.textarea = popop.getElementsByTagName('textarea')
    },
    _addEventListenerBlur() {
      Array.apply(null, this.input).forEach((item) => {
        item.addEventListener('blur', this.recoverTop, false)
      })
      Array.apply(null, this.textarea).forEach((item) => {
        item.addEventListener('blur', this.recoverTop, false)
      })
    },
    _removeEventListenerBlur() {
      Array.apply(null, this.input).forEach((item) => {
        item.removeEventListener('blur', this.recoverTop, false)
      })
      Array.apply(null, this.textarea).forEach((item) => {
        item.removeEventListener('blur', this.recoverTop, false)
      })
    },
    recoverTop() {
      window.scrollTo(0, this._cachedTop)
    }
  },
  beforeDestroy() {
    this._removeEventListenerBlur()
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"
@import "../../common/stylus/var/z-index.styl"

.vi-popup
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
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
  .vi-popup-custom-content
    z-index: 10
</style>

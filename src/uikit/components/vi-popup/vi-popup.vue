<template>
  <transition>
    <div class="vi-popup"
      v-show="isVisible"
      :style="{'z-index': zIndex}">
      <div class="vi-popup-mask"
        @click="maskClick"
        @touchmove="touchmove($event)">
        <div class="vi-popup-mask-gray" v-show="isShowMask && !$slots.mask"></div>
        <!-- 自定义背景板 -->
        <!-- slot的局限性在于只在两级组件中使用,不能多级组件传递 -->
        <slot name="mask"></slot>
        <!-- 自定义背景板,v-html可以多级调用结构 -->
        <!-- 对于需求变动过多的组件,比如dialog组件,使用createAPI的createElement来重写 -->
        <template v-if="customMask">
          <div class="vi-popup-custom-mask"
            v-html="customMask"></div>
        </template>
      </div>
      <div class="vi-popup-content-center"
        v-if="$slots.default"
        @touchmove.prevent>
        <slot></slot>
      </div>
      <!-- 不是居中的content,自定义样式,或者可以做关闭按钮小组件插槽 -->
      <template v-if="$slots.customContent">
        <div class="vi-popup-custom-content"
          @touchmove.prevent>
          <slot name="customContent"></slot>
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
    isMaskLock: {
      type: Boolean,
      default: true
    },
    isMaskCloseAble: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    maskClick() {
      // 考虑到popup外层要做transition
      // 不对最底层的maskClick自动关闭的功能
      this.$emit(EVENT_MASK_CLICK)
    },
    touchmove(e) {
      if (this.isMaskLock) {
        e.preventDefault()
      }
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"

.vi-popup
  position: fixed
  top: 0
  right: 0
  left: 0
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

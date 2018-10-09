<template>
  <div class="vi-popup" :style="{'z-index': zIndex}" v-show="isVisible">
    <div class="vi-popup-mask" :class="{'vi-popup-mask-active': mask}" @click="maskClick">
      <!-- 自定义背景板 -->
      <!-- slot的局限性在于只在两级组件中使用,不能多级组件传递 -->
      <slot name="mask"></slot>
      <!-- 自定义背景板,v-html可以多级调用结构 -->
      <!-- 对于需求变动过多的组件,比如dialog组件,使用createAPI的createElement来重写 -->
      <template v-if="customMask">
        <div class="vi-popup-custom-mask" v-html="customMask"></div>
      </template>
    </div>
    <div class="vi-popup-content-center" v-if="$slots.default">
      <slot></slot>
    </div>
    <!-- 不是居中的content,自定义样式,或者可以做关闭按钮小组件插槽 -->
    <template v-if="$slots.content">
      <slot name="content"></slot>
    </template>
  </div>
</template>

<script>
import visibilityMixin from '@/common/mixins/visibility.js'
import popupMixin from '@/common/mixins/popup.js'

const COMPONENT_NAME = 'vi-popup'

const EVENT_MASK_CLICK = 'mask-click'

export default {
  name: COMPONENT_NAME,
  mixins: [visibilityMixin, popupMixin],
  props: {
    mask: {
      type: Boolean,
      default: true
    },
    customMask: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 100
    }
  },
  methods: {
    maskClick() {
      this.$emit(EVENT_MASK_CLICK)
    },
  }
}
</script>

<style lang="stylus">
.vi-popup
  position: fixed
  top: 0
  right: 0
  left: 0
  bottom: 0
  // pointer-events是可以继承的
  // pointer-events: none
  .vi-popup-mask
    position: absolute
    width: 100%
    height: 100%
    // pointer-events: auto
  .vi-popup-content-center
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
.vi-popup-mask-active
  background: rgba(0, 0, 0, 0.6)
</style>

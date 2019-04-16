<template>
  <vi-popup v-show="isVisible"
    :is-show-mask="isShowMask"
    :is-lock-scroll="isLockScroll"
    :z-index="zIndex">
    <transition name="vi-toast-txt">
      <div class="vi-toast-txt"
        v-show="isVisible"
        :style="titleStyle">
        {{title}}
      </div>
    </transition>
  </vi-popup>
</template>

<script>
import durationMixin from '../../common/mixins/duration.js'

const COMPONENT_NAME = 'vi-toast-txt'
export default {
  name: COMPONENT_NAME,
  mixins: [
    durationMixin
  ],
  props: {
    title: {
      type: String,
      require: true
    },
    zIndex: {
      type: Number,
      default: 100
    },
    isShowMask: {
      type: Boolean,
      default: false
    },
    isLockScroll: {
      type: Boolean,
      default: true
    },
    titleStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
}
</script>

<style lang="stylus">
.vi-toast-txt
  box-sizing: border-box
  padding: 4px 20px
  color: #fff
  line-height: 30px
  border-radius: 9px
  background: rgba(0, 0, 0, .7)
  text-align: center
  font-size: 14px

.vi-toast-txt-enter-active
  animation: vi-toast-txt-in 0.2s ease
.vi-toast-txt-leave-active
  animation: vi-toast-txt-out 0.2s ease

@keyframes vi-toast-txt-in
  0%
    transform: scale(0.85)
    opacity: 0.8
  100%
    transform: scale(1)
    opacity: 1

@keyframes vi-toast-txt-out
  0%
    transform: scale(1)
    opacity: 1
  100%
    transform: scale(0.85)
    opacity: 0

</style>

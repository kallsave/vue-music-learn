<template>
  <vi-popup :mask="mask"
    v-show="isVisible"
    touchmove.prevent.native>
    <transition name="vi-toast-txt">
      <div v-show="isVisible"
        class="vi-toast-txt"
        :style="{'z-index': zIndex}">
        {{txt}}
      </div>
    </transition>
  </vi-popup>
</template>

<script>
import visibilityMixin from '@/common/mixins/visibility.js'

const COMPONENT_NAME = 'vi-toast-txt'
export default {
  name: COMPONENT_NAME,
  mixins: [visibilityMixin],
  props: {
    txt: {
      type: String,
      require: true
    },
    zIndex: {
      type: Number,
      default: 100
    },
    time: {
      type: Number,
      default: 0
    },
    mask: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    show() {
      this.isVisible = true
      this.clearTimer()
      this.$nextTick(() => {
        if (this.time !== 0) {
          this.timer = setTimeout(() => {
            this.hide()
          }, this.time)
        }
      })
    },
    hide() {
      this.isVisible = false
      this.clearTimer()
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  deactivated() {
    this.clearTimer()
  },
}
</script>

<style lang="stylus">
.vi-toast-txt
  border-box: border-box
  padding: 0 20px
  color: #fff
  line-height: 42px
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

<template>
  <div class="vi-progress-bar" ref="progressBar" @click="progressClick">
    <div class="vi-bar-inner">
      <div class="vi-progress" ref="progress"></div>
      <div ref="progressBtn" class="vi-progress-btn-wrapper"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd">
        <div class="vi-progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '@/common/helpers/dom.js'

const transform = prefixStyle('transform')

const progressBtnWidth = 16

const COMPONENT_NAME = 'vi-progress-bar'

const EVENT_PERCENT_CHANGE = 'percent-change'

export default {
  name: COMPONENT_NAME,
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {

  },
  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = newVal * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  methods: {
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      // e.touches[0].pageX是相对于目标元素左上角和鼠标之间的距离
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      )
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit(EVENT_PERCENT_CHANGE, percent)
    },
    progressClick(e) {
      // e.pageX鼠标指针位置相对于文档零点x坐标
      const rect = this.$refs.progressBar.getBoundingClientRect().left
      const offsetWidth = e.pageX - rect
      console.log(offsetWidth)
      this._offset(offsetWidth)
      this._triggerPercent()

      // e.offsetX 表示鼠标指针位置相对于触发事件的对象的x坐标。
      // 当我们点击progressBtn的时候,e.offsetX为零
      // this._offset(e.offsetX)
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

.vi-progress-bar
  height: 30px
  .vi-bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .vi-progress
      position: absolute
      height: 100%
      background: $color-theme
    .vi-progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .vi-progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>

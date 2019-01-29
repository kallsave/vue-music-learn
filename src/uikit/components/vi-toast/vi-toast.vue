<template>
  <vi-popup v-show="isVisible"
    :mask="mask"
    :z-index="zIndex"
    :lock="lock">
    <div class="vi-toast"
      :style="{'transform': `scale(${scale})`}">
      <div class="vi-toast-mask"
        :class="{'vi-toast-mask-active': toastMask}"></div>
      <div class="vi-toast-content">
        <div class="vi-toast-spinner-contain"
          v-if="icon === 'loading'" >
          <i class="vi-toast-spinner"
            :style="{'background-color': iconColor}"
            v-for="(item, index) in balde" :key="index"></i>
        </div>
        <transition name="vi-zoom">
          <div class="vi-toast-correct-contain"
            v-if="icon === 'correct'">
            <i class="vi-toast-icon-correct vi-toast-correct"
              :style="{'color': iconColor}"></i>
          </div>
        </transition>
        <transition name="vi-svg-path">
          <div class="vi-toast-svg-correct-contain"
            v-if="icon === 'svg-correct' && isVisible">
            <svg>
              <path class="vi-toast-svg-correct"
                transform="scale(0.25),translate(150 90)"
                fill="transparent"
                :stroke="iconColor"
                stroke-width="25"
                stroke-linecap="round"
                d="M10 80 L62.5 137.5 A5 5, 0 0,0 70 140 L190 20"></path>
            </svg>
          </div>
        </transition>
        <transition name="vi-zoom">
          <div class="vi-toast-error-contain"
              v-if="icon === 'error'">
            <i class="vi-toast-icon-error vi-toast-error"
              :style="{'color': iconColor}"></i>
          </div>
        </transition>
        <slot name="icon"></slot>
        <p class="vi-toast-title"
          :style="{'color': titleColor}">{{title}}</p>
      </div>
    </div>
  </vi-popup>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import ViPopup from '../vi-popup/vi-popup.vue'

const COMPONENT_NAME = 'vi-toast'

export default {
  name: COMPONENT_NAME,
  components: {
    ViPopup
  },
  mixins: [visibilityMixin],
  props: {
    mask: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '正在加载...'
    },
    toastMask: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Number,
      default: 1
    },
    titleColor: {
      type: String,
      default: '#fff'
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    icon: {
      type: String,
      default: 'loading'
    },
    time: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 100
    },
    lock: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      balde: 12
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
  destroyed() {
    this.clearTimer()
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"
@import "./fonts/vi-toast-icon.css"

.vi-toast
  box-sizing: border-box
  width: 125px
  min-height: 125px
  padding-bottom: 10px
  .vi-toast-mask
    position: absolute
    width: 100%
    height: 100%
    border-radius: 9px
  .vi-toast-mask-active
    background: rgba(0, 0, 0, .7)
  .vi-toast-content
    position: relative
    .vi-toast-spinner-contain
      position: relative
      height: 80px
      .vi-toast-spinner
        position: absolute
        left: 50%
        top: 50%
        width: 3px
        height: 10px
        border-radius: 3px
        opacity: .25
        background-color: #fff
        animation: spinner-fade 1s linear infinite
        for num in (1..12)
          &:nth-child({num})
            animation-delay: ((num - 1) / 12)s
            transform: rotate(30deg * (num - 6)) translateY(-150%)
    i[class^="vi-toast-icon"]
      box-sizing: border-box
      text-align: center
      display: block
      color: #fff
    .vi-toast-correct-contain
      .vi-toast-correct
        font-size: 60px
        padding: 13px 0px 7px 0px
    .vi-toast-svg-correct-contain
      height: 80px
      position: relative
      svg
        display: block
        height: 100%
        margin: 0
        padding: 0
    .vi-toast-error-contain
      .vi-toast-error
        font-size: 46px
        padding: 20px 0px 14px 0px
    .vi-toast-title
      font-size: $font-size-medium
      color: $color-text-l
      text-align: center
      line-height: 25px
      width: 100px
      margin: 0 auto

@keyframes spinner-fade
    0%
      opacity: .85
    50%
      opacity: .25
    100%
      opacity: .25

.vi-zoom-enter-active
  animation-name: vi-zoom
  animation-duration: 1s

// vue中做动画transtion下的根元素必须的动画时间
@keyframes vi-csstime
  0%
    opacity: 1
  100%
    opacity: 1

@keyframes vi-zoom
  0%
    transform: scale(0)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)

.vi-toast-svg-correct
  stroke-dasharray: 1000
  // 动画结束后css被动画的100%的样式覆盖
  animation-fill-mode: forwards
  // 或者直接写样式
  // stroke-dashoffset: 0

.vi-svg-path-enter-active
  animation-name: vi-csstime
  animation-duration: 1s
  // .vi-toast-svg-correct
  stroke-dasharray: 1000
  stroke-dashoffset: 1000
  animation-name: vi-svg-dash
  animation-duration: 1s

@keyframes vi-svg-dash
  0%
    stroke-dashoffset: 1000
  100%
    stroke-dashoffset: 0

</style>

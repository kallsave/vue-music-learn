<template>
  <vi-popup v-model="isVisible"
    :is-show-mask="isShowMask"
    :is-lock-scroll="isLockScroll"
    :z-index="zIndex"
    :transitionDuration="transitionDuration">
    <transition name="vi-toast-fade">
      <div class="vi-toast"
        v-show="isVisible"
        :style="{'transform': `scale(${scale})`}">
        <div class="vi-toast-mask"
          :class="{'vi-toast-mask-active': isShowToastMask}"></div>
        <div class="vi-toast-content">
          <transition :duration="{enter: 400, leave: 400}">
            <div class="vi-toast-spinner-contain"
              v-if="icon === 'loading' && isVisible">
              <i class="vi-toast-spinner"
                :style="{'background-color': iconColor}"
                v-for="(item, index) in balde" :key="index"></i>
            </div>
          </transition>
          <transition name="vi-toast-zoom"
            :duration="{enter: 400, leave: 400}">
            <div class="vi-toast-correct-contain"
              v-if="icon === 'correct' && isVisible">
              <i class="vi-toast-icon-correct vi-toast-correct"
                :style="{'color': iconColor}"></i>
            </div>
          </transition>
          <transition name="vi-svg-path"
            :duration="{enter: 1000, leave: 400}">
            <div class="vi-toast-svg-correct-contain"
              v-if="icon === 'svg-correct' && isVisible">
              <svg>
                <path class="vi-toast-svg-correct"
                  transform="scale(0.25)"
                  fill="transparent"
                  :stroke="iconColor"
                  stroke-width="25"
                  stroke-linecap="round"
                  d="M160 160 L212.5 217.5 A5 5, 0 0,0 220 220 L340 100"></path>
              </svg>
            </div>
          </transition>
          <transition name="vi-toast-zoom">
            <div class="vi-toast-error-contain"
                v-if="icon === 'error' && isVisible">
              <i class="vi-toast-icon-error vi-toast-error"
                :style="{'color': iconColor}"></i>
            </div>
          </transition>
          <slot name="icon"></slot>
          <p class="vi-toast-title"
            :style="{'color': titleColor}">{{title}}</p>
        </div>
      </div>
    </transition>
  </vi-popup>
</template>

<script>
import durationMixin from '../../common/mixins/duration.js'
import ViPopup from '../vi-popup/vi-popup.vue'

const COMPONENT_NAME = 'vi-toast'

export default {
  name: COMPONENT_NAME,
  components: {
    ViPopup
  },
  mixins: [
    durationMixin
  ],
  props: {
    isShowMask: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '正在加载...'
    },
    isShowToastMask: {
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
    zIndex: {
      type: Number,
      default: 100
    },
    isLockScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      balde: 12,
      transitionDuration: {
        enter: 400,
        leave: 400
      }
    }
  },
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"
@import "../../common/stylus/var/font-size.styl"
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
    overflow: hidden
  .vi-toast-mask-active
    background: rgba(0, 0, 0, .7)
  .vi-toast-content
    position: relative
    .vi-toast-spinner-contain
      position: relative
      box-sizing: content-box
      height: 80px
      .vi-toast-spinner
        position: absolute
        left: 50%
        top: 50%
        width: 3px
        height: 10px
        // margin-top: -5px
        margin-left: -1.5px
        border-radius: 3px
        opacity: .25
        background-color: #fff
        animation: vi-toast-spinner-fade 1s linear infinite
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
        margin: 0
        padding: 0
    .vi-toast-error-contain
      .vi-toast-error
        font-size: 46px
        padding: 20px 0px 14px 0px
    .vi-toast-title
      font-size: $font-size-medium
      text-align: center
      line-height: 25px
      width: 100px
      margin: 0 auto

.vi-toast-fade-leave
  opacity: 1

.vi-toast-fade-leave-active
  transition: opacity 400ms

.vi-toast-fade-leave-to
  opacity: 0

.vi-toast-zoom-enter-active
  animation-name: vi-toast-zoom
  animation-duration: 1000ms

.vi-toast-svg-correct
  stroke-dasharray: 1000
  // 动画结束后css被动画的100%的样式覆盖
  animation-fill-mode: forwards
  // 或者直接写样式
  // stroke-dashoffset: 0
.vi-svg-path-enter-active
  animation-name: vi-toast-svg-dash
  animation-delay: 400ms
  animation-duration: 1000ms
  stroke-dasharray: 1000
  stroke-dashoffset: 1000

@keyframes vi-toast-spinner-fade
  0%
    opacity: .85
  50%
    opacity: .25
  100%
    opacity: .25

@keyframes vi-toast-zoom
  0%
    transform: scale(0)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)

@keyframes vi-toast-svg-dash
  0%
    stroke-dashoffset: 1000
  100%
    stroke-dashoffset: 0

</style>

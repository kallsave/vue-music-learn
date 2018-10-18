<template>
  <transition :name="transition">
    <div class="vi-loading" v-show="isVisible" :style="style">
      <div class="vi-loading-content" :style="{transform: `scale(${scale})`}">
        <div class="vi-loading-spinner-content">
          <i class="vi-loading-spinner" :style="{'background-color': iconColor}"
            v-for="(item, index) in balde" :key="index"></i>
        </div>
        <p class="vi-loading-title" :style="{'color': titleColor}" v-text="title"></p>
      </div>
    </div>
  </transition>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import { prefixStyle } from '../../common/helpers/dom.js'

const transitionEnd = prefixStyle('transitionEnd')

const COMPONENT_NAME = 'vi-loading'

export default {
  name: COMPONENT_NAME,
  mixins: [visibilityMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    },
    titleColor: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 95
    },
  },
  data() {
    return {
      balde: 12,
      isListenedTransitionEnd: false
    }
  },
  mounted() {
  },
  computed: {
    style() {
      const commomStyle = {
        'z-index': this.zIndex
      }
      if (this.center) {
        return {
          ...commomStyle,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      } else {
        return commomStyle
      }
    },
    transition() {
      if (this.center) {
        return 'vi-loading-fade-out'
      } else {
        return 'vi-loading-slide-up'
      }
    }
  },
  methods: {
    hide() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        if (!this.isListenedTransitionEnd) {
          this.isListenedTransitionEnd = true
          this.$el.addEventListener(transitionEnd, this.transitionEndCallBack, true)
        }
        this.isVisible = false
      })
      return this.promise
    },
    transitionEndCallBack(e) {
      this.resolve(e)
    }
  },
  destroyed() {
    this.$el.removeEventListener(transitionEnd, this.transitionEndCallBack, true)
    this.promise = null
    this.resolve = null
  },

}
</script>

<style lang="stylus">
// TODO: 去掉variable.styl依赖,可以自定义样式
@import "~@/common/stylus/variable.styl"
.vi-loading
  // 父元素的高度是子元素撑开的
  // 当子元素margin-top向上移动时,被hidden掉,父元素的高度也自己减小
  overflow: hidden
  .vi-loading-content
    .vi-loading-spinner-content
      position: relative
      height: 30px
      margin-bottom: 15px
      .vi-loading-spinner
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
    .vi-loading-title
      font-size: $font-size-medium
      color: $color-text-l
      text-align: center
      line-height: 25px
      width: 80px
      margin: 0 auto

@keyframes spinner-fade
    0%
      opacity: .85
    50%
      opacity: .25
    100%
      opacity: .25

.vi-loading-slide-up-leave-active
  transition: all .4s
  .vi-loading-content
    transition: all .4s

.vi-loading-slide-up-leave-to
  .vi-loading-content
    // 70px是量出来的,不需要太准确
    margin-top: -70px

.vi-loading-fade-out-leave-to
  transition: all .4s
  .vi-loading-content
    transition: all .4s
    opacity: 0
</style>

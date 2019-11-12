
<template>
  <transition name="confirm-fade">
    <div :class="style['base-confirm']"
      v-show="isVisible"
      @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const COMPONENT_NAME = 'base-confirm'

export const EVENT_CONFIRM = 'confirm'
export const EVENT_CANCEL = 'cancel'

export default {
  name: COMPONENT_NAME,
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    console.log(this.$style)
  },
  methods: {
    show() {
      this.isVisible = true
    },
    hide() {
      this.isVisible = false
    },
    cancel() {
      this.hide()
      this.$emit(EVENT_CANCEL)
    },
    confirm() {
      this.hide()
      this.$emit(EVENT_CONFIRM)
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"

.base-confirm
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 500
  background-color: $color-background-d
  &:global.confirm-fade-enter-active
    animation: confirm-fade-in 0.3s
    .confirm-content
      animation: confirm-zoom 0.3s

  :global
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 13px
        background: $color-highlight-background
        .text
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $font-size-large
          color: $color-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-large
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid $color-background-d
            color: $color-text-d
            &.left
              border-right: 1px solid $color-background-d

@keyframes confirm-fade-in
    0%
      opacity: 0
    100%
      opacity: 1

@keyframes confirm-zoom
  0%
    transform: scale(0)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)
</style>

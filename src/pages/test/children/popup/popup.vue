<template>
  <div class="popup">
    <div style="width: 50px;height: 50px;background:red"
      @click="show"></div>
      <transition name="dialog-fade">
        <vi-popup ref="popup"
          v-show="isVisible"
          @mask-click="maskClick">
          <template slot="mask">
            <div class="custom-mask"></div>
          </template>
          <div class="popup-content">
            <img class="image" src="./images/dialog.jpg" />
            <div class="close" @click="close"></div>
          </div>
        </vi-popup>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    show() {
      this.isVisible = true
    },
    close() {
      this.isVisible = false
    },
    maskClick() {
      this.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"

.dialog-fade-enter-active
  animation-name: popup-in
  animation-duration: .5s
  animation-timing-function: $ease-out-in
  animation-direction: normal
  animation-fill-mode: forwards
  // .popup-content
  //   animation-name: popup-in
  //   animation-duration: .5s
  //   animation-timing-function: $ease-out-in
  //   animation-direction: normal
  //   animation-fill-mode: forwards

.dialog-fade-leave-active
  animation-name: no
  // animation-name: dialog-out
  animation-duration: .5s
  animation-timing-function: $ease-out-in
  // animation-direction: reverse
  animation-fill-mode: forwards
  .popup-content
    animation-name: dialog-out
    animation-duration: .5s
    animation-timing-function: $ease-out-in
    animation-direction: normal
    animation-fill-mode: forwards
  .custom-mask
    animation-name: popup-in
    animation-duration: .5s
    animation-timing-function: $ease-out-in
    animation-direction: reverse
    animation-fill-mode: forwards

@keyframes no
  0%
    opacity: 1
  100%
    opacity: 1

@keyframes popup-in
  0%
    transform: scale(1.185)
    opacity: 0
  100%
    transform: scale(1)
    opacity: 1

@keyframes dialog-out
  0%
    transform: scale(1)
    opacity: 1
  100%
    transform: translateY(-200px) scale(0.2)
    opacity: 0

.popup
  width: 100%
  height: 200vh
  background: #fff
  .custom-mask
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-image: url('./images/bg.jpg')
    background-size: cover
  .popup-content
    position: relative
    .image
      width: 250px
    .close
      position: absolute
      z-index: 2
      width: 80px
      height: 80px
      background: #000
      border-radius: 50%
      // transform后写的动画先执行
      transform: translate(105px, 10px) scale(0.5)
      transform-origin: 0 0
      &:before
        content: ''
        position: absolute
        width: 6px
        height: 45px
        top: 50%
        left: 50%
        border-radius: 6px
        background-color: #fff
        transform: translate(-50%, -50%) rotate(135deg)
      &:after
        content: ''
        position: absolute
        width: 6px
        height: 45px
        top: 50%
        left: 50%
        border-radius: 6px
        background-color: #fff
        transform: translate(-50%, -50%) rotate(-135deg)
    .more
      position: absolute
      width: 105px
      height: 41px
      bottom: 21px
      right: 14px
      background: peru
</style>

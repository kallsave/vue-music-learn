<template>
  <div class="wechat-popup">
    <div style="width: 50px;height: 50px;background:red"
      @click="show($event)"></div>
      <vi-popup ref="popup"
        transitionName="dialog-fade"
        :transitionDuration="transitionDuration"
        @mask-click="maskClick">
        <!-- <template slot="mask">
          <div class="custom-mask"></div>
        </template> -->
        <div class="popup-content">
          <div style="margin-bottom: 30px">
            <search-box></search-box>
          </div>
          <div style="margin-bottom: 30px">
            <search-box></search-box>
          </div>
          <div style="margin-bottom: 30px">
            <search-box></search-box>
          </div>
          <div class="close" @click="close"></div>
        </div>
      </vi-popup>
    <div style="width: 50px;height: 50px;background:red;position:absolute;top:1000px"
      @click="show($event)"></div>
  </div>
</template>

<script>
import SearchBox from '@/base-components/search-box/search-box.vue'

export default {
  components: {
    SearchBox
  },
  data() {
    return {
      transitionDuration: {
        enter: 500,
        leave: 500
      }
    }
  },
  methods: {
    maskClick() {

    },
    show(e) {
      this.$refs.popup.show()
    },
    close() {
      this.$refs.popup.hide()
    }
  }
}
</script>

<style lang="stylus" modules>
.wechat-popup
  width: 100%
  height: 200vh
  background: #fff
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

.dialog-fade-enter-active
  animation-name: popup-in
  animation-duration: .5s
  animation-timing-function: $ease-out-in
  animation-direction: normal
  animation-fill-mode: forwards

.dialog-fade-leave-active
  .popup-content
    animation-name: dialog-out
    animation-duration: .5s
    animation-timing-function: $ease-out-in
    animation-direction: normal
    animation-fill-mode: forwards
  .vi-popup-mask-gray
    animation-name: popup-in
    animation-duration: .5s
    animation-timing-function: $ease-out-in
    animation-direction: reverse
    animation-fill-mode: forwards

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
</style>

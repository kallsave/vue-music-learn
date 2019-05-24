<template>
  <div class="vi-upload">
    <div class="vi-upload-input-wrapper">
      <div class="vi-upload-input-wrapper-box"></div>
    </div>
    <div class="vi-upload-file"></div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-upload'

export default {
  name: COMPONENT_NAME,
  props: {
    action: {
      type: String,
      default: ''
    },
    isAuto: {
      type: Boolean,
      default: true
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    max: {
      type: Number,
      default: 1
    },
    fileType: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="stylus">
.vi-upload
  .vi-upload-input-wrapper
    display: inline-block
    margin: 0 10px 10px 0
    .vi-upload-input-wrapper-box
      position: relative
      width: 80px
      height: 80px
      box-sizing: border-box
      background-color: #fff
      box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08)
      border-radius: 2px
      &:before
        content: ""
        position: absolute
        top: 50%
        left: 50%
        width: 20px
        height: 2px
        background-color: #666
        transform: translate(-50%, -50%)
      &:after
        content: ""
        position: absolute
        top: 50%
        left: 50%
        width: 20px
        height: 2px
        background-color: #666
        transform: translate(-50%, -50%) rotate(90deg)
      .vi-upload-input
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        width: 100%
        font-size: 0
        opacity: 0

  .vi-upload-file
    display: inline-block
    margin: 0 10px 10px 0
    .vi-upload-file-box
      position: relative
      width: 80px
      height: 80px
      box-sizing: border-box
      background-color: #fff
      box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08)
      border-radius: 2px
      background-size: cover
      .vi-upload-file-delete
        position: absolute
        z-index: 2
        top: -36px
        right: -36px
        width: 80px
        height: 80px
        background: #000
        border-radius: 50%
        transform: scale(0.25)
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

</style>

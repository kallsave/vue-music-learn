<template>
  <div class="vi-slide-item">
    <slot>
      <a :href="item.linkUrl">
        <img :src="item.picUrl" @load="loadImage">
      </a>
    </slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-slide-item'

const EVENT_LOAD_IMAGE = 'load-image'

export default {
  name: 'vi-slide-item',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    loadImage() {
      this.$emit(EVENT_LOAD_IMAGE)
    },
  }
}
</script>

<style lang="stylus">
.vi-slide-item
  float: left
  a
    display: block
    overflow: hidden
    text-decoration: none
    img
      // 让img的空白像素去掉
      display: block
      // img width100%会穿透宽度自适应的div(比如float)而得到一个宽度
      // 上层的float不设置宽度会得到img的宽度
      // 然后width生效后得到一个height,又会把上层的float的高度生效
      // 所以slide-wrapper的高度应该由img撑起来的
      width: 100%
</style>

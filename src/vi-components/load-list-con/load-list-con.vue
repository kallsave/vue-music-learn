<!--load-list-con组件需要外部设置高度和 position:relative-->
<template>
  <!--封装组件要多加一个div,很烦-->
  <div class="vi-load-list-con-wrapper">
    <slot>
      <div class="vi-load-list-con"></div>
    </slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-load-list-con'
export default {
  name: COMPONENT_NAME
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"
.vi-load-list-con
  position: absolute
  bottom: 10px
  width: 100%
  padding: 0 10px
  box-sizing: border-box
  &:before,&:after
    height: 15px;
    background: $color-highlight-background
    margin: 7px 0 0
    content: ''
    display: block
  &:before
    width: 32%
  &:after
    width: 60%
</style>

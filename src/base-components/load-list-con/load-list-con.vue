<template>
  <div class="base-load-list-con-wrapper">
    <slot>
      <div class="base-load-list-con"></div>
    </slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'base-load-list-con'
export default {
  name: COMPONENT_NAME
}
</script>

<style lang="stylus">
// TODO: 自定义颜色
@import "~@/common/stylus/variable.styl"
.base-load-list-con
  position: absolute
  bottom: 10px
  width: 100%
  padding: 0 10px
  box-sizing: border-box
  &:before,&:after
    height: 15px
    background: $color-highlight-background
    margin: 7px 0 0
    content: ''
    display: block
  &:before
    width: 32%
  &:after
    width: 60%
</style>

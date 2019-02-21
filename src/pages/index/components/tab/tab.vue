<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link better-scroll">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link better-scroll">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link better-scroll">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link better-scroll">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang="stylus" scoped >
@import "~@/common/stylus/var/font-size.styl"
@import "~@/common/stylus/var/color.styl"

.tab
  display: flex
  height: 44px
  // background: peru
  // line-height会作用于行元素,和字体
  // 让行元素中的字体居中,所以行元素是有便捷作用的
  // span,a等不推荐给为inline-block,
  // 这样会使得span,a继承了inline-block而获得高度,丧失了布局的便利
  line-height: 44px
  font-size: $font-size-medium
  background: $color-background
  .tab-item
    flex: 1
    text-align: center
    .tab-link
      padding-bottom: 5px
      color: $color-text-l
      // background: gold
    &.router-link-active
      .tab-link
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>

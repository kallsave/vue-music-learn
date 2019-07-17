<template>
  <div :class="$style['tab']">
    <div class="tab-item"
      v-for="(item, index) in tabList"
      :key="index"
      :class="{'active': item.router.name === $route.name}"
      @touchstart="pageTurn(index)">
      <span class="tab-link">{{item.title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        {
          title: '推荐',
          router: {
            name: 'index-recommend',
          },
        },
        {
          title: '歌手',
          router: {
            name: 'index-singer',
          },
        },
        {
          title: '排行',
          router: {
            name: 'index-rank',
          },
        },
        {
          title: '搜索',
          router: {
            name: 'index-search',
          },
        },
      ],
    }
  },
  methods: {
    pageTurn(index) {
      this.$router.push(this.tabList[index].router)
    }
  }
}
</script>

<style lang="stylus" module>
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
  :global
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding: 0px 5px 5px 5px
        color: $color-text-l
        // background: gold
      &.active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>

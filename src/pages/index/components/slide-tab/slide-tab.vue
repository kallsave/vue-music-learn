<template>
  <div class="tab">
    <div class="tab-item better-scroll"
      :class="{'active': index === currentIndex}"
      v-for="(item, index) in data" :key="index"
      @click="handerClick(index)">
      <span class="tab-link better-scroll">{{item}}</span>
    </div>
    <div class="slider"></div>
  </div>
</template>

<script type="text/ecmascript-6">

const EVENT_CLICK_INDEX = 'click-index'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    initIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: this.initIndex
    }
  },
  watch: {
    initIndex: {
      handler(newVal) {
        this.currentIndex = newVal
      },
      immediate: true
    },
  },
  methods: {
    handerClick(index) {
      this.currentIndex = index
      this.$emit(EVENT_CLICK_INDEX, index)
    }
  }
}
</script>

<style lang="stylus" scoped >
@import "~@/common/stylus/variable"
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
    &.active
      .tab-link
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>

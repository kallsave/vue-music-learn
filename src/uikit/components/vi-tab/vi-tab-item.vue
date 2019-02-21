<template>
  <div class="vi-tab-item"
    :class="[selected ? activeClass : '']">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-tab-item'

const EVENT_SELECTED = 'selected'

export default {
  name: COMPONENT_NAME,
  props: {
    activeClass: {
      type: String,
      default: 'active'
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$emit(EVENT_SELECTED)
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.selected) {
        const isFlow = true
        this.$emit(EVENT_SELECTED, isFlow)
      }
    })
  },
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"
@import "../../common/stylus/var/font-size.styl"

.vi-tab-item
  flex: 1
  height: 44px
  line-height: 42px
  text-align: center
  box-sizing: border-box
  color: $color-text-l
  padding-bottom: 5px
  font-size: $font-size-medium
  &.active
    color: $color-theme
</style>

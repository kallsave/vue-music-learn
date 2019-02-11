<template>
  <div class="cube-swipe">
    <slot></slot>
  </div>
</template>

<script>
import CubeSwipeItem from './swipe-item.vue'

const COMPONENT_NAME = 'cube-swipe'
const EVENT_ITEM_CLICK = 'item-click'
const EVENT_BTN_CLICK = 'btn-click'
export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      swipe: this
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    autoShrink: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.activeIndex = -1
    this.items = []
  },
  methods: {
    addItem(item) {
      this.items.push(item)
    },
    onItemActive(index) {
      if (index === this.activeIndex) {
        return
      }
      if (this.activeIndex !== -1) {
        const activeItem = this.items[this.activeIndex]
        activeItem.shrink()
      }
      this.activeIndex = index
    }
  }
}
</script>

<style lang="stylus" scoped>
.cube-swipe
  overflow: hidden
</style>

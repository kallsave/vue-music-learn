<template>
  <div class="vi-swipe-group">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-swipe-group'

const EVENT_ACTIVE_INDEX_CHANGE = 'active-index-change'

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      swipeGroup: this
    }
  },
  props: {
    isRelative: {
      type: Boolean,
      default: true
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
    removeItem(item) {
      const index = this.items.indexOf(item)
      this.items.splice(index, 1)
      if (index <= this.activeIndex) {
        this.activeIndex -= 1
      }
    },
    activeItem(index) {
      if (index === this.activeIndex) {
        return
      }
      if (this.activeIndex !== -1) {
        const activeItem = this.items[this.activeIndex]
        if (this.isRelative) {
          activeItem.shrink()
          this.activeIndex = index
          this.$emit(EVENT_ACTIVE_INDEX_CHANGE, this.activeIndex)
        }
      }
    },
  }
}
</script>

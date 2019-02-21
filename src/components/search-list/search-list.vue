<template>
  <div class="search-list"
    v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item"
        v-for="item in searches" :key="item"
        @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon"
          @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
const EVENT_SELECT = 'select'
const EVENT_DELETE = 'delete'

export default {
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit(EVENT_SELECT, item)
    },
    deleteOne(item) {
      this.$emit(EVENT_DELETE, item)
    }
  }
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/mixin.styl"

.search-list
  .search-item
    display: flex
    align-items: center
    height: 40px
    overflow: hidden
    &.list-enter-active, &.list-leave-active
      transition: all 0.1s
    &.list-enter, &.list-leave-to
      height: 0
    .text
      flex: 1
      color: $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size: $font-size-small
        color: $color-text-d
</style>

<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box"
      v-model="query" :placeholder="placeholder"
      @input="inputHandler"
      @change="changeHandler"/>
    <i class="icon-dismiss" v-show="query"
      @click="clear"></i>
  </div>
</template>

<script>

const COMPONENT_NAME = 'base-search-box'
const EVENT_CHANGE = 'change'
const EVENT_INPUT = 'input'
const EVENT_CLEAR = 'clear'

export default {
  name: COMPONENT_NAME,
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      query: ''
    }
  },
  created() {
  },
  watch: {
    value(newVal) {
      this.query = newVal
    }
  },
  methods: {
    inputHandler(e) {
      this.$emit(EVENT_INPUT, this.query)
    },
    changeHandler(e) {
      this.$emit(EVENT_CHANGE, this.query)
    },
    clear() {
      this.$emit(EVENT_CLEAR)
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>

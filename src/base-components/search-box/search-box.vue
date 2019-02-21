<template>
  <div class="search-box">
    <button class="icon-search" @click="a"></button>
    <input ref="query" class="input-box"
      v-model="query"
      :placeholder="placeholder"
      @focus="focusHandler"
      @input="inputHandler"
      @change="changeHandler"/>
    <button class="icon-dismiss" v-show="query"
      @click="clear"></button>
  </div>
</template>

<script>

const COMPONENT_NAME = 'base-search-box'
const EVENT_CHANGE = 'change'
const EVENT_INPUT = 'input'
const EVENT_CLEAR = 'clear'
const EVENT_FOCUS = 'focus'

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
    focusHandler(e) {
      this.$emit(EVENT_FOCUS)
    },
    clear() {
      this.$emit(EVENT_CLEAR)
    },
    // 主动获得焦点
    focus() {
      this.$refs.query.focus()
    },
    a() {
      console.log('a')
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/var/color.styl"
@import "~@/common/stylus/var/font-size.styl"

.search-box
  display: flex
  position: relative
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    margin: 0
    padding: 0
    outline: none
    border: none
    background: transparent
    background-color: transparent
    font-size: 24px
    color: $color-background
  .input-box
    flex: 1
    margin: 0 35px 0 5px
    padding: 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &:placeholder
      color: $color-text-d
  .icon-dismiss
    margin: 0
    padding: 0
    outline: none
    border: none
    background: transparent
    background-color: transparent
    font-size: 16px
    color: $color-background
    position: absolute
    z-index: 100
    right: 10px
</style>

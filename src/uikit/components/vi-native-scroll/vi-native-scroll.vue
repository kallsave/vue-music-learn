<template>
  <div class="vi-native-scroll-wrapper">
    <div ref="scroll"
      class="vi-native-scroll">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {
  getRect,
  prefixStyle
} from '@/common/helpers/dom.js'
import { mulitDeepClone } from '../../common/helpers/utils.js'

const TRANSFORM = prefixStyle('transform')

const COMPONENT_NAME = 'vi-native-scroll'

const EVENT_SCROLL = 'scroll'

export default {
  name: COMPONENT_NAME,
  props: {
    scrollEvents: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this._findScroll()
    this._addEventListenerScroll()
  },
  methods: {
    enable() {

    },
    disable() {

    },
    _findScroll() {
      this.scroll = this.$refs.scroll
    },
    _addEventListenerScroll() {
      if (window.scrollY) {
        window.scrollTo(0, 0)
      }
      this.scroll.addEventListener('scroll', this._scrollHandler, false)
    },
    _removeEventListenerScroll() {
      this.scroll.removeEventListener('scroll', this._scrollHandler, false)
    },
    _scrollHandler(e) {
      let position = {
        x: 0,
        y: e.target.scrollTop
      }
      this.$emit(EVENT_SCROLL, position)
    },
    scrollTo(y) {
      this.scroll.scrollTop = y
    },
    _destroy() {
      this._removeEventListenerScroll()
    },
  },
  beforeDestroy() {
    this._destroy()
  }
}
</script>

<style lang="stylus">
.vi-native-scroll-wrapper
  height: 100%
  overflow: hidden
  .vi-native-scroll
    height: 100%
    overflow: scroll
    -webkit-overflow-scrolling: touch
</style>

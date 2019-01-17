<template>
  <div class="vi-tab">
    <slot name="tab-list">
      <div ref="tabList"
        class="vi-tab-list">
        <slot></slot>
      </div>
      <div ref="tabSlider" class="vi-tab-slider"
        :style="styleForSlider">
      </div>
    </slot>
  </div>
</template>

<script>
import { mulitDeepClone, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle, addClass } from '../../common/helpers/dom.js'

import ViTabItem from './vi-tab-item.vue'

const COMPONENT_NAME = 'vi-tab'

const EVENT_TAB_ITEM_CLICK = 'tab-item-click'

const DEFAULT_TAB_SLIDER_STYLE = {
  'background-color': '#ffcd32',
  'height': '2px',
  'width': '50px',
  'transition': 'transform 0.3s cubic-bezier(.61,0,.44,1)'
}

const TRANSFORM = prefixStyle('transform')

export default {
  name: COMPONENT_NAME,
  components: {
    ViTabItem
  },
  props: {
    sliderStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    styleForSlider() {
      return mulitDeepClone({}, DEFAULT_TAB_SLIDER_STYLE, stylePadPx(this.sliderStyle))
    }
  },
  mounted() {
    this.getRemainder()
    this._initTab()
  },
  methods: {
    getRemainder() {
      this.tabWidth = this.$refs.tabList.clientWidth
      this.tabItemWidth = this.tabWidth / this.$children.length
      this.tabSliderWidth = this.$refs.tabSlider.clientWidth
      this.remainder = (this.tabItemWidth - this.tabSliderWidth) / 2
      return this.remainder
    },
    _initTab() {
      Array.apply(null, this.$children).forEach((item, index) => {
        item.$on('selected', (isFirst) => {
          this.currentIndex = index
          let translateX = this.currentIndex * this.tabItemWidth + this.remainder
          this.translateSliderTo(translateX, isFirst)
        })
      })
    },
    tabItemClick(index) {
      this.$emit(EVENT_TAB_ITEM_CLICK, index)
    },
    translateSliderTo(x, isFlow) {
      if (isFlow) {
        this.$refs.tabSlider.style.display = 'none'
        this.$refs.tabSlider.style[TRANSFORM] = `translateX(${x}px)`
        // 强制重排
        let reflow = this.$refs.tabList.clientWidth
        this.$refs.tabSlider.style.display = 'block'
      } else {
        this.$refs.tabSlider.style[TRANSFORM] = `translateX(${x}px)`
      }
    },
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"

.vi-tab
  position: relative
  .vi-tab-list
    display: flex
    .vi-tab-flex
      flex: 1
  .vi-tab-slider
    position: absolute
    z-index: 5
    bottom: 0
    height: 2px
</style>

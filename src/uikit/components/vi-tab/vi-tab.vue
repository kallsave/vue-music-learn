<template>
  <div class="vi-tab">
    <slot name="tab-list">
      <div ref="tabList"
        class="vi-tab-list">
        <slot></slot>
      </div>
    </slot>
    <div ref="tabSlider"
      class="vi-tab-slider"
      :style="calcSliderStyle">
    </div>
  </div>
</template>

<script>
import { mulitDeepClone, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle, addClass } from '../../common/helpers/dom.js'

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
  props: {
    sliderStyle: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  computed: {
    calcSliderStyle() {
      return mulitDeepClone({}, DEFAULT_TAB_SLIDER_STYLE, stylePadPx(this.sliderStyle))
    }
  },
  mounted() {
    this._calculate()
    this._initSlider()
    window.addEventListener('resize', this._resizeHandler, false)
  },
  methods: {
    _calculate() {
      this.tabWidth = this.$refs.tabList.clientWidth
      this.tabItemWidth = this.tabWidth / this.$children.length
      this.tabSliderWidth = this.$refs.tabSlider.clientWidth
      this.remainder = (this.tabItemWidth - this.tabSliderWidth) / 2
    },
    _initSlider() {
      Array.apply(null, this.$children).forEach((item, index) => {
        item.$on('selected', (isFlow) => {
          this.currentIndex = index
          let translateX = this.currentIndex * this.tabItemWidth + this.remainder
          this.translateSliderTo(translateX, isFlow)
        })
      })
    },
    _resizeHandler() {
      this._calculate()
      let translateX = this.currentIndex * this.tabItemWidth + this.remainder
      this.translateSliderTo(translateX, true)
    },
    getRemainder() {
      return this.remainder
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
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._resizeHandler, false)
  },
}
</script>

<style lang="stylus">
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

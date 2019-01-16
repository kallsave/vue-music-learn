<template>
  <div class="vi-tab">
    <slot name="tab-list">
      <div ref="tabList"
        class="vi-tab-list">
        <div class="vi-tab-item"
          :class="[index === currentIndex ? tabActiveClass : '']"
          :style="tabStyle"
          v-for="(item, index) in tabList"
          :key="index"
          @click="changeIndex(index)">{{item}}
        </div>
      </div>
      <div ref="tabSlider" class="vi-tab-slider"
        :style="sliderContentStyle">
      </div>
    </slot>
  </div>
</template>

<script>
import { mulitDeepClone, pxToNum, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-tab'

const EVENT_CLICK_TAB_ITEM = 'click-tab-item'

const DEFAULT_TAB_SLIDER_STYLE = {
  'background-color': '#ffcd32',
  'height': '2px',
  'width': '50px',
  'transition': 'all 0.3s'
}

const TRANSFORM = prefixStyle('transform')

export default {
  name: COMPONENT_NAME,
  props: {
    tabList: {
      type: Array,
      default() {
        return []
      },
    },
    tabSliderStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowTabSlider: {
      type: Boolean,
      default: false
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabStyle: {},
    }
  },
  computed: {
    sliderContentStyle() {
      return mulitDeepClone({}, DEFAULT_TAB_SLIDER_STYLE, stylePadPx(this.sliderStyle))
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        this.$nextTick(() => {
          let tabWidth = this.$refs.tab.clientWidth
          this.tabItemWidth = tabWidth / this.tabList.length
          let tabSliderWidth = this.tabSlider.clientWidth
          this.remainder = (this.tabItemWidth - tabSliderWidth) / 2
          let translateX = newVal * this.tabItemWidth + this.remainder
          this.$refs.tabSlider.style.display = 'none'
          this.sliderTranslateX(translateX)
          requestAnimationFrame(() => {
            this.$refs.tabSlider.style.display = 'block'
          })
        })
      },
      immediate: true
    }
  },
  mounted() {
    this._findTabSlider()
    this._setTabContentStyle()
  },
  methods: {
    getTabWidth() {
      return this.$refs.tab && this.$refs.tab.clientWidth
    },
    getRemainder() {
      return this.remainder
    },
    _findTabSlider() {
      this.tabSlider = this.$refs.tabSlider
    },
    sliderTranslateX(x) {
      this.$refs.tabSlider.style[TRANSFORM] = `translateX(${x}px)`
    },
    changeIndex(index) {
      let translateX = this.currentIndex * this.tabItemWidth + this.remainder
      this.sliderTranslateX(translateX)
      this.$emit('update:currentIndex', index)
      this.$emit(EVENT_CLICK_TAB_ITEM, index)
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable.styl"

.vi-tab
  position: relative
  .vi-tab-list
    display: flex
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
  .vi-tab-slider
    position: absolute
    z-index: 5
    bottom: 0
    height: 2px
</style>

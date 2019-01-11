<template>
  <div class="vi-tab">
    <div ref="tabList"
      class="vi-tab-list"
      :tab-style="tabStyle">
      <div class="vi-tab-item"
        v-for="(item, index) in tabList" :key="index">
        <span class="vi-tab-item-link" :class="{'active': index === currentIndex}"
          @click="changeIndex(index)">{{item}}</span>
      </div>
    </div>
    <div ref="tabSlider" class="vi-tab-slider"
      :style="sliderContentStyle">
    </div>
  </div>
</template>

<script>
import { mulitDeepClone, pxToNum, stylePadPx } from '../../common/helpers/utils.js'
import { prefixStyle } from '../../common/helpers/dom.js'
import { requestAnimFrame } from '../../common/helpers/bom.js'

const COMPONENT_NAME = 'vi-tab'

const EVENT_CLICK_TAB_ITEM = 'click-tab-item'

const DEFAULT_TAB_BAR_STYLE = {
  'background-color': '#ffcd32',
  'height': '1px',
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
    sliderStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowSlider: {
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
      return mulitDeepClone({}, DEFAULT_TAB_BAR_STYLE, stylePadPx(this.sliderStyle))
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        this.$nextTick(() => {
          let tabListWidth = this.$refs.tabList.clientWidth
          this.tabItemWidth = tabListWidth / this.tabList.length
          let tabSliderWidth = this.tabSlider.clientWidth
          this.remainder = (this.tabItemWidth - tabSliderWidth) / 2
          let translateX = newVal * this.tabItemWidth + this.remainder
          let transition = this.sliderContentStyle.transition
          this.$refs.tabSlider.style.display = 'none'
          this.sliderTranslateX(translateX)
          requestAnimationFrame(() => {
            this.$refs.tabSlider.style.display = 'block'
          })
        })
      },
    }
  },
  mounted() {
    this._findTabSlider()
    this._setTabContentStyle()
  },
  methods: {
    _setTabContentStyle() {

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
    height: 46px
    line-height: 44px
    .vi-tab-item
      flex: 1
      text-align: center
      .vi-tab-item-link
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

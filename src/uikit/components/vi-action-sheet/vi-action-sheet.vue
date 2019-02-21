<template>
  <transition name="vi-action-sheet-fade">
    <vi-popup v-show="isVisible"
      :is-show-mask="isShowMask"
      :is-lock-scroll="isLockScroll"
      @mask-click="maskClick">
      <div slot="customContent">
        <transition name="vi-action-sheet-move">
          <div class="vi-action-sheet"
            v-show="isVisible">
            <div class="vi-action-sheet-menu">
              <div class="vi-action-sheet-menu-item vi-border-1px"
                :style="item.style"
                v-for="(item, index) in data" :key="index"
                v-html="item.content"
                v-touch-active="touchColor"
                @click="select(item)"></div>
            </div>
            <div class="vi-action-sheet-cancel"
              v-if="isShowCancel"
              v-touch-active="touchColor"
              @click="cancel">取消</div>
          </div>
        </transition>
      </div>
    </vi-popup>
  </transition>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import ViPopup from '../vi-popup/vi-popup.vue'
import { camelize } from '../../common/helpers/utils.js'

const COMPONENT_NAME = 'vi-action-sheet'

export const EVENT_SELECT = 'select'
export const EVENT_CANCEL = 'cancel'

export default {
  name: COMPONENT_NAME,
  components: {
    ViPopup
  },
  mixins: [
    visibilityMixin
  ],
  directives: {
    touchActive: {
      bind(el, s, v) {
        el.ontouchstart = (e) => {
          el.style.color = s.value
        }
        el.ontouchend = (e) => {
          el.style.color = ''
        }
      }
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    isShowMask: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 100
    },
    isShowCancel: {
      type: Boolean,
      default: true
    },
    isLockScroll: {
      type: Boolean,
      default: true
    },
    touchColor: {
      type: String,
      default: 'gold'
    },
    isMaskCloseAble: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      touchActiveStyle: {}
    }
  },
  methods: {
    maskClick() {
      if (this.isMaskCloseAble) {
        this.isVisible = false
      }
    },
    select(item) {
      this.$emit(EVENT_SELECT, item, this.hide)
    },
    cancel() {
      if (!this._events[EVENT_CANCEL]) {
        this.isVisible = false
        this.$emit(EVENT_CANCEL)
      } else {
        this.$emit(EVENT_CANCEL, this.hide)
      }
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/var/color.styl"
@import "../../common/stylus/var/font-size.styl"
@import "../../common/stylus/var/ease.styl"
@import "../../common/stylus/mixin.styl"

.vi-action-sheet-fade-enter,
.vi-action-sheet-fade-leave-active
  opacity: 0

.vi-action-sheet-fade-enter-active,
.vi-action-sheet-fade-leave-active
  transition: opacity .3s $ease-out-in

.vi-action-sheet
  position: absolute
  width: 100%
  bottom: 0
  background: $color-popup-content-background
  &.vi-action-sheet-move-enter,
  &.vi-action-sheet-move-leave-active
    transform: translate3d(0, 100%, 0)
  &.vi-action-sheet-move-enter-active,
  &.vi-action-sheet-move-leave-active
    transition: transform .3s $ease-out-in
  &.vi-action-sheet-move-leave
    transform: translate3d(0, 0, 0)
  &.vi-action-sheet-move-leave-to
    transform: translate3d(0, 100%, 0)
  .vi-action-sheet-menu
    color: #000
    background: #fff
    .vi-action-sheet-menu-item
      border-top-1px($color-border)
      position: relative
      padding: 10px 0
      line-height: 36px
      text-align: center
      white-space: nowrap
      font-size: $font-size-medium-xx
      &:nth-of-type(1)
        border-none()
  .vi-action-sheet-cancel
    margin-top: 6px
    padding: 10px 0
    line-height: 28px
    color: #000
    font-size: $font-size-medium-xx
    text-align: center
    background: #fff
</style>

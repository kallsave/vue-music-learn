<template>
  <transition name="vi-action-sheet-fade">
    <vi-popup v-show="isVisible"
      :mask="mask"
      @mask-click="maskClick"
      touchmove.prevent.native>
      <div slot="content">
        <transition name="vi-action-sheet-move">
          <div class="vi-action-sheet"
            v-show="isVisible">
            <div class="vi-action-sheet-list">
              <div class="vi-action-sheet-item">66</div>
            </div>
          </div>
        </transition>
      </div>
    </vi-popup>
  </transition>
</template>

<script>
import visibilityMixin from '../../common/mixins/visibility.js'
import ViPopup from '../vi-popup/vi-popup.vue'

const COMPONENT_NAME = 'vi-action-sheet'

export default {
  name: COMPONENT_NAME,
  components: {
    ViPopup
  },
  mixins: [
    visibilityMixin
  ],
  props: {
    mask: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 100
    }
  },
  methods: {
    maskClick() {
      this.isVisible = false
    }
  }
}
</script>

<style lang="stylus">
@require "../../common/stylus/variable.styl"

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
  .vi-action-sheet-list
    background: #fff
    .vi-action-sheet-item
      padding: 17px 16px
      margin: 0
      text-align: center
      overflow: hidden
      white-space: nowrap
      font-size: $font-size-large
      font-weight: normal
      line-height: 1
      background: peru

</style>

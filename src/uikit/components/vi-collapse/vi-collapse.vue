<template>
  <div class="vi-collapse">
    <slot name="collapse-header"
      :is-collapse="isCollapse"
      :toggle="toggle"></slot>
    <vi-collapse-transition>
      <template v-show="!isCollapse">
        <slot name="collapse-content"
          :is-collapse="isCollapse"
          :toggle="toggle"></slot>
      </template>
    </vi-collapse-transition>
    <template v-show="isCollapse">
      <slot name="collapse-content-skeleton"
        :is-collapse="isCollapse"
        :toggle="toggle"></slot>
    </template>
    <slot name="collapse-footer"
      :is-collapse="isCollapse"
      :toggle="toggle"></slot>
  </div>
</template>

<script>
import ViCollapseTransition from './vi-collapse-transition.js'
import { prefixStyle } from '../../common/helpers/dom.js'
const TRANSITIONEND = prefixStyle('transitionEnd')

const COMPONENT_NAME = 'vi-collapse'

const EVENT_TRANSITION_END = 'transition-end'

export default {
  name: COMPONENT_NAME,
  components: {
    ViCollapseTransition
  },
  props: {
    isInitCollapse: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isCollapse: this.isInitCollapse,
    }
  },
  mounted() {
    this._addEventListener()
  },
  methods: {
    _addEventListener() {
      if (this.$slots['collapse-content']) {
        this.$slots['collapse-content'][0].elm.addEventListener(TRANSITIONEND, this.transitionEndCallBack, false)
      }
    },
    _removeEventListener() {
      if (this.$slots['collapse-content']) {
        this.$slots['collapse-content'][0].elm.removeEventListener(TRANSITIONEND, this.transitionEndCallBack, false)
      }
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    transitionEndCallBack() {
      this.$emit(EVENT_TRANSITION_END, this.isCollapse)
    }
  },
  destroyed() {
    this._removeEventListener()
  }
}
</script>

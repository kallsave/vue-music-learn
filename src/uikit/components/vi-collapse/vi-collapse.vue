<template>
  <div class="vi-collapse">
    <slot name="collapse-header"
      :is-collapse="isCollapse"
      :toggle="toggle"></slot>
    <vi-collapse-transition>
      <template v-if="!isCollapse">
        <slot name="collapse-content"
          :is-collapse="isCollapse"
          :toggle="toggle"></slot>
      </template>
    </vi-collapse-transition>
    <template v-if="isCollapse">
      <slot name="collapse-content-skeleton"
        :is-collapse="isCollapse"
        :toggle="toggle"></slot>
    </template>
  </div>
</template>

<script>
import ViCollapseTransition from './vi-collapse-transition.js'

const COMPONENT_NAME = 'vi-collapse'

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
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>

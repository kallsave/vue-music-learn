<template>
  <div class="vi-collapse">
    <slot name="collapse-header"
      :is-collapse="isCollapse"
      :toggle="toggle"></slot>
    <template v-if="!isCollapse">
      <slot name="collapse-content"
        :is-collapse="isCollapse"
        :toggle="toggle"></slot>
    </template>
    <template v-if="isCollapse">
      <slot name="collapse-content-skeleton"
        :is-collapse="isCollapse"
        :toggle="toggle"></slot>
    </template>
  </div>
</template>

<script>
export default {
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

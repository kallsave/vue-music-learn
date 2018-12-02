<template>
  <div class="vi-native-sticky-ele">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-native-sticky-ele'

export default {
  name: COMPONENT_NAME,
  inject: ['ViNativeSticky'],
  // props: {
  mounted() {
    // 在父组件的所有子组件渲染完成后
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      console.log(this.ViNativeSticky)
    }
  }
}
</script>

<style>

</style>

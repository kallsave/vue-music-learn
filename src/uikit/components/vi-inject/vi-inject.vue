<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-inject'

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      viInject: this.viInject
    }
  },
  props: {
    viInject: {
      default() {
        return {}
      }
    }
  },
  created() {
    console.log('cre', this.viInject)
  }
}
</script>

<style>

</style>

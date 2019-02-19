<template>
  <div class="http">
    <slot></slot>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-href'
export default {
  name: COMPONENT_NAME,
  mounted() {
    let str = this.$slots.default[0].elm.innerHTML
    str = str.replace(/((www|http(s)?:\/\/).+?\.(com|cn))/g, `<a href="$1">$1</a>`)
    this.$slots.default[0].elm.innerHTML = str
  }
}
</script>

<style lang="stylus">
.http
  a
    color: gold
</style>

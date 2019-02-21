<template>
  <div class="background" :style="setStyle"></div>
</template>

<script>
export default {
  props: {
    setStyle: {
      type: Object,
      default() {
        return {
          height: '100vh'
        }
      }
    }
  }
}
</script>

<style lang="stylus" modules>
.background
  height: 100vh

</style>

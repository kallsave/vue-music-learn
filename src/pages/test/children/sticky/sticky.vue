<template>
  <div class="sticky">
    <div class="box1"></div>
    <div class="box1"></div>
    <div class="sticky-ele1"></div>
    <div class="box2"></div>
    <div class="sticky-ele2"></div>
    <div class="box2"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="stylus" modules>
.sticky
  .box1
    height: 300px
    background: green
  .sticky-ele1
    height: 30px
    background: gold
    top: 0px
    position: sticky
  .sticky-ele2
    height: 30px
    background: gold
    top: 29px
    position: sticky
  .box2
    height: 1000px
    background:green
</style>

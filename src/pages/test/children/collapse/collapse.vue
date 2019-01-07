<template>
  <div class="collapse">
    <vi-collapse :time="200">
      <div class="content" v-show="model" @click="model=false"></div>
    </vi-collapse>
    <div class="box" @click="model=true">666</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      model: true
    }
  },
}
</script>

<style lang="stylus" scoped>
.collapse
  width: 100%
  height: 100vh
  background: #fff
  .content
    background: gold
    height: 300px
  .box
    width: 50px
    height: 50px
    background: peru
</style>

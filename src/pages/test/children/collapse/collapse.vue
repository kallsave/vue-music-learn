<template>
  <div class="collapse">
    <vi-collapse
      @transition-end="transitionEnd">
      <template slot="collapse-content" slot-scope="props">
        <div class="content" @click="props.toggle"></div>
      </template>
      <template slot="collapse-footer" slot-scope="props">
        <div class="box"
          @click="props.toggle">{{props.isCollapse}}</div>
      </template>
    </vi-collapse>
  </div>
</template>

<script>

export default {
  methods: {
    transitionEnd(isCollapse) {
      console.log(isCollapse)
    }
  }
}
</script>

<style lang="stylus" modules>
.collapse
  width: 100%
  height: 100vh
  background: #fff
  .content
    background: gold
    height: 300px
    // 需要修改collapse的transtion只需要在css中修改即可
    // 因为通过addClass的类权重最低
    transition: all 1s
  .box
    width: 50px
    height: 50px
    background: peru
</style>

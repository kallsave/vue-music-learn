<template>
  <div class="collapse">
    <template v-if="isUseSlotScoped">
      <vi-collapse @transition-end="transitionEnd">
        <template slot="collapse-content" slot-scope="scoped">
          <div class="content" v-show="scoped.isCollapse" @click="scoped.toggle"></div>
        </template>
        <div class="box" slot="collapse-footer" slot-scope="scoped"
          @click="scoped.toggle">{{scoped.isCollapse}}</div>
      </vi-collapse>
    </template>
    <template>
      <vi-collapse @transition-end="transitionEnd">
        <template slot="collapse-content">
          <div class="content" v-show="model" data-transition-time="2000"></div>
        </template>
      </vi-collapse>
      <div class="box" @click="toggle">{{666}}</div>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      model: true,
      isUseSlotScoped: false
    }
  },
  methods: {
    toggle() {
      this.model = !this.model
    },
    transitionEnd(isCollapse) {
      // 这里的isCollapse是slot-scope的isCollapse
      // collapse可以通过slot-scope的isCollapse控制隐藏和显示
      // 也可以通过外部的变量控制,但是这样isCollapse就失去意义
      console.log(isCollapse)
    }
  }
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
    // 需要修改collapse的transtion只需要在css中修改即可
    // 因为通过addClass的类权重最低
    transition: all 1s
  .box
    width: 50px
    height: 50px
    background: peru
</style>

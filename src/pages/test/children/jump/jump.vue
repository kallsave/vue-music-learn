<template>
  <div class="jump">
    <div class="box" ref="box1" @click="jumpTo(600)">1</div>
    <div style="height: 500px"></div>
    <div class="box" ref="box2" @click="jumpToElement('box3')">2</div>
    <div style="height: 500px"></div>
    <div class="box" ref="box3" @click="jumpToElement('box2')">3</div>
    <div style="height: 500px"></div>
    <div class="box" ref="box4" @click="jumpToElement('box1')">4</div>
    <div style="height: 500px"></div>
  </div>
</template>

<script>
import jump from 'jump.js'
export default {
  methods: {
    jumpTo(y) {
      jump(y)
    },
    jumpToElement(ref) {
      jump(this.$refs[ref])
    }
  }
}
</script>

<style lang="stylus" modules>
.jump
  .box
    width: 100px
    height: 100px
    background: peru
    text-align: center
    font-size: 20px
    line-height: 100px
    color: #fff
</style>

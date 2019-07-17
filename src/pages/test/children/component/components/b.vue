<template>
  <div :class="$style['b']">
    <div>我是b组件</div>
    <div>{{b}}</div>
    <div>{{count}}</div>
    <div style="font-size: 30px" @click="add">+</div>
  </div>
</template>

<script>
export default {
  name: 'b-component',
  props: {
    b: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    add() {
      this.count++
    }
  }
}
</script>

<style lang="stylus" module>
.b
  font-size: 16px
</style>

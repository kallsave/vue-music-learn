<template>
  <div :class="$style['a']">
    <div>我是a组件</div>
    <div>{{a}}</div>
    <div>{{count}}</div>
    <div style="font-size: 30px" @click="add">+</div>
  </div>
</template>

<script>
export default {
  name: 'a-component',
  props: {
    a: {
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
.a
  font-size: 16px
</style>

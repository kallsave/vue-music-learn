<template>
  <div class="update" v-if="localIsVisible">update</div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localIsVisible: false
    }
  },
  methods: {
    show() {
      // .sync语法需要和update:配合使用
      // this.$emit('update:isVisible', true) => @update:isVisible
      // 也会找到:is-visible.sync = xxx
      // 把传值赋给xxx => is-visible = xxx
      // 最终isVisible = 传值
      this.$emit('update:isVisible', true)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>

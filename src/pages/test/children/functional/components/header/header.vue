<template>
  <div class="header">
    <div class="title">header</div>
    <div v-for="(item, index) in list" :key="index">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    console.log(this.list)
    console.log(this)
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.header
  width: 100%
  .title
    line-height: 60px
    color: #fff
    text-align: center

</style>

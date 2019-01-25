<template>
  <div class="action-sheet">
    <div class="show-action-sheet" @click="show"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowActionSheet: false
    }
  },
  mounted() {
    this.sheet = this.$createViActionSheet({
      mask: true
    })
  },
  methods: {
    show() {
      this.sheet.show()
    }
  }
}
</script>

<style lang="stylus" scoped>
.action-sheet
  background: #fff
  height: 100vh
  .show-action-sheet
    width: 50px;
    height: 30px;
    background: gold;
</style>

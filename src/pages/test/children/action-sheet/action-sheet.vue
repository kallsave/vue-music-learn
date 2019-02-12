<template>
  <div class="action-sheet">
    <div class="show-action-sheet" @click="show"></div>
  </div>
</template>

<script>
import ViActionSheet from '../../../../uikit/components/vi-action-sheet/vi-action-sheet.vue'

export default {
  data() {
    return {
      isShowActionSheet: false,
      list: [
        {
          content: '分享到朋友圈',
          style: {
            color: 'red'
          }
        },
        {
          content: '分享给朋友',
          style: {}
        },
      ],
    }
  },
  mounted() {
    this.sheet = this.$createViActionSheet({
      data: this.list,
      touchColor: 'gold',
      onSelect(item, hide) {
        console.log(item)
      },
      onCancel(hide) {
        hide()
      }
    })
  },
  methods: {
    show() {
      this.sheet.show()
    },
    select(item) {
      console.log(item)
      this.sheet.hide()
    }
  }
}
</script>

<style lang="stylus" scoped>
.gold
  color: gold
.action-sheet
  background: #fff
  height: 100vh
  .show-action-sheet
    width: 50px;
    height: 30px;
    background: gold;
</style>

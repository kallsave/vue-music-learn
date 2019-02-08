<template>
  <div class="swipe">
    <vi-swipe
      :menu="menu">
      <div class="item">1</div>
      <!-- <template slot="menu">
        <div class="delete"></div>
        <div class="cancel"></div>
      </template> -->
    </vi-swipe>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          class: '',
          text: ''
        }
      ]
    }
  }
}
</script>

<style lang="stylus" modules>
.swipe
  .item
    width: 100%
    height: 50px
    line-height: 50px
    color: #fff
    text-align: center
    background: gold
    border-bottom: 2px solid red
  .delete
    width: 80px
    height: 50px
    line-height: 50px
    color: #fff
    text-align: center
    background: red
    text-align: center
</style>

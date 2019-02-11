<template>
  <div class="swipe">
    <cube-swipe>
      <li class="swipe-item-wrapper"
        v-for="(data, index) in swipeData" :key="index">
        <cube-swipe-item
          :btns="data.btns">
          <div class="item">1</div>
        </cube-swipe-item>
      </li>
    </cube-swipe>
    <!-- <vi-swipe>
      <div class="item">1</div>
    </vi-swipe>
    <vi-swipe>
      <div class="item">1</div>
    </vi-swipe>
    <vi-swipe>
      <div class="item">1</div>
    </vi-swipe> -->
  </div>
</template>

<script>
import CubeSwipe from './components/swipe.vue'
import CubeSwipeItem from './components/swipe-item.vue'
import { customData } from './data.js'

export default {
  components: {
    CubeSwipe,
    CubeSwipeItem
  },
  data() {
    return {
      menu: [
        {
          class: '',
          text: ''
        }
      ],
      swipeData: customData
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
    border-bottom: 2px solid #fff
    margin-bottom: 10px
  .delete
    width: 80px
    height: 50px
    line-height: 50px
    color: #fff
    text-align: center
    background: red
    text-align: center
</style>

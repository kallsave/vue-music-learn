<template>
  <div :class="$style['keep-alive-list']">
    <div class="list">
      <div class="item"
        v-for="(item, index) in list"
        :key="item.id"
        :style="setStyle(item, index)"
        @click="clickHandler">
          <div class="content">{{item.value}}</div>
          <div class="btn-list">
            <div class="pay">支付</div>
            <div class="cancel">取消</div>
            <div class="delete">删除</div>
            <div class="value">改值</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import ListAnimation from '../list-animation/list-animation.vue'

function getRandomInt(min, max) {
  return (Math.random() * (max - min + 1) + min) | 0
}

function getRandomColor() {
  return '#' + (getRandomInt(0, 0xffffff)).toString(16)
}

export default {
  components: {
    ListAnimation
  },
  data() {
    return {
      num: 1,
      list: [
        {
          id: 0,
          status: 0,
          value: 0
        },
        {
          id: 1,
          status: 0,
          value: 1
        },
        {
          id: 2,
          status: 0,
          value: 2
        },
        {
          id: 3,
          status: 0,
          value: 3
        },
        {
          id: 4,
          status: 0,
          value: 4
        },
        {
          id: 5,
          status: 0,
          value: 5
        },
        {
          id: 6,
          status: 0,
          value: 6
        },
        {
          id: 7,
          status: 0,
          value: 7
        },
        {
          id: 8,
          status: 0,
          value: 8
        },
      ]
    }
  },
  watch: {
    num: {
      handler(newVal) {
        console.log(newVal)
      },
      deep: true
    }
  },
  methods: {
    parseStatus() {
      let map = {
        0: ''
      }
    },
    setStyle(item, index) {
      let background = getRandomColor()
      item.background = background
      return {
        background: background,
        animation: `${this.$style['list-load']} ${index * 200 + 400}ms`
      }
    },
    clickHandler() {
      this.num = 0
      this.num = 1
    }
  }
}
</script>

<style lang="stylus" module>
.keep-alive-list
  box-sizing: border-box
  padding-top: 50px
  :global
    .item
      margin: 0 10px 10px 10px
      height: 150px
      border-radius: 6px

@keyframes list-load
  0%
    transform: translateY(100px)
  100%
    transform: translateY(0px)
</style>

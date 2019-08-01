<template>
  <div :class="$style['list-animation']">
    <div class="list">
       <div class="item"
        v-for="(item, index) in list" :key="index"
        :style="setStyle(index)"
        @animationend="animationend"
        @click="goRecommend"></div>
    </div>
  </div>
</template>

<script>
function getRandomInt(min, max) {
  return (Math.random() * (max - min + 1) + min) | 0
}

function getRandomColor() {
  return '#' + (getRandomInt(0, 0xffffff)).toString(16)
}

export default {
  data() {
    return {
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }
  },
  mounted() {
    this.$global.toast.show({
      title: '加载中...'
    })
    console.log(this.$style)
  },
  methods: {
    setStyle(i) {
      return {
        background: getRandomColor(),
        animation: `${this.$style['list-load']} ${i * 200 + 400}ms`
      }
    },
    animationend() {
      // console.log('animationend')
    },
    goRecommend() {
      this.$router.push({
        name: 'index-recommend'
      })
    }
  }
}
</script>

<style lang="stylus" module>
.list-animation
  box-sizing: border-box
  padding-top: 50px
  :global
    .list
      .item
        margin: 0 10px 10px 10px
        height: 150px
        border-radius: 6px

@keyframes list-load {
  0% {
    transform: translateY(100px)
  }
  100% {
    transform: translateY(0px)
  }
}
</style>

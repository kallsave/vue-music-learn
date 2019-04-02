<template>
  <canvas ref="bubble"
    :width="width"
    :height="height"
    :style="style"></canvas>
</template>

<script>
export default {
  props: {
    y: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: 50,
      height: 80,
      imgUrl: require('@/assets/images/wechat.png')
    }
  },
  computed: {
    style() {
      return {}
    }
  },
  watch: {
    y: {
      handler(newVal) {
        // console.log(newVal)
      }
    }
  },
  mounted() {
    // 手机都是缩放的
    // iphone6的window.devicePixelRatio为2
    // 一个手机物理尺寸px有两个像素px
    this.ratio = window.devicePixelRatio
    console.log(this.ratio)
  },
  methods: {
    _draw() {
      const bubble = this.$refs.bubble
      let ctx = bubble.getContext('2d')
    }
  }
}
</script>

<style lang="stylus" modules>
img
  width: 26px
  height: 26px

</style>

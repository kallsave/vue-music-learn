<template>
  <vi-slide
    ref="slide"
    class="slide"
    v-if="recommends.length"
    :data="recommends"
    :options="slideOptions"
    :show-dots="true"
    :auto-play="true"
    @load-image="loadImage">
    <vi-slide-item v-for="(item, index) in recommends" :key="index">
      <div class="slide-item">{{index}}</div>
    </vi-slide-item>
  </vi-slide>
</template>

<script>
import { getRecommend } from '@/api/recommend.js'
export default {
  data() {
    return {
      recommends: [],
      slideOptions: {
        probeType: 1,
        click: true,
        snap: {
          loop: true,
          threshold: 0.2
        },
      },
    }
  },
  mounted() {
    this._getRecommend()
  },
  methods: {
    _getRecommend(forceUpdate) {
      return getRecommend().then((res) => {
        this.recommends = res.data.slider
      })
    },
    loadImage() {
      // 图片是异步撑开的,所以要@load监听第一张图片的下载
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$nextTick(() => {
          if (this.hadLoad) {
            return
          }
          this.hadLoad = true
        })
      }
    },
  }
}
</script>

<style lang="stylus">
.slide-item
  height: 100px
  line-height: 100px
  font-size: 20px
  text-align: center

.vi-slide-item
  &:nth-of-type(1)
    .slide-item
      background: #000000
  &:nth-of-type(2)
    .slide-item
      background: #00FF00
  &:nth-of-type(3)
    .slide-item
      background: #FF0000
  &:nth-of-type(4)
    .slide-item
      background: #FFFFFF
</style>

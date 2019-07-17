<template>
  <div :class="$style['scroll-horizontal']">
    <vi-scroll ref="YScroll">
      <div style="height: 100px; background: red"></div>
      <div class="scroll-wrapper">
        <vi-scroll ref="XScroll"
          :options="XOptions">
          <div>
            <ul class="list"><li class="item"
                v-for="(item, index) in slider" :key="index">
                <img :src="item.picUrl"
                  @load="loadImg"  />
              </li></ul>
          </div>
        </vi-scroll>
        <div style="height: 1000px; background: peru"></div>
      </div>
    </vi-scroll>
  </div>
</template>

<script>
import { getRecommend } from '@/api/recommend.js'
export default {
  data() {
    return {
      slider: [],
      XOptions: {
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical'
      }
    }
  },
  mounted() {
    getRecommend().then((res) => {
      console.log(res)
      this.slider = res.data.slider
    })
  },
  methods: {
    loadimg() {
      this.$nextTick(() => {
        this.$refs.XScroll.refresh()
        this.$refs.YScroll.refresh()
      })
    }
  }
}
</script>

<style lang="stylus" module>
.scroll-horizontal
  height: 100vh
  :global
    .scroll-wrapper
      width: 280px
      margin: 0 auto
      background: gold
      .vi-scroll-content
        display: inline-block
        .list
          width: (280 * 5)px
          .item
            display: inline-block
            width: 280px
            img
              width: 100%
              height: 100%
</style>

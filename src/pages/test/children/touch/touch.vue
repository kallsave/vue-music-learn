<template>
  <div :class="$style['touch']">
    <div ref="swipeItem"
      class="item1"
      @touchstart="touchstartHandler"
      @touchmove="touchmoveHandler"
      @touchend="touchendHandler">1</div>
    <div class="item2">2</div>
    <div class="item3">3</div>
    <div class="item4">4</div>
  </div>
</template>

<script>
import { prefixStyle } from '@/common/helpers/dom.js'
import { Throttle, mulitDeepClone } from '@/common/helpers/utils.js'

const TRANSFORM = prefixStyle('transform')
const TRANSITION = prefixStyle('transition')

export default {
  mounted() {
    this._createThrottleInstance()
    this._findScrollerStyle()
    this.scrollerStyle[TRANSITION] = '200ms ease-out-in'
  },
  methods: {
    _createThrottleInstance() {
      this.throttle = new Throttle(5000)
    },
    _findScrollerStyle() {
      this.scrollerStyle = this.$refs.swipeItem.style
    },
    touchstartHandler(e) {
      // 当div1,div2只有div2绑定了touchstart
      // 第一次放下一个手指在div1上,触发了touchstart,
      // 这个时候,三个集合的内容都是一样的,都包含这个手指的touch,
      // 然后再放下第二根手指在div2上,第三根手指放div1上,触发了touchstart,
      // changedTouches这时候是div1上的第三根手指的集合
      // targetTouches这时候是在div1上的两根手指的集合
      // touches这时候是三根手指的集合
      // touchend只有changedTouches
      // 如果做单根手指的动作,使用touches[0]
      console.log(mulitDeepClone({}, e.changedTouches))
      console.log(mulitDeepClone({}, e.targetTouches))
      console.log(mulitDeepClone({}, e.touches))
    },
    touchmoveHandler(e) {
      // this.throttle.run(() => {
      //   console.log(e.changedTouches)
      //   console.log(e.targetTouches)
      //   console.log(e.touches)
      // })
    },
    touchendHandler(e) {
      // touchend只有changedTouches
      // console.log(e.changedTouches)
      // console.log(e.targetTouches)
      // console.log(e.touches)
    }
  }
}
</script>

<style lang="stylus" module>
.touch
  :global
    div
      border-bottom: 2px solid red
      width: 100%
      height: 50px
      background: gold
      color: #fff
      text-align: center
      line-height: 50px
</style>

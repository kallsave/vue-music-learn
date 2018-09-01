<!-- scroll需要一个父元素给高度,即scroll-wrapper -->
<!-- scroll需要一个slot的根元素,即scroll-content -->
<template>
  <div ref="wrapper" class="rever-scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

const COMPONENT_NAME = 'rever-scroll'

const DEFAULT_OPTIONS = {
  observeDOM: true,
  click: true,
  probeType: 1,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false,
  preventDefault: false
}

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      Scroll: this
    }
  },
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // 这个data是scroll组件包住的元素里面的数据
    // 这个数据会影响高度,可能这种数据不止一个
    // 当数据不止一个的时候,传入的时候:data=[data1,data2]
    data: {
      type: Array,
      default() {
        return []
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // this._initScroll()
    // mounted中调用$nextTick,说明整个app的组件都mounted完毕
    // 因为$nextTick总是迟于mounted
    this._initScroll()
    // this.$nextTick(() => {
    //   this._initScroll()
    // })
  },
  watch: {
    data() {
      // 父组件数据更新===子组件传递的props更新
      // watch也是基于promiseA+的异步,watch执行,但是是优先于DOM更新执行的
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      let options = Object.assign({}, DEFAULT_OPTIONS, this.options)

      this.scroll = new BScroll(this.$refs.wrapper, options)

      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
  }
}
</script>

<style lang="stylus">
.rever-scroll-wrapper {
  position: relative
  height: 100%
  overflow: hidden
}
</style>

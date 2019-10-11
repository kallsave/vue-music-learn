<template>
  <vi-popup
    ref="popup"
    :is-use-absolute="true"
    :class="$style['test-dialog']"
    @mask-click="maskClick">
    <div class="list">
      <div class="item"
        v-for="(item, index) in options"
        :key="index"
        :class="{'active': cacheData.indexOf(item) !== -1}">{{item}}</div>
    </div>
  </vi-popup>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      cacheData: []
    }
  },
  watch: {
    // 在一个更新周期watch中,写在前面的先执行
    // 比如this.options = 1;this.data = 1;会先执行watch.data再watch.options
    // 对于一般列表页,options通常只会更新两次(一次是初始化,一次是不会再变的异步数据)
    // 而data会无数次更新,而异步数据的data是依赖于异步数据的options,所以做了处理
    data: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.fillData(newVal, this.options)
        })
        // if (oldVal !== undefined) {
        //   this.dataChangeTime++
        //   if (this.dataChangeTime === 1) {
        //     console.log(newVal.length)
        //     this.optionsPromise.then((options) => {
        //       let data = newVal
        //       this.fillData(data, options)
        //     })
        //   } else {
        //     let data = newVal
        //     let options = this.options
        //     this.fillData(data, options)
        //   }
        // } else {
        //   // create初始化的时候执行这里
        //   this.$nextTick(() => {
        //     this.fillData(newVal, this.options)
        //   })
        //   this.dataChangeTime = 0
        // }
      },
      immediate: true
    },
    options: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.fillData(this.data, newVal)
        })
        // 每一次更新结束会产生一个promise,在下一次更新resolve上一个promise
        // if (oldVal !== undefined) {
        //   console.log('options异步更新', this.options)
        //   if (this.dataChangeTime === 0 || this.dataChangeTime === 1) {
        //     console.log('this.dataChangeTime', this.dataChangeTime)
        //     this.optionsPromiseResolve(newVal)
        //   }
        // }
        // if (this.dataChangeTime === 0) {
        //   this.optionsPromise = new Promise((resolve) => {
        //     console.log('first')
        //     this.optionsPromiseResolve = resolve
        //   })
        // }
      },
      immediate: true
    },
  },
  created() {
    console.log('create')
  },
  mounted() {
  },
  methods: {
    fillData(data, options) {
      this.cacheData = data
    },
    show() {
      this.$refs.popup.show()
    },
    maskClick() {
      this.$refs.popup.hide()
    }
  },
}
</script>

<style lang="stylus" module>
.test-dialog
  :global
    .list
      .item
        width: 50px
        height: 50px
        background: peru
        line-height: 50px
        color: #fff
        font-size: 12px
        text-align: center
        margin-bottom: 10px
        &.active
          background: gold
</style>

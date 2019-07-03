<template>
  <div></div>
</template>

<script>
export default {
  props: {
    options: {
      type: Number,
      default: 0
    },
    data: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 在一个更新周期watch中,写在前面的先执行
    // 比如this.options = 1;this.data = 1;会先执行watch.data再watch.options
    // 对于一般列表页,options通常只会更新两次(一次是初始化,一次是不会再变的异步数据)
    // 而data会无数次更新,而异步数据的data是依赖于异步数据的options,所以做了处理
    data: {
      handler(newVal, oldVal) {
        if (oldVal !== undefined) {
          this.dataChangeTime++
          if (this.dataChangeTime === 1) {
            this.optionsPromise.then((options) => {
              let data = newVal
              this.fillData(data, options)
            })
          } else {
            let data = newVal
            let options = this.options
            this.fillData(data, options)
          }
        } else {
          this.dataChangeTime = 0
        }
      },
      immediate: true
    },
    options: {
      handler(newVal, oldVal) {
        // 每一次更新结束会产生一个promise,在下一次更新reslove上一个promise
        if (oldVal !== undefined) {
          console.log('options异步更新', this.options)
          if (this.dataChangeTime === 0 || this.dataChangeTime === 1) {
            console.log('this.dataChangeTime', this.dataChangeTime)
            this.optionsPromiseResolve(newVal)
          }
        }
        if (this.dataChangeTime === 0) {
          this.optionsPromise = new Promise((reslove) => {
            this.optionsPromiseResolve = reslove
          })
        }
      },
      immediate: true
    },
  },
  methods: {
    fillData(data, options) {

    }
  }
}
</script>

<style>

</style>

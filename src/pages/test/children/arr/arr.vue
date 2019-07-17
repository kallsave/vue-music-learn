<template>
  <div :class="$style['arr']">
    <div class="item"
      v-for="(item, index) in list" :key="index">{{item.count}}</div>
  </div>
</template>

<script>
export default {
  mounted() {
    // window.setInterval(() => {
    //   let length = this.list.length
    //   this.list.push({
    //     name: 'a',
    //     count: length
    //   })
    // }, 3000)
    this.getData().then(() => {
      console.log('done')
    })
  },
  data() {
    return {
      list: [],
      arr: [1, 2, 3]
    }
  },
  methods: {
    getData() {
      return new Promise((resolve) => {
        let a = 0;
        (async () => {
          for (let i = 0; i < this.arr.length; i++) {
            let item = this.arr[i]
            await (() => {
              return this.itemSuccess(i)
            })()
          }
          await (() => {
            resolve()
          })()
        })()
      })
    },
    itemSuccess(i) {
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          console.log(i)
          resolve()
        }, 1000)
      })
    }
  },
}
</script>

<style lang="stylus" moduled>
.arr
  height: 100vh
  background: #fff
  :global
    .item
      font-size: 16px
      line-height: 16px
</style>

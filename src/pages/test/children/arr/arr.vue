<template>
  <div :class="$style['arr']">
    <div class="item"
      v-for="(item, index) in list"
      :key="index"
      :style="{'background': getColor(item)}">{{item.count}}</div>
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
      arr: [0, 1, 2],
      list: [],
      baseColor: 100,
    }
  },
  computed: {
    getColor() {
      return (item) => {
        return `rgba(${this.baseColor}, ${item * 100}, 255, 1)`
      }
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
          console.log(this.list)
        })()
      })
    },
    itemSuccess(i) {
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          this.list.push(i)
          resolve()
        }, 1000)
      })
    }
  },
}
</script>

<style lang="stylus" module>
.arr
  height: 100%
  background: #fff
  :global
    .item
      font-size: 16px
      line-height: 16px
      height: 100px
</style>

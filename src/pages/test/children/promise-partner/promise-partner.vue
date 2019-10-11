<template>
  <div :class="$style['promise-partner']">
    <div class="box" @click="showDialog">1</div>
    <div class="box" @click="showDialog">2</div>
    <test-dialog
      ref="TestDialog"
      :options="options"
      :data="data">
    </test-dialog>
  </div>
</template>

<script>
import TestDialog from './component/test-dialog.vue'
import { getRandomInt, shuffle } from '@/common/helpers/utils.js'

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default {
  components: {
    TestDialog
  },
  data() {
    return {
      options: [],
      data: [],
    }
  },
  created() {
    this.setOptionsData()
  },
  methods: {
    showDialog() {
      this.$refs.TestDialog.show()
    },
    // options是随机的
    createOptions() {
      let optionsLength = getRandomInt(6, OPTIONS.length)
      return shuffle(OPTIONS).slice(0, optionsLength)
    },
    // data是随机的
    createData(options) {
      let optionsLength = options.length - 1
      let dataLength = getRandomInt(1, optionsLength)
      return shuffle(options).slice(0, dataLength)
    },
    setOptionsData() {
      let options = this.createOptions()
      let data = this.createData(options)
      // created里面正常
      // this.syncOptionsData(options, data)
      // created里面正常
      // this.syncDataOptions(options, data)
      // create里面正常
      // this.asyncOptions(options, data)
      // create里面正常
      // this.asyncOptions(options, data)
      // this.asyncData(options, data)
      // this.asyncOptionsData(options, data)
      // this.asyncDataOptions(options, data)
    },
    // options, data都是同步的,options比data快
    syncOptionsData(options, data) {
      this.options = options
      this.data = data
    },
    // options, data都是同步的,options比data慢
    syncDataOptions(options, data) {
      this.data = data
      this.options = options
    },
    // options是异步的情况
    asyncOptions(options, data) {
      this.data = data
      window.setTimeout(() => {
        this.options = options
      }, 1000)
    },
    // data是异步的情况
    asyncData(options, data) {
      this.options = options
      window.setTimeout(() => {
        this.data = data
      }, 1000)
    },
    // optinos,data都是异步,但是options比data快
    asyncOptionsData(options, data) {
      window.setTimeout(() => {
        this.options = options
      }, 500)
      window.setTimeout(() => {
        this.data = data
      }, 1000)
    },
    // optinos,data都是异步,但是options比data慢
    asyncDataOptions(options, data) {
      window.setTimeout(() => {
        this.data = data
      }, 500)
      window.setTimeout(() => {
        this.options = options
      }, 1000)
    },
  }
}
</script>

<style lang="stylus" module>
.promise-partner {
  width: 100%;
  height: 300%;
  background: #fff;
  :global {
    .box {
      width: 50px;
      height 50px;
      background: peru;
      margin-bottom: 800px;
    }
  }
}
</style>

<template>
  <div class="keep-alive-list">
    <div class="list">
      <div class="item"
        v-for="(item, index) in list" :key="index">
          <div class="content">{{item.value}}</div>
          <div class="btn-list">
            <div class="pay">支付</div>
            <div class="cancel">取消</div>
            <div class="delete">删除</div>
            <div class="value">改值</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { MUTABLE_KEEP_ALIVE_NAME } from '@/store/modules/keep-alive-name/config.js'
export default {
  name: 'MUTABLE_KEEP_ALIVE_NAME',
  data() {
    return {
      list: [
        {
          status: 0,
          value: 0
        },
        {
          status: 0,
          value: 1
        },
        {
          status: 0,
          value: 2
        },
        {
          status: 0,
          value: 3
        },
        {
          status: 0,
          value: 4
        },
        {
          status: 0,
          value: 5
        },
        {
          status: 0,
          value: 6
        },
        {
          status: 0,
          value: 7
        },
        {
          status: 0,
          value: 8
        },
      ]
    }
  },
  methods: {
    parseStatus() {
      let map = {
        0: ''
      }
    }
  }
}
</script>

<style lang="stylus" modules>

</style>

<template>
  <div :class="$style['sortable']">
    <div ref="wrapper" class="list">
      <div class="item" v-for="(item) in list" :key="item.value">{{item.value}}</div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      list: [
        {
          value: 0,
        },
        {
          value: 1,
        },
        {
          value: 2
        },
        {
          value: 3
        },
        {
          value: 4
        },
        {
          value: 5
        },
        {
          value: 6
        },
      ]
    }
  },
  mounted() {
    const wrapper = this.$refs.wrapper
    /* eslint-disable no-new */
    new Sortable(wrapper, {
      ghostClass: 'dropping',
      onEnd: (e) => {
        const oldIndex = e.oldIndex
        const newIndex = e.newIndex
        // v-for加了key用正常的处理数组算法
        // 没加key需要把数组置空,然后赋予新值
        const moveItem = this.list.splice(oldIndex, 1)[0]
        this.list.splice(newIndex, 0, moveItem)
        console.log(this.list)
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="less" module>
.sortable {
  :global {
    .list {
      .item {
        margin-bottom: 10px;
        height: 120px;
        border-radius: 6px;
        background: peru;
        line-height: 120px;
        color: #fff;
        font-size: 30px;
        text-align: center;
      }
      .dropping {
        background: red;
      }
    }
  }
}
</style>

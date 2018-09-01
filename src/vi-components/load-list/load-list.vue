<!--该组件需要添加监听高度支持-->
<!-- <load-list ref="discList">
  <template slot="default">
    <ul class="recommend-ul">
      <li class="item" v-for="item in discList" :key="item.dissname">
        <div class="icon">
          <img width="60" height="60" v-lazy="item.imgurl">
        </div>
        <div class="text">
          <h2 class="name" v-html="item.creator.name"></h2>
          <p class="desc" v-html="item.dissname"></p>
        </div>
      </li>
    </ul>
  </template>
  <template slot="loading" slot-scope="scope">
    <ul class="recommend-ul">
      <li class="item" v-for="(item, index) in scope.data" :key="index">
        <div class="icon">
          <img width="60" height="60" :src="loadingPic">
        </div>
        <div class="text">
          <h2 class="name">{{item}}</h2>
          <p class="desc"></p>
        </div>
      </li>
    </ul>
  </template>
</load-list> -->

<template>
  <div class="load-list">
    <template v-if="isInit">
      <slot></slot>
    </template>
    <template v-else>
      <slot name="loading" :data="data"></slot>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isInit: false,
      data: [0, 1, 2, 3, 4, 5]
    }
  },
  methods: {
    init() {
      this.isInit = true
    }
  }
}
</script>

<style>

</style>

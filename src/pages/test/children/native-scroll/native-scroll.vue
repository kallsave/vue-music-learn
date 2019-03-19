<template>
  <div class="native-scroll">
    <vi-native-scroll
      ref="scroll">
      <div class="scroll-content">
        <ul class="list">
          <li class="item"
            @click="scrollTo(index)"
            v-for="(item, index) in list" :key="index">{{item}}</li>
        </ul>
      </div>
    </vi-native-scroll>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  },
  methods: {
    scrollTo(index) {
      if (index === 1) {
        this.$refs.scroll.scrollTo(500)
      }
    }
  }

}
</script>

<style lang="stylus" modules>
.native-scroll
  height: 100vh
  background: #fff
  .scroll-content
    .list
      .item
        margin-bottom: 20px
        height: 60px
        background: gold
        color: #fff
        font-size: 18px
        line-height: 60px
        text-align: center
</style>

<template>
  <div class="vi-native-sticky">
    <slot></slot>
    <div ref="fixed" v-show="fixedVisable" :style="fixedStyle"></div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-native-sticky'

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      ViNativeSticky: this
    }
  },
  props: {
    zIndex: {
      type: Number,
      default: 10
    },
    // refresh
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 重新计算位置
    stickyData: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    fixedY: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      fixedVisable: false
    }
  },
  computed: {
    fixedStyle() {
      return {}
    }
  },
  mounted() {

  },
  methods: {
    scrollTop() {
      console.log(66)
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>

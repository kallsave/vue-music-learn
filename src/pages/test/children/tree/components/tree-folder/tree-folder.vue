<template>
  <div :class="$style['tree-folder']">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="title">{{item.title}}</div>
      <div style="margin-left: 20px">
        <tree-folder
          v-if="item.children"
          :list="item.children">
        </tree-folder>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-folder',
  props: {
    list: {
      type: Array,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="stylus" module>
.tree-folder
  :global
    .item
      font-size: 20px
      color: #fff
</style>

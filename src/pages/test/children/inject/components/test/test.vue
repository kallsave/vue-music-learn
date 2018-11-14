<template>
  <div class="test">
    <div v-for="(item, index) in list" :key="index">{{item.name}}</div>
  </div>
</template>

<script>
export default {
  inject: ['viInject'],
  data() {
    return {
      list: this.viInject
    }
  },
  created() {
    console.log(this.viInject)
  }
}
</script>

<style>

</style>

<template>
  <div>test</div>
</template>

<script>
export default {
  inject: ['viInject'],
  data() {
    return {}
  },
  created() {
    console.log('test mounted')
    console.log(this.viInject)
  }
}
</script>

<style>

</style>

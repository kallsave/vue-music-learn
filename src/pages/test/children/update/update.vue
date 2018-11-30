<template>
  <div class="update">
    <update ref="update"
      :is-visible.sync="isVisible"
      @update:isVisible="change"></update>
    <div @click="show">click</div>
  </div>
</template>

<script>
import Update from '../../components/update/update.vue'

export default {
  components: {
    Update
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    show() {
      this.$refs.update.show()
      console.log(this.isVisible)
    },
    change(a) {
      console.log(a, 666)
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>

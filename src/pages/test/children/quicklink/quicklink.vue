<template>
  <div class="quicklink">
    <div style="width: 50px;height: 50px;background:red"
      @click="isShowImage = true"></div>
    <!-- <template v-if="isShowImage">
      <img :src="url" />
    </template> -->
  </div>
</template>

<script>
import quicklink from 'quicklink'

export default {
  data() {
    return {
      isShowImage: false,
      url: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js'
    }
  },
  mounted() {
    let url = this.url
    quicklink({
      urls: [
        url
      ]
    })
  }
}
</script>

<style lang="stylus" modules>

</style>

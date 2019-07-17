<template>
  <div :class="$style['auto-size']">
    <textarea ref="textarea"
      :style="textareaStyle"
      v-model="currentVal"
      @input="handleInput">
    </textarea>
  </div>
</template>

<script>
import calcTextareaHeight from './calcTextareaHeight'

export default {
  data() {
    return {
      currentVal: '',
      textareaStyle: {},
      autosize: {
        minRows: 2,
        maxRows: 10
      }
    }
  },
  watch: {
    currentVal: {
      handler() {
        this.$nextTick(this.resizeTextarea)
      }
    }
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.setCurrentValue(value)
      console.log(this.currentVal)
    },
    setCurrentValue(value) {
      this.$nextTick(this.resizeTextarea)
    },
    resizeTextarea() {
      const minRows = this.autosize.minRows
      const maxRows = this.autosize.maxRows
      this.textareaStyle = calcTextareaHeight(this.$refs.textarea, minRows)
    }
  }
}
</script>

<style lang="stylus" module>
.auto-size
  height: 100vh
</style>

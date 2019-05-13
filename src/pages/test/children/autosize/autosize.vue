<template>
  <div class="auto-size">
    <textarea ref="textarea"
      :style="textareaStyle"
      v-model="currentVal"
      @input="handleInput"></textarea>
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
    },
    setCurrentValue(value) {
      this.currentVal = value
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

<style>

</style>

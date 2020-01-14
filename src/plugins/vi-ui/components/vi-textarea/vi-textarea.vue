<template>
  <textarea
    ref="textarea"
    class="vi-textarea"
    v-model="currentVal"
    :style="textareaStyle"
    :placeholder="placeholder">
  </textarea>
</template>

<script>
import calcTextareaHeight from './calc-textarea-height.js'

const COMPONENT_NAME = 'vi-textarea'

export default {
  name: COMPONENT_NAME,
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    autosize: {
      type: [Boolean, Object],
      default: true
    }
  },
  data() {
    return {
      textareaStyle: {},
      currentVal: '',
    }
  },
  computed: {
    _autosize() {
      if (this.autosize) {
        return {
          minRows: this.autosize.minRows || 1,
          maxRows: this.autosize.maxRows || null
        }
      } else {
        return false
      }
    }
  },
  watch: {
    currentVal: {
      handler() {
        if (this._autosize) {
          this.$nextTick(this.resizeTextarea)
        }
      },
      immediate: true
    }
  },
  methods: {
    resizeTextarea() {
      const minRows = this.autosize.minRows
      const maxRows = this.autosize.maxRows
      this.textareaStyle = calcTextareaHeight(this.$refs.textarea, minRows)
    }
  }
}
</script>

<style lang="stylus">
.vi-textarea
  display: block
  border: none
  outline: none
  resize: none
  width: 100%
  color: inherit
  font-size: 1em
  line-height: inherit
  outline: 0
</style>

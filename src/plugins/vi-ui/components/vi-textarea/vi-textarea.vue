<template>
  <textarea v-model="currentVal"
    :style="textareaStyle"
    @input="inputHandler($event)"></textarea>
</template>

<script>
import {
  multiDeepClone
} from '@/common/helpers/utils.js'

const COMPONENT_NAME = 'vi-textarea'

export default {
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
      default: false
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
      }
    },
    immediate: true
  },
  methods: {
    inputHandler(event) {
      const value = event.target.value
      this.setCurrentValue(value)
      console.log(this.currentVal)
    },
    setCurrentValue(value) {
      if (this._autosize) {
        this.$nextTick(this.resizeTextarea)
      }
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

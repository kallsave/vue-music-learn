export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      isVisible: false
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.isVisible = newVal
      }
    }
  },
  methods: {
    show() {
      this.isVisible = true
      this.clearTimer()
      this.$nextTick(() => {
        if (this.duration !== 0) {
          this.timer = window.setTimeout(() => {
            this.hide()
          }, this.duration)
        }
      })
    },
    hide() {
      this.isVisible = false
      this.clearTimer()
    },
    clearTimer() {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  },
  beforeDestroy() {
    this.clearTimer()
  }
}

export default {
  props: {
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
  methods: {
    show() {
      this.isVisible = true
      this.clearTimer()
      this.$nextTick(() => {
        if (this.duration !== 0) {
          this.timer = setTimeout(() => {
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
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  destroyed() {
    this.clearTimer()
  }
}

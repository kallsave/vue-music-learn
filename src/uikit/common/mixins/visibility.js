export default {
  props: {
    value: {
      type: Boolean,
      default: false
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
    hide() {
      this.isVisible = false
    },
    show() {
      this.isVisible = true
    }
  }
}

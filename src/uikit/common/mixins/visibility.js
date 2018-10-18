export default {
  data() {
    return {
      isVisible: false
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

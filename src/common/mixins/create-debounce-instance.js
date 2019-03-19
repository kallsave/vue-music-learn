import { Debounce } from '@/common/helpers/utils.js'

export default {
  mounted() {
    this._createDebounceInstance()
  },
  methods: {
    _createDebounceInstance() {
      this.debounce = new Debounce(400)
    },
  },
  beforeDestroy() {
    this.debounce.destroy()
  }
}

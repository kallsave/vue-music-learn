import { Throttle } from '@/common/helpers/utils.js'

export default {
  mounted() {
    this._createThrottleInstance()
  },
  methods: {
    _createThrottleInstance() {
      this.throttle = new Throttle(1000)
    },
  },
  destroyed() {
    this.debounce.destroy()
  },
}

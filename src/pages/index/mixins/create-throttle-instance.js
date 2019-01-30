import { Throttle } from '@/common/helpers/utils.js'

export default {
  mounted() {
    this._createThrottleInstance()
  },
  methods: {
    _createThrottleInstance() {
      this.throttleHandler = new Throttle(1000)
    },
  },
}

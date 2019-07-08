import { Throttle } from '@/common/helpers/utils.js'

export default {
  name: 'throttle-button',
  abstract: true,
  props: {
    throttleTime: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {}
  },
  render() {
    this._throttle = new Throttle(this.throttleTime)
    const slot = this.$slots.default[0]
    if (slot && slot.data && slot.data.on && slot.data.on.click) {
      let clickEvent = slot.data.on.click
      if (typeof clickEvent === 'function') {
        slot.data.on.click = () => {
          this._throttle.run(() => {
            clickEvent()
          })
        }
      }
    }
    return slot
  },
  beforeDestroy() {
    this._throttle.destroy()
  },
}

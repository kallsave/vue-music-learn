const COMPONENT_NAME = 'vi-inject'

export default {
  name: COMPONENT_NAME,
  provide() {
    return {
      viInject: this.viInject
    }
  },
  props: {
    viInject: {
      default() {
        return {}
      }
    }
  },
  render(h) {
    console.log(this._provided)
    console.log(this.$slots.default[0])
    return h(
      this.$slots.default[0].componentOptions.tag
    )
  },
}

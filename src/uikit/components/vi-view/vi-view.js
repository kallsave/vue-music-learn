const COMPONENT_NAME = 'vi-view'

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { props, children, parent, data }) {
    return h(children[0].children[0].componentOptions.tag, {
      attrs: data.attrs
    }, children)
  },
}

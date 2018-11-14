const COMPONENT_NAME = 'vi-view'

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { props, children, parent, data }) {
    console.log(props)
    console.log(data)
    console.log('data._provided', data._provided)
    return h(children[0].children[0].componentOptions.tag, {
      attrs: data.attrs,
      provide: data.attrs
    }, children)
  },
}

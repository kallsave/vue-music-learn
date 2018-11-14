import { hasClass } from '../../common/helpers/dom.js'

const COMPONENT_NAME = 'vi-view'

function findClass(parent, className) {
  console.log(parent)
  console.log('parent.$children', parent.$children)
}

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { props, children, parent, data }) {
    console.log(children)
    findClass(parent, 'header')
    console.log(props)
    console.log(data)
    return h(children[0].children[0].componentOptions.tag, {
      attrs: data.attrs,
      provide: data.attrs
    }, children)
  },
}

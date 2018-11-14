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
    return h(children[0].children[0].componentOptions.tag, {
      attrs: data.attrs
    }, children)
  },
}

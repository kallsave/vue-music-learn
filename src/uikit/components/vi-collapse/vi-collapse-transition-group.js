import { transitionEvent } from './transition-event.js'

const COMPONENT_NAME = 'vi-collapse-transition-group'

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { children, data }) {
    let tag = 'div'
    if (data.attrs && data.attrs.tag) {
      tag = data.attrs.tag
    }
    return h('transition-group', {
      on: transitionEvent,
      props: {
        tag: tag
      }
    }, children)
  },
}

import { transitionEvent } from './transition-event.js'

const COMPONENT_NAME = 'vi-collapse-transition-group'

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { children, data }) {
    let tag
    if (!data.attrs || !data.attrs.tag) {
      tag = 'div'
    }
    return h('transition-group', {
      on: transitionEvent,
      props: {
        tag: tag
      }
    }, children)
  },
}

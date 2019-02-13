import { transitionEvent } from './transition-event.js'

const COMPONENT_NAME = 'vi-collapse-transition'

export default {
  name: COMPONENT_NAME,
  functional: true,
  render(h, { children, data }) {
    return h('transition', {
      on: transitionEvent
    }, children)
  },
}

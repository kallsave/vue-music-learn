import Events from '../util/events'
import historyStack from './history-stack'
let historyStateEvent = new Events()

window.addEventListener('hashchange', () => {
  if (historyStack.getByIndex(1) === window.location.href) {
    historyStateEvent.emit('back')
  } else {
    historyStateEvent.emit('go')
  }
})

export default historyStateEvent

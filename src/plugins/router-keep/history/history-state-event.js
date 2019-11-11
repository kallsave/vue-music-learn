import Events from '../util/events'
import historyStack from './history-stack'
import { EVENT_HISTORY_ACTION_BACK, EVENT_HISTORY_ACTION_FORWARD } from './history-action-name'

const historyStateEvent = new Events()

window.addEventListener('hashchange', () => {
  if (historyStack.getByIndex(1) === window.location.href) {
    historyStateEvent.emit(EVENT_HISTORY_ACTION_BACK)
  } else {
    historyStateEvent.emit(EVENT_HISTORY_ACTION_FORWARD)
  }
})

export default historyStateEvent

import historyStack from '../history/history-stack'
import historyStateEvent from '../history/history-state-event'
import { EVENT_HISTORY_ACTION_BACK, EVENT_HISTORY_ACTION_FORWARD } from '../history/history-action-name'
import { defineReactive } from '../util/lang'
import routerKeepHelper from '../api/router-keep-helper'
import config from '../config/index'

let isBack = false

historyStateEvent.on(EVENT_HISTORY_ACTION_BACK, () => {
  historyStack.reduce()
  isBack = true
  config.setHistoryStack(historyStack.getStore())
})

const routerMiddle = (Vue, config) => {
  const router = config.router
  const actionKey = config.actionKey

  router.beforeEach((to, from, next) => {
    // let hashchange I/0 event trigger callback before next trigger to get right isBack
    window.setTimeout(() => {
      if (isBack) {
        to.params[actionKey] = EVENT_HISTORY_ACTION_BACK
      } else {
        to.params[actionKey] = EVENT_HISTORY_ACTION_FORWARD
      }
      next()
    }, 0)
  })

  defineReactive(router.history, 'current', router.history.current, () => {
    Vue.nextTick(() => {
      if (!isBack) {
        historyStack.add(window.location.href)
      }
      config.setHistoryStack(historyStack.getStore())
      isBack = false
    })
  })
}

export default routerMiddle

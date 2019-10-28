import historyStack from '../history/history-stack'
import historyStateEvent from '../history/history-state-event'

let isUseSetTimeout = true
let isBack = false

historyStateEvent.on('back', () => {
  isBack = true
})

export const routerHandler = (Vue, router) => {
  Vue.util.defineReactive(router.history, 'current', router.history.current, () => {
    Vue.nextTick(() => {
      historyStack.add(window.location.href)
    })
  })

  router.beforeEach((to, from, next) => {
    if (isUseSetTimeout) {
      // let hashchange-api before next-api
      window.setTimeout(() => {
        if (isBack) {
          to.params.actions = 'back'
        } else {
          to.params.actions = 'go'
        }
        isBack = false
        next()
      }, 0)
    } else {
      next()
    }
  })
}

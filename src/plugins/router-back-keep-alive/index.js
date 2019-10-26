import Component from './component.js'

let isInstalled = false

function install(Vue, router) {
  if (isInstalled) {
    return
  }
  isInstalled = true
  Vue.component(Component.name, Component)
  router.beforeEach(async (to, from, next) => {
    await (() => {
      return new Promise((resolve) => {
        resolve()
      })
    })
    window.setTimeout(() => {
      console.log('next')
      next()
    }, 0)
  })
}

window.addEventListener('hashchange', (e) => {
  // 第一次触发hashchange肯定是浏览器的点击后退
  console.log('hashchange')
})

const routerBackKeepAlive = {
  install: install,
}

export default routerBackKeepAlive

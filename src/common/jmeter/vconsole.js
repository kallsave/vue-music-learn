import VConsole from 'vconsole'

let vConsole = new VConsole()
let vConsoleFirst = false

function observeProperty(obj, key, fn) {
  let val = obj[key]
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      if (typeof fn === 'function') {
        fn()
      }
    }
  })
}
observeProperty(vConsole, 'isInited', function () {
  if (vConsoleFirst) {
    return
  }
  vConsoleFirst = true
  vConsole.$dom.style.display = 'none'
})

export function showVConsole() {
  window.setTimeout(() => {
    if (vConsole) {
      vConsole.$dom.style.display = 'block'
    }
  }, 3000)
}

import { requestAnimationFrame, cancelAnimationFrame } from './bom.js'
import { mulitDeepClone } from './utils.js'

// 时间戳,开始的位置,要运动的距离,动画持续的时间
// function easeInOutQuad(t, b, c, d) {
//   t /= d / 2
//   if (t < 1) {
//     return c / 2 * t * t + b
//   }
//   t--
//   return -c / 2 * (t * (t - 2) - 1) + b
// }

// 时间占比
function easeInOutQuad(t) {
  return 1 - (--t * t * t * t)
}

class Move {
  constructor(target, options) {
    this.init(target, options)
  }
  init(target, options) {
    this.target = target
    this.offset = mulitDeepClone({}, options.offset)
    this.duration = options.duration
    this.easing = options.easing
    this.done = options.done
    this.run()
  }
  run() {
    for (let key in this.offset) {
      let count = this.offset[key]
      this.offset[key] = {
        begin: 0,
        count: count
      }
    }
    this.requestAnimationFrameId = requestAnimationFrame((timeCurrent) => {
      this.timeStart = timeCurrent
      this.isRunning = true
      this.loop(timeCurrent)
    })
  }
  loop(timeCurrent) {
    if (!this.isRunning) {
      return
    }

    this.update(timeCurrent)
    this.timeCurrent < this.duration
      ? this.continueHandler()
      : this.doneHandler()
  }
  continueHandler() {
    this.transform()
    this.requestAnimationFrameId = requestAnimationFrame((timeCurrent) => {
      this.loop(timeCurrent)
    })
  }
  doneHandler() {
    this.timeCurrent = this.duration
    this.transform()
    if (typeof this.done === 'function') {
      this.done()
    }
  }
  update(timeCurrent) {
    this.timeCurrent = timeCurrent - this.timeStart
  }
  transform() {
    let transform = ''
    for (let key in this.offset) {
      // 时间戳,开始的位置,要运动的距离,动画持续的时间
      // 时间戳是变化的,其它不变
      let timeCurrent = this.timeCurrent
      let begin = this.offset[key].begin
      let count = this.offset[key].count
      let duration = this.duration
      // 普通缓动公式模式
      // if (isRunning) {
      //   let next = this.easing(timeCurrent, begin, count, duration)
      //   transform += `${key}(${next}px)`
      // } else {
      //   transform += `${key}(${count}px)`
      // }
      // 时间占比缓动公式模式
      if (this.timeCurrent < this.duration) {
        let now = this.timeCurrent / this.duration
        let next = (count - begin) * now
        transform += `${key}(${next}px) `
      } else {
        transform += `${key}(${count}px) `
      }
    }
    this.target.style.transform = transform
  }
  stop() {
    // this.isRunning = false
    cancelAnimationFrame(this.requestAnimationFrameId)
  }
}

const slow = (target, options) => {
  let defaultOptions = {
    offset: {},
    duration: 1000,
    easing: easeInOutQuad,
    done: function () {}
  }
  return new Move(target, mulitDeepClone({}, defaultOptions, options))
}

export default slow

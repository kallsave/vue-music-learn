import { requestAnimationFrame } from './bom.js'
import { mulitDeepClone } from './utils.js'

let target
let timeStart

function easeInOutQuad(t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

class Move {
  constructor(target, options) {
    this.init(target, options)
  }
  init(target, options) {
    this.target = target
    this.offset = options.offset
    this.duration = options.duration
    this.easing = options.easing
    this.done = options.done

    for (let key in this.offset) {
      let distance = this.offset[key]
      this.offset[key] = {
        start: 0,
        distance: distance
      }
    }
    window.requestAnimationFrame((timeCurrent) => {
      this.timeStart = timeCurrent
      this.loop(timeCurrent)
    })
  }
  update(timeCurrent) {
    this.timeElapsed = timeCurrent - this.timeStart
  }
  requestAnimationFrame(timeCurrent) {
    this.transform(true)
    window.requestAnimationFrame((timeCurrent) => {
      this.loop(timeCurrent)
    })
  }
  loop(timeCurrent) {
    this.update(timeCurrent)
    this.timeElapsed < this.duration
      ? this.requestAnimationFrame()
      : this.doneCallback()
  }
  transform(isUseEase) {
    let transform = ''

    for (let key in this.offset) {
      // 时间刻度,开始的位置,要运动的距离,动画持续的时间
      // 时间刻度是变化的,其它不变
      let start = this.offset[key].start
      let distance = this.offset[key].distance
      if (isUseEase) {
        let next = this.easing(this.timeElapsed, start, distance, this.duration)
        transform += `${key}(${next}px) `
      } else {
        transform += `${key}(${distance}px) `
      }
    }

    this.target.style.transform = transform
  }
  doneCallback() {
    this.transform(false)
    if (typeof this.done === 'function') {
      this.done()
    }
  }
}

const slow = (target, options) => {
  let defaultOptions = {
    offset: {},
    duration: 1000,
    easing: easeInOutQuad,
    done: function () {}
  }
  let o = new Move(target, mulitDeepClone({}, defaultOptions, options))
}

export default slow

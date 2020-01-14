/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2020-01-10 14:17:14
 */

export function getRandomInt(min, max) {
  // Math.random()不包括1,有缺陷
  return Math.random() * (max - min + 1) + min | 0
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function isEmptyObject(obj) {
  for (const key in obj) {
    return false
  }
  return true
}

export function camelize(str) {
  str = String(str)
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

export function middleline(str) {
  str = String(str)
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const DEFAULT_TIME_SLICE = 400

export class Debounce {
  constructor(timeSlice = DEFAULT_TIME_SLICE) {
    this.timeSlice = timeSlice
  }
  run(func) {
    if (typeof func === 'function') {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = window.setTimeout(func, this.timeSlice)
    }
  }
  destroy() {
    window.clearTimeout(this.timer)
    this.timer = null
    this.timeSlice = null
  }
}

export class Throttle {
  constructor(timeSlice = DEFAULT_TIME_SLICE) {
    this.timeSlice = timeSlice
  }
  run(func, overload) {
    let currentTime = new Date().getTime()
    if (!this.lastTime || currentTime - this.lastTime > this.timeSlice) {
      this.lastTime = currentTime
      if (typeof func === 'function') {
        func()
      }
    } else {
      if (typeof overload === 'function') {
        overload()
      }
    }
  }
  destroy() {
    this.timeSlice = null
    this.lastTime = null
  }
}

export function getUrlParams(currentUrl = window.location.href) {
  const result = {}
  if (currentUrl.indexOf('?') === -1) {
    return result
  }
  const paramsUrl = currentUrl.replace(/.*\?/g, '')
  const arr = paramsUrl.match(/[^&]+?=[^&]*/g)
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const reg = new RegExp(`(.+?)=(.*)`)
      reg.exec(arr[i])
      const key = decodeURIComponent(RegExp.$1)
      const value = decodeURIComponent(RegExp.$2)
      result[key] = value
    }
  }
  return result
}

export function parseParamUrl(originUrl, data) {
  let url = ''
  for (const k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  url = url ? url.substring(1) : ''

  originUrl += (originUrl.indexOf('?') === -1 ? '?' : '&') + url

  return originUrl
}

export function checkClass(o) {
  return Object.prototype.toString.call(o).slice(8, -1)
}

function deepClone(o) {
  let ret
  let instance = checkClass(o)
  if (instance === 'Array') {
    ret = []
  } else if (instance === 'Object') {
    ret = {}
  } else {
    return o
  }

  for (const key in o) {
    const copy = o[key]
    ret[key] = deepClone(copy)
  }

  return ret
}

function deepAssign(to, from) {
  for (const key in from) {
    if (!to[key] || typeof to[key] !== 'object') {
      to[key] = from[key]
    } else {
      deepAssign(to[key], from[key])
    }
  }
}

export function multiDeepClone(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    const source = deepClone(rest[i])
    deepAssign(target, source)
  }
  return target
}

export function stringRepeat(str, num) {
  return new Array(num + 1).join(str)
}

export function padLeftZero(str, n = 2) {
  return (stringRepeat('0', n) + str).substr(str.length)
}

// 格式化时间
export function formatDate(date, format = 'YYYY-MM-DD hh:mm:ss') {
  const o = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    't+': date.getMilliseconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      const str = o[k] + ''
      format = format.replace(RegExp.$1, padLeftZero(str, RegExp.$1.length))
    }
  }
  return format
}

// 倒计时
export function formatCountDown(countDownStamp, format = 'DD天 hh:mm:ss') {
  if (countDownStamp < 0) {
    countDownStamp = 0
  }
  const millisecond = countDownStamp % 1000
  const restSecond = (countDownStamp - millisecond) / 1000
  const second = restSecond % 60
  const restMinute = (restSecond - second) / 60
  const minute = restMinute % 60
  const restHour = (restMinute - minute) / 60
  const hour = restHour % 24
  const restDay = (restHour - hour) / 24
  const day = restDay
  const o = {
    'D+': day,
    'h+': hour,
    'm+': minute,
    's+': second,
    't+': millisecond
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      const str = o[k] + ''
      format = format.replace(RegExp.$1, padLeftZero(str, RegExp.$1.length))
    }
  }
  return format
}

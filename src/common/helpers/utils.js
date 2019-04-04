/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2019-04-04 08:22:54
 */

/**
 * 补零
 *
 * @export
 * @param {Number} num 被补零的数据
 * @param {Number} [n=2] 补零的个数,默认是2
 * @returns
 */
export function padZero(num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

/**
 * 返回min~max之间的整数
 *
 * @param {Number} min 较小的数字
 * @param {Numbe} max 较大的数字
 * @returns
 */
function getRandomInt(min, max) {
  if (min - max > 0) {
    var temp = min
    min = max
    max = temp
  }
  // Math.random()不包括1,有缺陷
  return Math.random() * (max - min + 1) + min | 0
}

/**
 * 打乱一个数组
 *
 * @export
 * @param {Array} arr
 * @returns
 */
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

/**
 * 判断是否是空对象
 *
 * @export
 * @param {Object, Array} obj
 * @returns
 */
export function isEmptyObject(obj) {
  for (let key in obj) {
    return false
  }
  return true
}

/**
 * '-'转驼峰
 *
 * @export
 * @param {*} str
 * @returns
 */
export function camelize(str) {
  str = String(str)
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

/**
 * 驼峰转'-'
 *
 * @export
 * @param {*} str
 * @returns
 */
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

/**
 * 获取url参数
 *
 * @export
 * @param {String} [currentUrl=window.location.href] 默认是浏览器地址
 * @returns
 */
export function getUrlParam(currentUrl = window.location.href) {
  let result = {}
  if (currentUrl.indexOf('?') === -1) {
    return result
  }
  currentUrl = currentUrl.replace(/.*\?/g, '')
  if (currentUrl.length === 0) {
    return result
  }
  let arr = currentUrl.match(/[^&]+?=[^&]*/g).join('=').split('=')
  for (let i = 0; i < arr.length; i += 2) {
    result[arr[i]] = arr[i + 1]
  }
  return result
}

export function checkClass(o) {
  return Object.prototype.toString.call(o).slice(8, -1)
}

export function deepClone(o) {
  let ret
  let instance = checkClass(o)
  if (instance === 'Array') {
    ret = []
  } else if (instance === 'Object') {
    ret = {}
  } else if (instance === 'Function') {
    /* eslint-disable no-eval */
    return eval('(' + o.toString() + ')')
  } else {
    return o
  }

  for (let key in o) {
    let copy = o[key]
    ret[key] = deepClone(copy)
  }

  return ret
}

/**
 *
 * 给target合并key(深度)
 * @export
 * @param {Object} to
 * @param {Object} from
 * @returns
 */
export function deepAssign(to, from) {
  for (let key in from) {
    if (!to[key] || typeof to[key] !== 'object') {
      to[key] = from[key]
    } else {
      deepAssign(to[key], from[key])
    }
  }
}

/**
 * 支持多参数的深度克隆
 * 后面的优先级最大
 * @export
 * @param {Object} target
 * @param {Object} rest
 * @returns
 */
export function mulitDeepClone(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = deepClone(rest[i])
    deepAssign(target, source)
  }
  return target
}

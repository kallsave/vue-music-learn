/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2018-10-15 19:34:21
 */

/**
 * 补零
 *
 * @export
 * @param {Number} num 被补零的数据
 * @param {Number} [n=2] 补零的个数,默认是2
 * @returns
 */
export function padZero (num, n = 2) {
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
function getRandomInt (min, max) {
  // Math.random()不包括1,有缺陷
  // Matho.random的作用
  return Math.random() * (max - min + 1) + min | 0
}

/**
 * 打乱一个数组
 *
 * @export
 * @param {Array} arr
 * @returns
 */
export function shuffle (arr) {
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
export function isEmptyObject (obj) {
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
export function camelize (str) {
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
export function middleline (str) {
  str = String(str)
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// setTimeout节流高阶函数,被节流函数和一个节流时间
let globalTimer
export function debounce (func, delay) {
  // 捕获args传给下一级
  // ...args是...arguments的简写
  return function (...args) {
    if (globalTimer) {
      clearTimeout(globalTimer)
    }
    // 箭头函数的arguments是外部函数的arguments
    globalTimer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 深度合并,不是深度克隆
 *
 * @param {Object} to
 * @param {Object} from
 */
function deepAssign (to, from) {
  for (let key in from) {
    if (!to[key] || typeof to[key] !== 'object') {
      to[key] = from[key]
    } else {
      deepAssign(to[key], from[key])
    }
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
  if (currentUrl.indexOf('?') === -1) {
    return {}
  }
  let result = {}
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

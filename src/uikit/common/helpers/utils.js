/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2018-10-15 19:34:21
 */

/**
* '-'转驼峰
*
* @export
* @param {String} str
* @returns
*/
export function camelize(str) {
  str = String(str)
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

// setTimeout节流高阶函数,被节流函数和一个节流时间
let globalTimer
export function debounce(func, delay) {
  return function (...args) {
    if (globalTimer) {
      clearTimeout(globalTimer)
    }
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
* 数组合并并且去重
*
* @export
* @param {Array, Array...}
* @returns new Array
*/
export function assignArray () {
  let arr = [].concat.apply([], arguments)
  let ret = []
  for (let i = 0, len = arr.length; i < len; i++) {
    if (ret.indexOf(arr[i]) !== -1) {
      ret.push(arr[i])
    }
  }
  return ret
}

/**
* 去掉数组中指定的元素
* 第一个参数是需要操作的数组,后面的参数是包含需要去掉的元素的数组
* @export
* @param {Array, Array...}
* @returns new Array
*/
export function spliceArray() {
  let arr = arguments[0]
  let spliceList = [].concat.apply([], [].slice.call(arguments, 1))
  return arr.filter((item) => {
    return spliceList.indexOf(item) === -1
  })
}

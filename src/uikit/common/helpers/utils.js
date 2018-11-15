/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2018-11-15 19:37:34
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

export function checkClass (o) {
  return Object.prototype.toString.call(o).slice(8, -1)
}

export function deepClone (o) {
  let ret
  let instance = checkClass(o)
  if (instance === 'Array') {
    ret = []
  } else if (instance === 'Object') {
    ret = {}
  } else {
    return o
  }

  for (let key in o) {
    let copy = o[key]
    let instance = checkClass(copy)
    if (instance === 'Object') {
      ret[key] = deepClone(copy)
    } else if (instance === 'Array') {
      ret[key] = deepClone(copy)
    } else {
      ret[key] = copy
    }
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
function deepAssign(to, from) {
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

/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:07:37
 * @Last Modified by: kallsave
 * @Last Modified time: 2019-01-09 20:50:15
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

export function pxToNum(str) {
  str = str + ''
  return Number(str.replace(/px/g, ''))
}

export function padPx(num) {
  return `${num}px`
}

export function styleTogglePx(style, mode = true) {
  const list = [
    'width',
    'height',
    'line-height',
    'font-size',
    'left',
    'right',
    'top',
    'bottom',
    'margin-left',
    'margin-right',
    'margin-top',
    'margin-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'padding-bottom',
  ]

  const map = {}

  for (let key in style) {
    if (list.indexOf(key) !== -1) {
      if (mode && !isNaN(style[key] - 0)) {
        map[key] = padPx(style[key])
      } else if (!mode) {
        map[key] = pxToNum(style[key])
      }
    }
  }

  return mulitDeepClone(style, map)
}

export function stylePadPx(style) {
  return styleTogglePx(style, true)
}

export function styleRemovePx(style) {
  return styleTogglePx(style, false)
}

/**
* 数组合并并且去重
*
* @export
* @param {Array, Array...}
* @returns new Array
*/
export function assignArray() {
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

/**
 * setTimeout防抖高阶函数
 * 延迟一段时间执行,这段时间如果产生新的数据,重新开始计时
 * 场景:输入框ajax
 * @export
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    // 箭头函数的arguments是外部函数的arguments
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 高阶节流函数
 * 每隔一段时间执行一次,中间的时间段执行的都被抛弃
 * 场景: 密集操作DOM元素等消耗内存的动作
 * @export
 * @param {Function} func
 * @param {Number} longtime
 * @returns
 */
export function throttle(func, longtime) {
  let throttleObj = {}
  return function (...args) {
    let time = new Date().getTime()

    if (!throttleObj.lastTime || time - throttleObj.lastTime > longtime) {
      throttleObj.lastTime = time
      func.apply(this, args)
    }
  }
}

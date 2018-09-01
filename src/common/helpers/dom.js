export function hasClass (el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass (el, className) {
  /* istanbul ignore if */
  if (hasClass(el, className)) {
    return
  }

  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass (el, className) {
  /* istanbul ignore if */
  if (!hasClass(el, className)) {
    return
  }

  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function getData (el, name) {
  const prefix = 'data-'
  return el.getAttribute(prefix + name)
}

// getRect是获取相对父元素的位置,如果想获取相对页面的位置
// 请使用getBoundingClientRect
export function getRect (el) {
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

let vendor = (() => {
  let elementStyle = document.createElement('div').style
  let transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  /* istanbul ignore next */
  return false
})()

export function prefixStyle (style) {
  /* istanbul ignore if */
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getMatchedTarget(e, targetClassName) {
  let el = e.target

  while (el && !hasClass(el, targetClassName)) {
    if (el === e.currentTarget) return null
    el = el.parentNode
  }

  return el
}

export function dispatchEvent (ele, name, { type = 'Event', bubbles = true, cancelable = true } = {}) {
  const e = document.createEvent(type)
  e.initEvent(name, bubbles, cancelable)
  ele.dispatchEvent(e)
}

// 得到transform上的rotate,其他值不准确
export function getTransformAngle (dom) {
  const transform = prefixStyle('transform')
  let matrix = getComputedStyle(dom).getPropertyValue(transform)
  let angle = 0
  if (matrix && matrix !== 'none') {
    let values = matrix.split('(')[1].split(')')[0].split(',')
    let a = values[0]
    let b = values[1]
    let c = values[2]
    let d = values[3]
    angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
  }
  return angle
}

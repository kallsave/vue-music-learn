import { getData, setData } from '@/common/helpers/dom.js'

const touchstartHandler = function (e) {
  let scrollWrapper = e.currentTarget
  let startY = e.changedTouches[0].pageY
  setData(scrollWrapper, 'start-y', startY)
}

const touchmoveHandler = function (e) {
  e.stopPropagation()
  let scrollWrapper = e.currentTarget
  let startY = getData(scrollWrapper, 'start-y') - 0
  let moveY = e.changedTouches[0].pageY
  let disY = moveY - startY
  let scrollHeight = scrollWrapper.scrollHeight
  let clientHeight = scrollWrapper.clientHeight
  let scrollTop = scrollWrapper.scrollTop
  // 说明是可滚动元素
  if (scrollHeight > clientHeight) {
    // 阻止ios上内部滚动触发body滚动
    if (scrollTop <= 0 && disY > 0) {
      e.preventDefault()
    } else if (scrollHeight - clientHeight <= scrollTop && disY <= 0) {
      e.preventDefault()
    }
  } else {
    e.preventDefault()
  }
}

const stopPropagationScroll = {
  bind(el, binding, vnode) {
    el.addEventListener('touchstart', touchstartHandler, false)
    el.addEventListener('touchmove', touchmoveHandler, false)
  },
  unbind(el, binding) {
    el.removeEventListener('touchstart', touchstartHandler, false)
    el.removeEventListener('touchmove', touchmoveHandler, false)
  }
}

export default stopPropagationScroll

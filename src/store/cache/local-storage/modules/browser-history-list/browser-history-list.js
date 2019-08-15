import local from '../../index.js'
import Stack from '@/common/class/stack.js'

const KEY = '__BROWSER_HISTORY__'

let browserHistoryStack = new Stack()

// 存储一天
const TIME_SLICE = 1000 * 60 * 60 * 24

export function browserHistoryGet() {
  let browserHistoryList = local.get(KEY)
  if (browserHistoryList && browserHistoryList.length) {
    browserHistoryStack.add(...browserHistoryList.reverse())
    return browserHistoryList
  }
  return []
}

export function browserHistoryAdd(url) {
  browserHistoryStack.add(url)
  let browserHistoryList = browserHistoryStack.getList()
  local.set(KEY, browserHistoryList, new Date().getTime() + TIME_SLICE)
  return browserHistoryList
}

export function browserHistoryReduce() {
  browserHistoryStack.reduce()
  let browserHistoryList = browserHistoryStack.getList()
  local.set(KEY, browserHistoryList, new Date().getTime() + TIME_SLICE)
  return browserHistoryList
}

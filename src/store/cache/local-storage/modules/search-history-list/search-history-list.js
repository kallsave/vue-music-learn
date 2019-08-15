import local from '../../index.js'

const KEY = '__search__'

const SEARCH_MAX_LENGTH = 6

const TIEM_SLICE = 1000 * 60 * 60 * 24

function insertArray({ arr, val, compare = (item) => {
  return item === val
}, maxLength } = {}) {
  const index = arr.findIndex(compare)

  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

function deleteFromArray({ arr, val, compare = (item) => {
  return item === val
}}) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function searchHistoryGet() {
  return local.get(KEY) || []
}

export function searchHistoryAdd(query) {
  let searchList = searchHistoryGet()
  insertArray({
    arr: searchList,
    val: query,
    maxLength: SEARCH_MAX_LENGTH
  })
  // 存储一天
  local.set(KEY, searchList, new Date().getTime() + TIEM_SLICE)
  return searchList
}

export function searchHistoryDelete(query) {
  let searchList = searchHistoryGet()
  deleteFromArray({
    arr: searchList,
    val: query,
  })
  local.set(KEY, searchList)
  return searchList
}

export function searchHistoryClear() {
  local.remove(KEY)
  return []
}

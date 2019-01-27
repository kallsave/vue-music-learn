import local from '../../index.js'

const SEARCH_KEY = '__search__'

const SEARCH_MAX_LENGTH = 8

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

export function loadSearch() {
  return local.get(SEARCH_KEY) || []
}

export function saveSearch(query) {
  let searchList = loadSearch()
  let timeSlice = 1000 * 60 * 60 * 24
  insertArray({
    arr: searchList,
    val: query,
    maxLength: SEARCH_MAX_LENGTH
  })
  // 存储一天
  local.set(SEARCH_KEY, searchList, new Date().getTime() + timeSlice)
  return searchList
}

export function deleteSearch(query) {
  let searchList = loadSearch()
  deleteFromArray({
    arr: searchList,
    val: query,
  })
  local.set(SEARCH_KEY, searchList)
  return searchList
}

export function clearSearch() {
  local.remove(SEARCH_KEY)
  return []
}

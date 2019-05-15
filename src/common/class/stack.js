// 一个shift/unshift的数据栈

export default class Stack {
  // 设置最大存储
  constructor(maxLength) {
    this.maxLength = maxLength
    this.init()
  }
  init() {
    this.list = []
  }
  // 添加已存在元素时添加无效,原元素位置置顶
  add(element) {
    const index = this.list.findIndex((item) => {
      return item === element
    })
    if (index !== -1) {
      this.list.splice(index, 1)
    }
    this.list.unshift(element)
    if (this.list.length > this.maxLength) {
      this.list.pop()
    }
  }
  // 快捷删除头元素,相当于backToByIndex(1)
  reduce() {
    if (!this.list.length) {
      return false
    }
    return this.list.shift()
  }
  // 删除从这个元素连同在这个元素前面先添加的元素都删除
  removeFrom(element) {
    const index = this.list.findIndex((item) => {
      return item === element
    })
    if (index !== -1) {
      return this.list.splice(index)
    }
    return false
  }
  // 删除指定的元素
  remove(element) {
    const index = this.list.findIndex((item) => {
      return item === element
    })
    if (index === -1) {
      return false
    }
    return this.list.splice(index, 1)
  }
  // 清除所有数据
  clear() {
    return this.list.splice(0)
  }
  // 删除在这个元素后面添加的元素
  backTo(element) {
    const index = this.list.findIndex((item) => {
      return item === element
    })
    if (index === -1) {
      return false
    }
    return this.list.splice(0, index)
  }
  // 后退index步
  backToByIndex(index) {
    if (index > this.length - 1) {
      return false
    }
    return this.list.splice(0, index)
  }
  getHeader() {
    return this.list[0]
  }
  getSecond() {
    return this.list[1]
  }
  getFooter() {
    return this.list[this.list.length - 1]
  }
  getSize() {
    return this.list.length
  }
  getList() {
    return this.list
  }
}

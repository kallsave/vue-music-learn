export class Stack {
  constructor(max = Infinity) {
    this.max = max
    this.init()
  }
  init() {
    this.list = []
  }
  _add(item) {
    this.list.unshift(item)
    if (this.list.length > this.max) {
      this.list.pop()
    }
  }
  add() {
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      this._add(item)
    }
  }
  reduce() {
    if (!this.list.length) {
      return false
    }
    return this.list.shift()
  }
  replace(item) {
    const result = this.reduce()
    if (!result) {
      return false
    }
    this._add(item)
  }
  _remove(item) {
    const index = this.list.indexOf(item)
    if (index === -1) {
      return false
    }
    return this.list.splice(index, 1)
  }
  remove() {
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      this._remove(item)
    }
  }
  removeByIndex(index) {
    if (this.list[index]) {
      return this.list.splice(index, 1)
    }
  }
  removeAll() {
    return this.list.splice(0)
  }
  removeUntil(item) {
    const index = this.list.indexOf(item)
    if (index !== -1) {
      return this.list.splice(0, index)
    }
    return false
  }
  removeExclude() {
    const removeStack = []
    for (let i = 0; i < this.list.length; i++) {
      const item = this.list[i]
      if (Array.prototype.indexOf.call(arguments, item) === -1) {
        const remove = this.list.splice(i, 1)
        Array.prototype.push.apply(removeStack, remove)
        i--
      }
    }
    return removeStack
  }
  removeBack(index) {
    if (index > this.list.length - 1) {
      return this.list.splice(0)
    }
    return this.list.splice(0, index)
  }
  getHeader() {
    return this.list[0]
  }
  getByIndex(index) {
    return this.list[index]
  }
  getFooter() {
    return this.list[this.list.length - 1]
  }
  getSize() {
    return this.list.length
  }
  getStore() {
    return this.list
  }
  getMax() {
    return this.max
  }
  has(item) {
    return this.list.indexOf(item) !== -1
  }
  updateSize(max) {
    this.max = max
  }
  checkFull() {
    return this.max === this.list.length
  }
}

export class MapStack extends Stack {
  _add(item) {
    const index = this.list.indexOf(item)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
    this.list.unshift(item)
    if (this.list.length > this.max) {
      this.list.pop()
    }
  }
  add() {
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      this._add(item)
    }
  }
}

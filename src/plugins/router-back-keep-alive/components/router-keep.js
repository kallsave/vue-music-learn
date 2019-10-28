import Stack from '../util/stack'
import historyStack from '../history/history-stack'
import historyStateEvent from '../history/history-state-event'

function isDef(v) {
  return v !== undefined && v !== null
}

function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory
}

function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

const COMPONENT_NAME = 'router-keep'

export default {
  name: COMPONENT_NAME,
  abstract: true,
  props: {
    max: {
      type: Number,
      default: 10,
      validator(num) {
        return (num | 0) === num
      }
    }
  },
  created() {
    this.cache = Object.create(null)
    this.stack = new Stack(this.max)
  },
  render(h) {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    if (vnode) {
      const key = window.location.href
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance
        this.stack.add(key)
      } else {
        if (this.max > this.stack.getSize()) {
          this.cache[key] = vnode
          this.stack.add(key)
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  },
  mounted() {
    this.historyStateBackHandler()
  },
  methods: {
    historyStateBackHandler() {
      historyStateEvent.on('back', () => {
        historyStack.reduce()
        this.remove(this.stack.getByIndex(0))
      })
    },
    add(key) {

    },
    remove(key) {
      const cached = this.cache[key]
      if (cached) {
        cached.componentInstance.$destroy()
        this.cache[key] = null
        this.stack.remove(key)
      }
    }
  },
}

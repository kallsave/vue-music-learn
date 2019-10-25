
const COMPONENT_NAME = 'router-back-keep-alive'

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

function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

export default {
  name: COMPONENT_NAME,
  abstract: true,
  created() {
    this.cache = Object.create(null)
    this.keys = []
  },
  render(h) {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      const name = getComponentName(componentOptions)
      const { cache, keys } = this
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
      } else {
        cache[key] = vnode
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  },
  mounted() {
    this.addEventListenerHashchange()
    this.$watch('$route', (newVal) => {
      console.log(888)
    })
  },
  methods: {
    addEventListenerHashchange() {
      window.addEventListener('hashchange', (e) => {
        // 第一次触发hashchange肯定是浏览器的点击后退
        console.log('hashchange')
      })
    }
  },
}

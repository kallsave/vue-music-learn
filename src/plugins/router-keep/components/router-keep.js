import { MapStack } from '../util/stack'
import historyStateEvent from '../history/history-state-event'
import { EVENT_HISTORY_ACTION_BACK } from '../history/history-action-name'
import { globalCache, globalStack, multiKeyMap } from '../store/index'
import routerKeepHelper from '../api/router-keep-helper'
import config from '../config/index'

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
  created() {
    this.cache = Object.create(null)
    globalCache.push({
      cache: this.cache,
    })
  },
  render(h) {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    if (vnode) {
      let key
      if (config.mode === 'single') {
        key = routerKeepHelper.resolveKeyFromRoute(this.$route)
      } else {
        const baseKey = routerKeepHelper.resolveKeyFromRoute(this.$route)
        if (!multiKeyMap[baseKey]) {
          multiKeyMap[baseKey] = new MapStack()
        }
        // 在多例模式下,会创建新key
        if (this.$route.params[config.actionKey] === 'forward') {
          key = baseKey + String(multiKeyMap[baseKey].getSize())
          multiKeyMap[baseKey].add(key)
        } else {
          key = multiKeyMap[baseKey].getByIndex(0)
        }
      }
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance
      } else {
        if (!globalStack.checkFull()) {
          this.cache[key] = vnode
        } else {
          const lastKey = globalStack.getFooter()
          routerKeepHelper._remove(lastKey)
          this.cache[key] = vnode
        }
      }
      globalStack.add(key)
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  },
  mounted() {
    this.historyStateBackHandler()
  },
  methods: {
    historyStateBackHandler() {
      historyStateEvent.on(EVENT_HISTORY_ACTION_BACK, () => {
        routerKeepHelper.remove(this.$route)
      })
    },
    remove(key) {
      this.removeCacheItem(key)
      this.removeStackItem(key)
    },
    removeCacheItem(key) {
      if (this.cache[key]) {
        this.cache[key].componentInstance.$destroy()
        this.cache[key] = null
      }
    },
    removeStackItem(key) {
      globalStack.remove(key)
    }
  },
  beforeDestroy() {
    for (const key in this.cache) {
      this.remove(key)
    }
    let index
    for (let i = 0; i < globalCache.length; i++) {
      if (this.cache === globalCache[i]) {
        index = i
        break
      }
    }
    globalCache.splice(index, 1)
  },
}

import { globalCache, globalStack } from '../store/index'
import config from '../config/index'

const routerKeepHelper = {
  resolveKeyFromRoute(route) {
    return route.name ? route.name : route.path
  },
  resolveKeyFromLocation(location) {
    const router = config.router
    const route = router.resolve(location).route
    return this.resolveKeyFromRoute(route)
  },
  _remove(key) {
    for (let i = 0; i < globalCache.length; i++) {
      const globalCacheItem = globalCache[i]
      const cache = globalCacheItem.cache
      if (cache[key]) {
        cache[key].componentInstance.$destroy()
        cache[key] = null
        globalStack.remove(key)
      }
    }
  },
  remove() {
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      const key = this.resolveKeyFromLocation(item)
      this._remove(key)
    }
  },
  removeAll() {
    for (let i = 0; i < globalCache.length; i++) {
      const globalCacheItem = globalCache[i]
      const cache = globalCacheItem.cache
      for (const key in cache) {
        cache[key].componentInstance.$destroy()
        cache[key] = null
      }
    }
    globalStack.removeAll()
  },
  _removeUntil(key) {
    const removeStack = globalStack.removeUntil(key)
    if (removeStack) {
      for (let i = 0; i < globalCache.length; i++) {
        const globalCacheItem = globalCache[i]
        const cache = globalCacheItem.cache
        for (let j = 0; j < removeStack.length; j++) {
          const keyItem = removeStack[j]
          if (cache[keyItem]) {
            cache[keyItem].componentInstance.$destroy()
            cache[keyItem] = null
          }
        }
      }
    } else {
      this.removeAll()
    }
  },
  removeUntil(location) {
    const key = this.resolveKeyFromLocation(location)
    this._removeUntil(key)
  },
  _removeExclude(key) {
    const removeStack = globalStack.removeExclude(key)
    if (removeStack) {
      for (let i = 0; i < globalCache.length; i++) {
        const globalCacheItem = globalCache[i]
        const cache = globalCacheItem.cache
        for (let j = 0; j < removeStack.length; j++) {
          const keyItem = removeStack[j]
          if (cache[keyItem]) {
            cache[keyItem].componentInstance.$destroy()
            cache[keyItem] = null
          }
        }
      }
    }
  },
  removeExclude() {
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      const key = this.resolveKeyFromLocation(item)
      this._removeExclude(key)
    }
  },
  // need open browser storage
  removeBack(index) {
    const removeStack = globalStack.removeBack(index)
    if (removeStack) {
      for (let i = 0; i < globalCache.length; i++) {
        const globalCacheItem = globalCache[i]
        const cache = globalCacheItem.cache
        for (let j = 0; j < removeStack.length; j++) {
          const keyItem = removeStack[j]
          if (cache[keyItem]) {
            cache[keyItem].componentInstance.$destroy()
            cache[keyItem] = null
          }
        }
      }
    }
  },
  getStore() {
    return {
      cache: globalCache,
      stack: globalStack.getStore()
    }
  },
}

export default routerKeepHelper

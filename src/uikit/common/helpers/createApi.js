// cube-ui提取的
const camelizeRE = /-(\w)/g

function camelize(str) {
  str = String(str)
  return str.replace(camelizeRE, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

function processComponentName(Component, { prefix = '', firstUpperCase = false } = {}) {
  const name = Component.name
  const pureName = name.replace(/^cube-/i, '')
  let camelizeName = `${camelize(`${prefix}${pureName}`)}`
  if (firstUpperCase) {
    camelizeName = camelizeName.charAt(0).toUpperCase() + camelizeName.slice(1)
  }
  return camelizeName
}

export function parseRenderData(data = {}, events = {}) {
  events = parseEvents(events)
  const props = { ...data }
  const on = {}
  for (const name in events) {
    if (events.hasOwnProperty(name)) {
      const handlerName = events[name]
      if (props[handlerName]) {
        on[name] = props[handlerName]
        delete props[handlerName]
      }
    }
  }
  return {
    props,
    on
  }
}

function parseEvents(events) {
  const parsedEvents = {}
  events.forEach((name) => {
    parsedEvents[name] = camelize(`on-${name}`)
  })
  return parsedEvents
}

function instantiateComponent(Vue, Component, data, renderFn, options) {
  let renderData
  let childrenRenderFn

  if (options === undefined) {
    options = {}
  }

  const instance = new Vue({
    ...options,
    render(createElement) {
      let children = childrenRenderFn && childrenRenderFn(createElement)
      if (children && !Array.isArray(children)) {
        children = [children]
      }
      return createElement(Component, { ...renderData }, children || [])
    },
    methods: {
      init() {
        document.body.appendChild(this.$el)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
      }
    }
  })
  instance.updateRenderData = function (data, render) {
    renderData = data
    childrenRenderFn = render
  }
  instance.updateRenderData(data, renderFn)
  instance.$mount()
  instance.init()
  const component = instance.$children[0]
  component.$updateProps = function (props) {
    Object.assign(renderData.props, props)
    instance.updateRenderData(renderData.props, renderFn)
    instance.$forceUpdate()
  }
  return component
}

function createAPIComponent(Vue, Component, events = [], single = false) {
  let singleComponent
  let singleInstance
  const beforeFns = []
  const api = {
    before(fn) {
      beforeFns.push(fn)
    },
    open(data, renderFn, options) {
      if (typeof renderFn !== 'function' && options === undefined) {
        options = renderFn
        renderFn = null
      }
      let instanceSingle = options
      if (typeof options === 'object') {
        instanceSingle = options.single
        delete options.single
      }

      beforeFns.forEach((before) => {
        before(data, renderFn, instanceSingle)
      })
      if (instanceSingle === undefined) {
        instanceSingle = single
      }
      if (instanceSingle && singleComponent) {
        singleInstance.updateRenderData(data, renderFn)
        // visibility mixin watch visible should not hide
        singleComponent._createAPI_reuse = true
        singleInstance.$forceUpdate()
        const oldVisible = singleComponent.visible
        singleComponent.$nextTick(() => {
          singleComponent._createAPI_reuse = false
          // prop visible true -> to
          if (oldVisible && singleComponent.visible) {
            singleComponent.show()
          }
        })
        // singleComponent.show && singleComponent.show()
        return singleComponent
      }
      const component = instantiateComponent(Vue, Component, data, renderFn, options)
      const instance = component.$parent
      const originRemove = component.remove

      component.remove = function () {
        if (instance.__cube__destroyed) {
          return
        }
        originRemove && originRemove.call(this)
        instance.destroy()
        instance.__cube__destroyed = true
        if (instanceSingle) {
          singleComponent = null
          singleInstance = null
        }
      }
      const originShow = component.show
      component.show = function () {
        originShow && originShow.call(this)
        return this
      }
      const originHide = component.hide
      component.hide = function () {
        originHide && originHide.call(this)
        return this
      }
      if (instanceSingle) {
        singleComponent = component
        singleInstance = instance
      }
      // component.show && component.show()
      return component
    },
    create(config, renderFn, single) {
      const ownerInstance = this
      const isInVueInstance = !!ownerInstance.$on
      const renderData = parseRenderData(config, events)
      cancelWatchProps()
      processProps()
      processEvents()
      process$()

      if (typeof renderFn !== 'function' && single === undefined) {
        single = renderFn
        renderFn = null
      }
      // to get Vue options
      // store router i18n ...
      const options = {
        single: single
      }
      if (isInVueInstance) {
        options.parent = ownerInstance
      }

      const component = api.open(renderData, renderFn, options)
      if (component.__cube__parent !== ownerInstance) {
        component.__cube__parent = ownerInstance
        const beforeDestroy = function () {
          cancelWatchProps()
          if (component.__cube__parent === ownerInstance) {
            component.remove()
          }
          ownerInstance.$off('hook:beforeDestroy', beforeDestroy)
          component.__cube__parent = null
        }
        isInVueInstance && ownerInstance.$on('hook:beforeDestroy', beforeDestroy)
      }
      return component

      function processProps() {
        const $props = renderData.props.$props
        if ($props) {
          delete renderData.props.$props

          const watchKeys = []
          const watchPropKeys = []
          Object.keys($props).forEach((key) => {
            const propKey = $props[key]
            if (typeof propKey === 'string' && propKey in ownerInstance) {
              // get instance value
              renderData.props[key] = ownerInstance[propKey]
              watchKeys.push(key)
              watchPropKeys.push(propKey)
            } else {
              renderData.props[key] = propKey
            }
          })
          if (isInVueInstance) {
            ownerInstance.__createAPI_watcher = ownerInstance.$watch(function () {
              const props = {}
              watchKeys.forEach((key, i) => {
                props[key] = ownerInstance[watchPropKeys[i]]
              })
              return props
            }, function (newProps) {
              component && component.$updateProps(newProps)
            })
          }
        }
      }

      function processEvents() {
        const $events = renderData.props.$events
        if ($events) {
          delete renderData.props.$events

          Object.keys($events).forEach((event) => {
            let eventHandler = $events[event]
            if (typeof eventHandler === 'string') {
              eventHandler = ownerInstance[eventHandler]
            }
            renderData.on[event] = eventHandler
          })
        }
      }

      function process$() {
        const props = renderData.props
        Object.keys(props).forEach((prop) => {
          if (prop.charAt(0) === '$') {
            renderData[prop.slice(1)] = props[prop]
            delete props[prop]
          }
        })
      }

      function cancelWatchProps() {
        if (ownerInstance.__createAPI_watcher) {
          ownerInstance.__createAPI_watcher()
          ownerInstance.__createAPI_watcher = null
        }
      }
    }
  }
  return api
}

export default function createAPI(Vue, Component, events, single) {
  const api = createAPIComponent.apply(this, arguments)
  const createName = processComponentName(Component, {
    prefix: '$create-'
  })
  Vue.prototype[createName] = api.create
  Component.$create = api.create
  return api
}

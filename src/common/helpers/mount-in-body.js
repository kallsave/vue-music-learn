function camelize(str) {
  str = String(str)
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

function middleline(str) {
  str = String(str)
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const mixins = {
  methods: {
    appendToBody() {
      document.body.appendChild(this.$el)
    },
    // 多例模式可以使用这个方法更新数据
    update(options) {
      for (var key in options) {
        if (typeof options[key] !== 'function') {
          this.$data.options[key] = options[key]
        } else {
          let name = middleline(options[key].name)
          this.$off(name)
          this.$on(name, options[key])
        }
      }
    }
  }
}

// 挂载在body上
export default function mountInBody (Vue, Component, isSingle = true) {
  const name = Component.name
  const prefixName = 'body'
  let camelizeName = camelize(`$${prefixName}-${name}`)
  let instance = null
  Vue.prototype[camelizeName] = function (options) {
    // 第一次挂载并且是单例模式
    if (instance === null && isSingle) {
      Component.mixins.push(mixins)
      // 返回一个没有挂载的扩展实例构造器<toast></toast>
      let Constructor = Vue.extend(Component)
      instance = new Constructor()

      // 挂载后会返回形成真正的VueComponent,生命周期开始
      // 真正的vue实例生成
      instance.$mount()
      instance.appendToBody()
      // 多例模式只出现一次,记得手动注销
      instance.destroy = function () {
        this.$destroy()
        document.body.removeChild(this.$el)
        // 销毁闭包有两种,一种是它的所有引用都被销毁,这显然不太可能实现
        // 一种是从源头上销毁
        instance = null
      }
    } else if (!isSingle) {
      // 多例模式不用做任何处理
      Component.mixins.push(mixins)
      // 返回一个没有挂载的扩展实例构造器<toast></toast>
      let Constructor = Vue.extend(Component)
      instance = new Constructor()

      // 挂载后会返回形成真正的VueComponent,生命周期开始
      // 并且拥有vue实例的所有方法
      instance.$mount()
      instance.appendToBody()
      // 多例模式只出现一次,记得手动注销
      instance.destroyToBody = function () {
        this.$destroy()
        document.body.removeChild(this.$el)
        // 销毁闭包有两种,一种是它的所有引用都被销毁,这显然不太可能实现
        // 最简单的方法是从源头上销毁
        instance = null
      }
    }

    instance.update(options)

    return instance
  }
}

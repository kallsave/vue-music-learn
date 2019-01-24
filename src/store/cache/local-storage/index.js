// store是集合了各种storages的操作,默认是不带expire的localStorage
// localStorage比cookie好,如果数据超过4k,cookie将丢失数据导致vuex没有保存
// 可以定制化自己的配置
// https://github.com/marcuswestin/store.js#make-your-own-build
const engine = require('store/src/store-engine')
const storages = [
  require('store/storages/localStorage')
]

const storePlugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]

const local = engine.createStore(storages, storePlugins)

export default local

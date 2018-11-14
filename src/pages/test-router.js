// 测试组件路由
const Test = () => import(/* webpackChunkName: "Test" */ './test/index.vue')
const WechatSticky = () => import(/* webpackChunkName: "WechatSticky" */ './test/children/wechat-sticky/wechat-sticky.vue')
const ScrollTest = () => import(/* webpackChunkName: "ScrollTest" */ './test/children/scroll-test/scroll-test.vue')
const Functional = () => import(/* webpackChunkName: "Funcitonal" */ './test/children/functional/functional.vue')
const Inject = () => import(/* webpackChunkName: "Funcitonal" */ './test/children/inject/inject.vue')

export default {
  path: '/test',
  component: Test,
  children: [
    {
      path: '/test/wechat-sticky',
      component: WechatSticky
    },
    {
      path: '/test/scroll-test',
      component: ScrollTest
    },
    {
      path: '/test/functional',
      component: Functional
    },
    {
      path: '/test/inject',
      component: Inject
    }
  ]
}

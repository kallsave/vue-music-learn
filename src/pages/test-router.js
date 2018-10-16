// 测试组件路由
const Test = () => import(/* webpackChunkName: "Test" */ './test/index.vue')
const WechatSticky = () => import(/* webpackChunkName: "WechatSticky" */ './test/children/wechat-sticky/wechat-sticky.vue')
const ScrollTest = () => import(/* webpackChunkName: "ScrollTest" */ './test/children/scroll-test/scroll-test.vue')

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
  ]
}

// 测试组件路由
const Test = () => import('./test/index.vue')
const WechatSticky = () => import('./test/children/wechat-sticky/wechat-sticky.vue')
const ScrollTest = () => import('./test/children/scroll-test/scroll-test.vue')
const Functional = () => import('./test/children/functional/functional.vue')
const Inject = () => import('./test/children/inject/inject.vue')
const NativeSticky = () => import('./test/children/native-sticky/native-sticky.vue')
const Sticky = () => import('./test/children/sticky/sticky.vue')
const Collapse = () => import('./test/children/collapse/collapse.vue')
const ActionSheet = () => import('./test/children/action-sheet/action-sheet.vue')
const Picker = () => import('./test/children/picker/picker.vue')
const Quicklink = () => import('./test/children/quicklink/quicklink.vue')
const Popup = () => import('./test/children/popup/popup.vue')
const Swipe = () => import('./test/children/swipe/swipe.vue')
const Touch = () => import('./test/children/touch/touch.vue')
const ScrollPullDownToutiao = () => import('./test/children/scroll-pull-down/scroll-pull-down-toutiao.vue')
const ScrollPullUp = () => import('./test/children/scroll-pull-up/scroll-pull-up.vue')
const Input = () => import('./test/children/input/input.vue')

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
    },
    {
      path: '/test/native-sticky',
      component: NativeSticky
    },
    {
      path: '/test/sticky',
      component: Sticky
    },
    {
      path: '/test/collapse',
      component: Collapse
    },
    {
      path: '/test/action-sheet',
      component: ActionSheet
    },
    {
      path: '/test/picker',
      component: Picker
    },
    {
      path: '/test/quicklink',
      component: Quicklink
    },
    {
      path: '/test/popup',
      component: Popup
    },
    {
      path: '/test/swipe',
      component: Swipe
    },
    {
      path: '/test/touch',
      component: Touch
    },
    {
      path: '/test/scroll-pull-down-toutiao',
      component: ScrollPullDownToutiao
    },
    {
      path: '/test/scroll-pull-up',
      component: ScrollPullUp
    },
    {
      path: '/test/input',
      component: Input
    }
  ]
}

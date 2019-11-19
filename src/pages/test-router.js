// 测试组件路由
const Test = () => import('./test/index.vue')
const TestWechatSticky = () => import('./test/children/wechat-sticky/wechat-sticky.vue')
const TestScrollTest = () => import('./test/children/scroll-test/scroll-test.vue')
const TestFunctional = () => import('./test/children/functional/functional.vue')
const TestInject = () => import('./test/children/inject/inject.vue')
const TestNativeSticky = () => import('./test/children/native-sticky/native-sticky.vue')
const TestSticky = () => import('./test/children/sticky/sticky.vue')
const TestCollapse = () => import('./test/children/collapse/collapse.vue')
const TestActionSheet = () => import('./test/children/action-sheet/action-sheet.vue')
const TestPicker = () => import('./test/children/picker/picker.vue')
const TestPopup = () => import('./test/children/popup/popup.vue')
const TestSwipe = () => import('./test/children/swipe/swipe.vue')
const TestTouch = () => import('./test/children/touch/touch.vue')
const TestScrollPullDownToutiao = () => import('./test/children/scroll-pull-down/scroll-pull-down-toutiao.vue')
const TestScrollPullDownBubble = () => import('./test/children/scroll-pull-down/scroll-pull-down-bubble.vue')
const TestScrollPullUp = () => import('./test/children/scroll-pull-up/scroll-pull-up.vue')
const TestInput = () => import('./test/children/input/input.vue')
const TestBoundaryScroll = () => import('./test/children/boundary-scroll/boundary-scroll.vue')
const TestNativeScroll = () => import('./test/children/native-scroll/native-scroll.vue')
const TestScrollHorizontal = () => import('./test/children/scroll-horizontal/scroll-horizontal.vue')
const TestExends = () => import('./test/children/extends/extends.vue')
const TestWechatPopup = () => import('./test/children/wechat-popup/wechat-popup.vue')
const TestAutoSize = () => import('./test/children/autosize/autosize.vue')
const TestComponent = () => import('./test/children/component/component.vue')
const TestUpload = () => import('./test/children/upload/upload.vue')
const TestArr = () => import('./test/children/arr/arr.vue')
const TestJump = () => import('./test/children/jump/jump.vue')
const TestListAnimation = () => import('./test/children/list-animation/list-animation.vue')
const TestTree = () => import('./test/children/tree/tree.vue')
const TestAbstract = () => import('./test/children/abstract/abstract.vue')
const TestKeepAliveList = () => import('./test/children/keep-alive-list/keep-alive-list.vue')
const TestSlow = () => import('./test/children/slow/slow.vue')
const TestScrollTextarea = () => import('./test/children/scroll-textarea/scroll-textarea.vue')
const TestSafari100vh = () => import('./test/children/safari-100vh/safari-100vh.vue')
const TestScrollPopup = () => import('./test/children/scroll-popup/scroll-popup.vue')
const TestPromisePartner = () => import('./test/children/promise-partner/promise-partner.vue')
const TestSlide = () => import('./test/children/slide/slide.vue')
const TestSortable = () => import('./test/children/sortable/sortable.vue')

export default {
  path: '/test',
  component: Test,
  children: [
    {
      path: '/test/wechat-sticky',
      name: 'TestWechatSticky',
      component: TestWechatSticky
    },
    {
      path: '/test/scroll-test',
      name: 'TestScrollTest',
      component: TestScrollTest
    },
    {
      path: '/test/functional',
      name: 'TestFunctional',
      component: TestFunctional
    },
    {
      path: '/test/inject',
      name: 'TestInject',
      component: TestInject
    },
    {
      path: '/test/native-sticky',
      name: 'TestNativeSticky',
      component: TestNativeSticky
    },
    {
      path: '/test/sticky',
      name: 'TestSticky',
      component: TestSticky
    },
    {
      path: '/test/collapse',
      name: 'TestCollapse',
      component: TestCollapse
    },
    {
      path: '/test/action-sheet',
      name: 'TestActionSheet',
      component: TestActionSheet
    },
    {
      path: '/test/picker',
      name: 'TestPicker',
      component: TestPicker
    },
    {
      path: '/test/popup',
      name: 'TestPopup',
      component: TestPopup
    },
    {
      path: '/test/swipe',
      name: 'TestSwipe',
      component: TestSwipe
    },
    {
      path: '/test/touch',
      name: 'TestTouch',
      component: TestTouch
    },
    {
      path: '/test/scroll-pull-down-toutiao',
      name: 'TestScrollPullDownToutiao',
      component: TestScrollPullDownToutiao
    },
    {
      path: '/test/scroll-pull-down-bubble',
      name: 'TestScrollPullDownBubble',
      component: TestScrollPullDownBubble
    },
    {
      path: '/test/scroll-pull-up',
      name: 'TestScrollPullUp',
      component: TestScrollPullUp
    },
    {
      path: '/test/input',
      name: 'TestInput',
      component: TestInput
    },
    {
      path: '/test/boundary-scroll',
      name: 'TestBoundaryScroll',
      component: TestBoundaryScroll
    },
    {
      path: '/test/native-scroll',
      name: 'TestNativeScroll',
      component: TestNativeScroll
    },
    {
      path: '/test/scroll-horizontal',
      name: 'TestScrollHorizontal',
      component: TestScrollHorizontal
    },
    {
      path: '/test/extends',
      name: 'TestExends',
      component: TestExends
    },
    {
      path: '/test/wechat-popup',
      name: 'TestWechatPopup',
      component: TestWechatPopup,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/autosize',
      name: 'TestAutoSize',
      component: TestAutoSize,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/component',
      name: 'TestComponent',
      component: TestComponent,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/upload',
      name: 'TestUpload',
      component: TestUpload,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/arr',
      name: 'TestArr',
      component: TestArr
    },
    {
      path: '/test/jump',
      name: 'TestJump',
      component: TestJump
    },
    {
      path: '/test/list-animation',
      name: 'TestListAnimation',
      component: TestListAnimation,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/tree',
      name: 'TestTree',
      component: TestTree,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/abstract',
      name: 'TestAbstract',
      component: TestAbstract,
      meta: {
        isUseRouterTransition: true,
      }
    },
    {
      path: '/test/keep-alive-list',
      name: 'TestKeepAliveList',
      component: TestKeepAliveList,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/slow',
      name: 'TestSlow',
      component: TestSlow,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/scroll-textarea',
      name: 'TestScrollTextarea',
      component: TestScrollTextarea,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/safari-100vh',
      name: 'TestSafari100vh',
      component: TestSafari100vh,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/scroll-popup/:id',
      name: 'TestScrollPopup',
      component: TestScrollPopup,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/promise-partner',
      name: 'TestPromisePartner',
      component: TestPromisePartner,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/slide',
      name: 'TestSlide',
      component: TestSlide,
      meta: {
        isUseRouterTransition: true
      }
    },
    {
      path: '/test/sortable',
      name: 'TestSortable',
      component: TestSortable,
      meta: {
        isUseRouterTransition: true
      }
    }
  ]
}

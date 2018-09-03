import Vue from 'vue'
import Router from 'vue-router'

// 测试组件路由
const Test = () => import(/* webpackChunkName: "Test" */ '@/pages/test/index.vue')
const WechatSticky = () => import(/* webpackChunkName: "WechatSticky" */ '@/pages/test/children/wechat-sticky/wechat-sticky.vue')
const ScrollTest = () => import(/* webpackChunkName: "ScrollTest" */ '@/pages/test/children/scroll-test/scroll-test.vue')

// index路由
const Index = () => import(/* webpackChunkName: "Index" */ '@/pages/index/index.vue')
const Recommend = () => import(/* webpackChunkName: "Recommend" */ '@/pages/index/children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ '@/pages/index/children/singer/singer.vue')
const Search = () => import(/* webpackChunkName: "Search" */ '@/pages/index/children/search/search.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ '@/pages/index/children/rank/rank.vue')

// music路由
const MusicList = () => import(/* webpackChunkName: "MusicList" */ '@/pages/music/index.vue')
const SingerDetail = () => import(/* webpackChunkName: "SingerDetail" */ '@/pages/music/children/singer-detail/singer-detail.vue')
const RecommendDetail = () => import(/* webpackChunkName: "RecommendDetail" */ '@/pages/music/children/recommend-detail/recommend-detail.vue')
const RankDetail = () => import(/* webpackChunkName: "RankDetail" */ '@/pages/music/children/rank-detail/rank-detail.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
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
    },
    {
      path: '/',
      component: Index,
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          component: Recommend,
        },
        {
          path: '/singer',
          component: Singer,
        },
        {
          path: '/search',
          component: Search,
        },
        {
          path: '/rank',
          component: Rank,
        },
      ]
    },
    {
      path: '/music',
      component: MusicList,
      children: [
        {
          path: '/music/recommend-detail/:id',
          component: RecommendDetail,
        },
        {
          path: '/music/singer-detail/:id',
          component: SingerDetail,
        },
        {
          path: '/music/rank-detail/:id',
          component: RankDetail,
        }
      ]
    },
  ]
})

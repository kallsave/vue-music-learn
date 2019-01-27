import Vue from 'vue'
import Router from 'vue-router'
import TestRouter from './test-router.js'

// index路由
const Index = () => import(/* webpackChunkName: "Index" */ './index/index.vue')
const Recommend = () => import(/* webpackChunkName: "Recommend" */ './index/children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './index/children/singer/singer.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './index/children/search/search.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './index/children/rank/rank.vue')

// music路由
const MusicList = () => import(/* webpackChunkName: "MusicList" */ './music/index.vue')
const SingerDetail = () => import(/* webpackChunkName: "SingerDetail" */ './music/children/singer-detail/singer-detail.vue')
const RecommendDetail = () => import(/* webpackChunkName: "RecommendDetail" */ './music/children/recommend-detail/recommend-detail.vue')
const RankDetail = () => import(/* webpackChunkName: "RankDetail" */ './music/children/rank-detail/rank-detail.vue')

// 404路由
const NotFoundComponent = () => import(/* webpackChunkName: "404" */ './404/index.vue')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    TestRouter,
    {
      path: '/',
      component: Index,
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          component: Recommend,
          meta: {
            index: 1,
          },
        },
        {
          path: '/singer',
          component: Singer,
          meta: {
            index: 1,
          },
        },
        {
          path: '/rank',
          component: Rank,
          meta: {
            index: 1,
          },
        },
        {
          path: '/search',
          component: Search,
          meta: {
            index: 1,
          },
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
    // 新的路由动效
    {
      path: '/new-music/recommend-detail/:id',
      component: RecommendDetail,
      meta: {
        index: 2
      }
    },
    {
      path: '/new-music/singer-detail/:id',
      component: SingerDetail,
      meta: {
        index: 2
      }
    },
    {
      path: '/new-music/rank-detail/:id',
      component: RankDetail,
      meta: {
        index: 2
      }
    },
    { path: '*',
      component: NotFoundComponent,
      meta: {
        index: 100
      }
    }
  ]
})

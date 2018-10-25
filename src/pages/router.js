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
          // meta: {
          //   keepAlive: false
          // }
        },
        {
          path: '/singer',
          component: Singer,
          // meta: {
          //   keepAlive: true,
          // }
        },
        {
          path: '/search',
          component: Search,
          // meta: {
          //   keepAlive: true,
          // }
        },
        {
          path: '/rank',
          component: Rank,
          // meta: {
          //   keepAlive: true,
          // }
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

import Vue from 'vue'
import Router from 'vue-router'
import TestRouter from './test-router.js'

// index路由
const Index = () => import(/* webpackChunkName: "Index" */ './index/index.vue')
const Recommend = () => import('./index/children/recommend/recommend.vue')
const Singer = () => import('./index/children/singer/singer.vue')
const Search = () => import('./index/children/search/search.vue')
const Rank = () => import('./index/children/rank/rank.vue')

// music路由
const MusicList = () => import('./music/index.vue')
const SingerDetail = () => import('./music/children/singer-detail/singer-detail.vue')
const RecommendDetail = () => import('./music/children/recommend-detail/recommend-detail.vue')
const RankDetail = () => import('./music/children/rank-detail/rank-detail.vue')

// search路由
const NewSearch = () => import('./search/index.vue')

// 404路由
const NotFoundComponent = () => import('./404/index.vue')

Vue.use(Router)

const router = new Router({
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
            isUseRouterTransition: true,
            title: '推荐',
          },
        },
        {
          path: '/singer',
          component: Singer,
          meta: {
            isUseRouterTransition: true,
            title: '歌手'
          },
        },
        {
          path: '/rank',
          component: Rank,
          meta: {
            isUseRouterTransition: true,
            title: '排行'
          },
        },
        {
          path: '/search',
          component: Search,
          meta: {
            isUseRouterTransition: true,
            title: '搜索'
          },
        },
      ]
    },
    {
      path: '/new-search',
      component: NewSearch,
      meta: {
        isUseRouterTransition: true,
        title: '搜索'
      },
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
        isUseRouterTransition: true,
        title: '推荐歌单详情'
      }
    },
    {
      path: '/new-music/singer-detail/:id',
      component: SingerDetail,
      meta: {
        isUseRouterTransition: true,
        title: '歌手歌单详情'
      }
    },
    {
      path: '/new-music/rank-detail/:id',
      component: RankDetail,
      meta: {
        isUseRouterTransition: true,
        title: '排行歌单详情'
      }
    },
    { path: '*',
      component: NotFoundComponent,
      meta: {
        isUseRouterTransition: true,
        title: '页面丢失了'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router

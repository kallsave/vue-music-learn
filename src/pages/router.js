import Vue from 'vue'
import Router from 'vue-router'
import TestRouter from './test-router.js'

// index路由
// const Index = () => import(/* webpackChunkName: "Index" */ './index/index.vue')
import Index from './index/index.vue'

const Recommend = () => import(/* webpackChunkName: "Recommend" */ './index/children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './index/children/singer/singer.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './index/children/search/search.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './index/children/rank/rank.vue')

// detail路由
// const MusicList = () => import(/* webpackChunkName: "MusicList" */ './detail/index.vue')
const DetailSinger = () => import(/* webpackChunkName: "SingerDetail" */ './detail/children/detail-singer/detail-singer.vue')
const DetailRecommend = () => import(/* webpackChunkName: "RecommendDetail" */ './detail/children/detail-recommend/detail-recommend.vue')
const DetailRank = () => import(/* webpackChunkName: "RankDetail" */ './detail/children/detail-rank/detail-rank.vue')

// search路由
const NewSearch = () => import(/* webpackChunkName: "NewSearch" */ './search/index.vue')

// 404路由
const NotFoundComponent = () => import(/* webpackChunkName: "404" */ './404/index.vue')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  // 对于没用到100vh的better-scroll的页面
  // 返回原来页面保持原来页面的滚动位置
  // 对于100vh的better-scroll的页面,savePosition位置就是{x: 0, y: 0}
  // better-scroll本身可以保持滚动位置
  scrollBehavior(to, from, savePosition) {
    return new Promise((resolve) => {
      if (savePosition) {
        resolve(savePosition)
      }
    })
  },
  routes: [
    TestRouter,
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      name: 'index',
      // 改成slide-view模式需要去掉
      redirect: '/index/recommend',
      meta: {
        isUseRouterTransition: true,
      },
      children: [
        {
          path: '/index/recommend',
          component: Recommend,
          name: 'index-recommend',
          meta: {
            isUseRouterTransition: true,
            title: '推荐',
          },
        },
        {
          path: '/index/singer',
          component: Singer,
          name: 'index-singer',
          meta: {
            isUseRouterTransition: true,
            title: '歌手'
          },
        },
        {
          path: '/index/rank',
          component: Rank,
          name: 'index-rank',
          meta: {
            isUseRouterTransition: true,
            title: '排行'
          },
        },
        {
          path: '/index/search',
          component: Search,
          name: 'index-search',
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
      name: 'new-search',
      meta: {
        isUseRouterTransition: true,
        title: '搜索'
      },
    },
    // {
    //   path: '/music',
    //   component: MusicList,
    //   name: 'music',
    //   children: [
    //     {
    //       path: '/music/recommend-detail/:id',
    //       component: RecommendDetail,
    //       name: 'recommend-detail',
    //     },
    //     {
    //       path: '/music/singer-detail/:id',
    //       component: SingerDetail,
    //       name: 'singer-detail',
    //     },
    //     {
    //       path: '/music/rank-detail/:id',
    //       component: RankDetail,
    //       name: 'rank-detail',
    //     }
    //   ]
    // },
    // 新的路由动效
    {
      path: '/detail/recommend/:id',
      component: DetailRecommend,
      name: 'detail-recommend',
      meta: {
        isUseRouterTransition: true,
        title: '推荐歌单详情'
      }
    },
    {
      path: '/detail/singer/:id',
      component: DetailSinger,
      name: 'detail-singer',
      meta: {
        isUseRouterTransition: true,
        title: '歌手歌单详情'
      }
    },
    {
      path: '/detail/rank/:id',
      component: DetailRank,
      name: 'detail-rank',
      meta: {
        isUseRouterTransition: true,
        title: '排行歌单详情'
      }
    },
    { path: '*',
      component: NotFoundComponent,
      name: '404',
      meta: {
        isUseRouterTransition: true,
        title: '页面丢失了'
      }
    }
  ]
})

// 延后页面的进入时间,让popstate先执行
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  window.setTimeout(() => {
    next()
  }, 20)
})

export default router

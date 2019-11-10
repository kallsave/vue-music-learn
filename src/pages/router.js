import Vue from 'vue'
import Router from 'vue-router'
import TestRouter from './test-router.js'

// index路由
// const Index = () => import(/* webpackChunkName: "Index" */ './index/index.vue')
import Index from './index/index.vue'

const IndexRecommend = () => import(/* webpackChunkName: "Recommend" */ './index/children/recommend/recommend.vue')
const IndexSinger = () => import(/* webpackChunkName: "Singer" */ './index/children/singer/singer.vue')
const IndexSearch = () => import(/* webpackChunkName: "Search" */ './index/children/search/search.vue')
const IndexRank = () => import(/* webpackChunkName: "Rank" */ './index/children/rank/rank.vue')

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

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new Router({
  mode: 'hash',
  routes: [
    ...TestRouter.children,
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      component: Index,
      name: 'Index',
    },
    {
      path: '/new-search',
      component: NewSearch,
      name: 'NewSearch',
      meta: {
        isUseRouterTransition: true,
        title: '搜索'
      },
    },
    {
      path: '/detail/recommend/:id',
      component: DetailRecommend,
      name: 'DetailRecommend',
      meta: {
        isUseRouterTransition: true,
        title: '推荐歌单详情'
      }
    },
    {
      path: '/detail/singer/:id',
      component: DetailSinger,
      name: 'DetailSinger',
      meta: {
        isUseRouterTransition: true,
        title: '歌手歌单详情'
      }
    },
    {
      path: '/detail/rank/:id',
      component: DetailRank,
      name: 'DetailRank',
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

// 延后页面的进入时间,让hashchange先执行
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
  // window.setTimeout(() => {
  // next()
  // }, 0)
})

export default router

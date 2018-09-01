import Vue from 'vue'
import Router from 'vue-router'

// index路由
import Index from '@/pages/index/index.vue'
import Recommend from '@/pages/index/children/recommend/recommend.vue'
import Singer from '@/pages/index/children/singer/singer.vue'
import Search from '@/pages/index/children/search/search.vue'
import Rank from '@/pages/index/children/rank/rank.vue'

// 测试组件路由
import Test from '@/pages/test/index.vue'
import WechatSticky from '@/pages/test/children/wechat-sticky/wechat-sticky.vue'
import ScrollTest from '@/pages/test/children/scroll-test/scroll-test.vue'

// music-list路由
import MusicList from '@/pages/music-list/index.vue'
import SingerDetail from '@/pages/music-list/children/singer-detail/singer-detail.vue'
import RecommendDetail from '@/pages/music-list/children/recommend-detail/recommend-detail.vue'
import RankDetail from '@/pages/music-list/children/rank-detail/rank-detail.vue'

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
        }
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
          component: Search
        },
        {
          path: '/rank',
          component: Rank
        },
      ]
    },
    {
      path: '/music-list',
      component: MusicList,
      children: [
        {
          path: '/music-list/recommend-detail/:id',
          component: RecommendDetail
        },
        {
          path: '/music-list/singer-detail/:id',
          component: SingerDetail
        },
        {
          path: '/music-list/rank-detail/:id',
          component: RankDetail
        }
      ]
    },
  ]
})

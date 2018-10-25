<template>
  <div class="index">
    <vi-sticky ref="sticky"
      @sticky-change="stickyChange">
      <m-header></m-header>
      <vi-sticky-ele :ele-key="'tab'">
        <!-- <tab></tab> -->
        <slide-tab
          :data="titleList"
          :initIndex="currentIndex"
         @click-index="clickIndex"></slide-tab>
      </vi-sticky-ele>
      <!-- <vi-slide-router
        :router-list="routerList"
        :routerStyle="{color: '#222'}">
        <keep-alive exclude="no-keep-alive">
          <router-view></router-view>
        </keep-alive>
      </vi-slide-router> -->
      <vi-slide ref="slide"
        :loop="false" :initPageIndex="currentIndex"
        @change="changeTab">
        <div v-for="(item, index) in routerList" :key="index">
          <component :is=" hadShowPageList.indexOf(index) !== -1 ? item.component : Background"></component>
        </div>
      </vi-slide>
    </vi-sticky>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'

import SlideTab from './components/slide-tab/slide-tab.vue'
import Background from './components/background/background.vue'

const Recommend = () => import(/* webpackChunkName: "Recommend" */ './children/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ './children/singer/singer.vue')
const Search = () => import(/* webpackChunkName: "Search" */ './children/search/search.vue')
const Rank = () => import(/* webpackChunkName: "Rank" */ './children/rank/rank.vue')

export default {
  components: {
    MHeader,
    Tab,
    SlideTab
  },
  data() {
    return {
      routerList: [
        {
          path: '/recommend',
          component: Recommend,
          title: '推荐'
        },
        {
          path: '/singer',
          component: Singer,
          title: '歌手'
        },
        {
          path: '/rank',
          component: Rank,
          title: '排行'
        },
        {
          path: '/search',
          component: Search,
          title: '搜索'
        }
      ],
      keepAliveInclude: [],
      currentIndex: 1,
      Background: Background,
      hadShowPageList: []
    }
  },
  computed: {
    titleList() {
      return this.routerList.map((item) => {
        return item.title
      })
    }
  },
  created() {
    console.log(this.$router.options.routes[1])
    // this.$router.options.routes[1].children.forEach((item) => {
    //   console.log(item.meta.keepAlive)
    //   if (item.meta.keepAlive) {
    //     console.log(item)
    //     this.keepAliveInclude.push(1)
    //   }
    // })
    // console.log(this.keepAliveInclude)
  },
  mounted() {
    this.hadShowPageList.push(this.currentIndex)
  },
  methods: {
    stickyChange() {
      this.$refs.sticky.scroll.disable()
    },
    clickIndex(index) {
      this.$refs.slide.slideToPage(index)
      this.pushHadShowPageListPageList(index)
      if (index === 2) {
        this.$router.push({path: '/rank'})
      }
    },
    changeTab(index) {
      this.currentIndex = index
      this.pushHadShowPageListPageList(index)
      if (index === 2) {
        this.$router.push({path: '/rank'})
      }
    },
    pushHadShowPageListPageList(index) {
      if (this.hadShowPageList.indexOf(index) === -1) {
        this.hadShowPageList.push(index)
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.index
  height: 100vh
  position: relative
</style>

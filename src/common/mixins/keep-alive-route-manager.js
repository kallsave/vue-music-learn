import { mapGetters, mapActions } from 'vuex'

export default {
  mounted() {
    this.keepAliveRouteAdd(this.$options.name)
  },
  computed: {
    ...mapGetters([
      'keepAliveRouteList'
    ])
  },
  methods: {
    ...mapActions([
      // 添加已存在缓存路由时添加无效,原缓存路由位置置顶
      'keepAliveRouteAdd',
      // 快捷删除上一个缓存路由,相当于backToByIndex(1)
      'keepAliveRouteReduce',
      // 删除从这个缓存路由连同比这个缓存路由先缓存的路由
      'keepAliveRouteRemoveFrom',
      // 删除指定的缓存路由
      'keepAliveRouteRemove',
      // 清除所有缓存路由
      'keepAliveRouteClearAll',
      // 清除出了参数以外的其他缓存路由
      'keepAliveRouteClearExclude',
      // 缓存路由清除到这个缓存路由为止
      'keepAliveRouteBackTo',
      // 缓存路由清除index步
      'keepAliveRouteBackToByIndex'
    ]),
  },
}

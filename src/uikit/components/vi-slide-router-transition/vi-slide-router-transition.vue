<template>
  <div class="slide-router">
    <transition :name="slideDirection" :mode="mode">
      <slot></slot>
    </transition>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-slide-router-transition'

const MODE_LIST = ['', 'out-in', 'in-out']

export default {
  name: COMPONENT_NAME,
  beforeCreate() {
    const findSiblingsRoute = (routeList) => {
      for (let i = 0; i < routeList.length; i++) {
        let item = routeList[i]
        if (this.$route.matched[this.$route.matched.length - 1].regex.test(item.path)) {
          this.siblingsRoute = routeList
          return
        } else if (item.children) {
          findSiblingsRoute(item.children)
        }
      }
    }
    findSiblingsRoute(this.$router.options.routes)
  },
  props: {
    routerList: {
      type: Array,
      default() {
        return this.siblingsRoute
      },
    },
    // 阀值
    threshold: {
      type: Number,
      default: 100
    },
    // 锁定方向
    // 1的时候是45度角
    // 越小越不容易触发切换
    directionLockThreshold: {
      type: Number,
      default: 0.2
    },
    slideRightClass: {
      type: String,
      default: 'slide-right',
    },
    slideLeftClass: {
      type: String,
      default: 'slide-left',
    },
    mode: {
      type: String,
      default: '',
      validator(str) {
        return MODE_LIST.indexOf(str) !== -1
      },
    }
  },
  data() {
    return {
      slideDirection: '',
    }
  },
  watch: {
    '$route' (to, from) {
      this.currentPath = to.path
    }
  },
  created() {
    this.identification = COMPONENT_NAME
  },
  mounted() {
    this._initSlideRouter()
  },
  methods: {
    _initSlideRouter () {
      this.currentPath = this.$route.path
      this.enable()
    },
    touchstartHandler(e) {
      this.startX = e.changedTouches[0].pageX
      this.startY = e.changedTouches[0].pageY
    },
    touchendHandler(e) {
      const direction = this.startX - e.changedTouches[0].pageX
      const moveY = this.startY - e.changedTouches[0].pageY
      const diffX = Math.abs(direction)
      const diffY = Math.abs(moveY)
      const directionLockThreshold = Math.abs(diffY / diffX)

      if (diffX < this.threshold || directionLockThreshold > this.directionLockThreshold) {
        return
      }
      // TODO: 兼容路由参数
      let currentIndex = this.routerList.findIndex((item) => {
        return item.path === this.currentPath
      })
      if (currentIndex === -1) {
        return
      }
      if (direction >= 0 && currentIndex < this.routerList.length - 1) {
        this.slideDirection = this.slideRightClass
        this.$router.push({'path': this.routerList[currentIndex + 1].path})
      } else if (direction < 0 && currentIndex > 0) {
        this.slideDirection = this.slideLeftClass
        this.$router.push({'path': this.routerList[currentIndex - 1].path})
      }
    },
    enable() {
      this.listenerTouchstartHandler = this.touchstartHandler.bind(this)
      this.listenerTouchendHandler = this.touchendHandler.bind(this)
      this.$el.addEventListener('touchstart', this.listenerTouchstartHandler, false)
      this.$el.addEventListener('touchend', this.listenerTouchendHandler, false)
    },
    disable() {
      this.$el.removeEventListener('touchstart', this.listenerTouchstartHandler, false)
      this.$el.removeEventListener('touchend', this.listenerTouchendHandler, false)
    },
    destroyed() {
      this.disable()
    },
  }
}
</script>

<style lang="stylus">
.slide-right-enter
  transform:  translate3d(100%, 0px, 0px)

.slide-right-enter-active
  will-change: transform
  transition: transform 0.2s

.slide-right-leave-active
  will-change: transform
  transition: transform 0.2s

.slide-right-leave-to
  transform:  translate3d(-100%, 0px, 0px)

.slide-left-enter
  transform:  translate3d(-100%, 0px, 0px)

.slide-left-enter-active
  will-change: transform
  transition: transform 0.2s

.slide-left-enter-to
  transform:  translate3d(0px, 0px, 0px)

.slide-left-leave
  transform:  translate3d(0px, 0px, 0px)

.slide-left-leave-active
  will-change: transform
  transition: transform 0.2s

.slide-left-leave-to
  transform:  translate3d(100%, 0px, 0px)

</style>

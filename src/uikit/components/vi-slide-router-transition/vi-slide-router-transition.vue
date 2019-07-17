<template>
  <div class="slide-router">
    <transition :name="slideClass" :mode="mode">
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
      default: 50
    },
    // 锁定方向
    // 1的时候是45度角
    // 越小越不容易触发切换
    directionLockThreshold: {
      type: Number,
      default: 0.8
    },
    slideRightClass: {
      type: String,
      default: 'vi-slide-right',
    },
    slideLeftClass: {
      type: String,
      default: 'vi-slide-left',
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
      slideClass: '',
      enabled: true
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.currentPath = to.path
      }
    }
  },
  mounted() {
    this._initSlideRouter()
    console.log(this.siblingsRoute)
  },
  methods: {
    _initSlideRouter() {
      this.currentPath = this.$route.path
      this.listenerTouchstartHandler = this.touchstartHandler.bind(this)
      this.listenerTouchendHandler = this.touchendHandler.bind(this)
      this.$el.addEventListener('touchstart', this.listenerTouchstartHandler, false)
      this.$el.addEventListener('touchend', this.listenerTouchendHandler, false)
    },
    touchstartHandler(e) {
      if (!this.enabled) {
        return
      }
      const point = e.changedTouches[0]
      this.startX = point.pageX
      this.startY = point.pageY
    },
    touchendHandler(e) {
      if (!this.enabled) {
        return
      }
      const point = e.changedTouches[0]
      const direction = this.startX - point.pageX
      const moveY = this.startY - point.pageY
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
        this.slideClass = this.slideRightClass
        this.$router.push({'path': this.routerList[currentIndex + 1].path})
      } else if (direction < 0 && currentIndex > 0) {
        this.slideClass = this.slideLeftClass
        this.$router.push({'path': this.routerList[currentIndex - 1].path})
      }
    },
    enableSlide() {
      this.enabled = true
    },
    disableSlide() {
      this.enabled = false
    },
    // setSlideClass() {

    // }
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchstart', this.listenerTouchstartHandler, false)
    this.$el.removeEventListener('touchend', this.listenerTouchendHandler, false)
  },
}
</script>

<style lang="stylus">
.vi-slide-right-enter
  transform:  translate3d(100%, 0px, 0px)

.vi-slide-right-enter-active
  will-change: transform
  transition: transform 0.2s

.vi-slide-right-leave-active
  will-change: transform
  transition: transform 0.2s

.vi-slide-right-leave-to
  transform:  translate3d(-100%, 0px, 0px)

.vi-slide-left-enter
  transform:  translate3d(-100%, 0px, 0px)

.vi-slide-left-enter-active
  will-change: transform
  transition: transform 0.2s

.vi-slide-left-enter-to
  transform:  translate3d(0px, 0px, 0px)

.vi-slide-left-leave
  transform:  translate3d(0px, 0px, 0px)

.vi-slide-left-leave-active
  will-change: transform
  transition: transform 0.2s

.vi-slide-left-leave-to
  transform:  translate3d(100%, 0px, 0px)

</style>

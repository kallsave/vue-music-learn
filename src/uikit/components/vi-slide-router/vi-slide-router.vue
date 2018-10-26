<template>
  <div class="slide-router" :style="routerStyle">
    <transition :name="slideDirection">
      <slot></slot>
    </transition>
  </div>
</template>

<script>
const COMPONENT_NAME = 'vi-slide-router'

export default {
  name: COMPONENT_NAME,
  props: {
    routerList: {
      type: Array,
      default() {
        return []
      },
      require: true,
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
    routerStyle: {
      type: Object,
      default() {
        return {}
      }
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
  mounted() {
    this.currentPath = this.$route.path
    this._listenTouchEvents()
  },
  methods: {
    _listenTouchEvents() {
      this.listenerTouchstartHandler = this.touchstartHandler.bind(this)
      this.listenerTouchendHandler = this.touchendHandler.bind(this)
      this.$el.addEventListener('touchstart', this.listenerTouchstartHandler, false)
      this.$el.addEventListener('touchend', this.listenerTouchendHandler, false)
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

      if (diffX < this.threshold) {
        return
      }
      if (directionLockThreshold > this.directionLockThreshold) {
        return
      }
      let currentIndex = this.routerList.findIndex((item) => {
        return item.path === this.currentPath
      })

      if (currentIndex === -1) {
        return
      }

      if (direction >= 0 && currentIndex < this.routerList.length - 1) {
        this.slideDirection = 'slide-right'
        this.$router.push({'path': this.routerList[currentIndex + 1].path})
      } else if (direction < 0 && currentIndex > 0) {
        this.slideDirection = 'slide-left'
        this.$router.push({'path': this.routerList[currentIndex - 1].path})
      }
    },
    destroyed() {
      this.$el.removeEventListener('touchstart', this.listenerTouchstartHandler, false)
      this.$el.removeEventListener('touchend', this.listenerTouchendHandler, false)
    },
  }
}
</script>

<style lang="stylus">
// .slideforward-enter-active
//   transition: transform 0.2s
// .slideforward-leave-active
//   transition: transform 0.2s
// .slideforward-enter
//   transform:  translate3d(100%, 0px, 0px)
// .slideforward-leave-to
//   transform:  translate3d(-100%, 0px, 0px)

// .slideback-enter-active
//   transition: transform 0.2s
// .slideback-leave-active
//   transition: transform 0.2s
// .slideback-enter
//   transform:  translate3d(-100%, 0px, 0px)
// .slideback-leave-to
//   transform:  translate3d(100%, 0px, 0px)
// TODO: 动画用js动画,background支持props传
// 兼容更多场景,比如全屏高度
.slide-right-enter {
  transform:  translate3d(100%, 0px, 0px);
}

.slide-right-enter-active {
  will-change: transform;
  transition: transform 0.2s;
  background: currentColor;
  height: 100vh;
  // height: 100%;
  // position: absolute;
  // top: 0;
}

.slide-right-leave-active {
  will-change: transform;
  transition: transform 0.2s;
  background: currentColor;
  height: 100vh;
  // height: 100%;
  // position: absolute;
  /// top: 0;
}

.slide-right-leave-to {
  transform:  translate3d(-100%, 0px, 0px);
}

.slide-left-enter {
  transform:  translate3d(-100%, 0px, 0px);
}

.slide-left-enter-active {
  transition: transform 0.2s;
}

.slide-left-enter-to {
  transform:  translate3d(0px, 0px, 0px);
}

.slide-left-leave {
  transform:  translate3d(0px, 0px, 0px);
}

.slide-left-leave-active {
  transition: transform 0.2s;
}

.slide-left-leave-to {
  transform:  translate3d(100%, 0px, 0px);
}
</style>

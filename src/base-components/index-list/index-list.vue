<template>
  <div class="vi-index-list">
    <vi-scroll
      ref="scroll"
      :data="data"
      :scroll-events="['scroll']"
      :options="scrollOptions"
      @scroll="scrollHandler">
      <ul class="vi-index-list-ul">
        <li ref="listGroup" class="vi-index-list-group"
          v-for="(group, index) in data" :key="index">
          <h2 ref="listTitle" class="vi-index-list-group-title">{{group.title}}</h2>
          <uL>
            <li class="vi-index-list-group-item"
              v-for="(item, index) in group.items" :key="index"
              @click="selectItem($event, item)" >
              <img class="avatar" v-lazy="item.avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </uL>
        </li>
      </ul>
    </vi-scroll>
    <div class="vi-index-list-nav"
      @touchstart="onShortcutTouchStart"
      @touchmove="onShortcutTouchMove">
      <ul>
        <li ref="anchor" class="vi-index-list-nav-item"
          :class="{'current':currentIndex === index}"
          v-for="(item, index) in shortcutList" :key="index"
          :data-index="index">{{item}}
        </li>
      </ul>
    </div>

    <div ref="fixed" v-show="fixedTitle"
      class="vi-index-list-fixed-title">{{fixedTitle}}</div>
  </div>
</template>

<script>
import ViScroll from '@/uikit/components/vi-scroll/vi-scroll.vue'
import { getData, prefixStyle } from '@/common/helpers/dom.js'

const transform = prefixStyle('transform')

const COMPONENT_NAME = 'vi-index-list'

const EVENT_SCROLL = 'scroll'
const EVENT_SELECT = 'select'

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scrollOptions: {
        probeType: 3,
        click: true
      },
      currentIndex: 0,
      scrollY: 0,
      diff: 0
    }
  },
  created() {
    this.touch = {}
    this.listHeight = []
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this._calculateAnchorHeight()
          this._calculateHeight()
          this._calculateListTitleHeight()
          if (!this.scroll) {
            this._findScroll()
          }
        })
      },
      immediate: true
    },
    scrollY(newVal) {
      // 当滚动到顶部，newVal是个正数
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      const scrollY = Math.abs(newVal)
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (scrollY >= height1 && scrollY < height2) {
          this.currentIndex = i
          this.diff = height2 - scrollY
          return
        }
      }
      // 当滚动到底部,标记为最底部的index
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      // fixedTop是要做的tranform位移,负值
      let fixedTop = (newVal > 0 && newVal < this.listTitleHeight) ? newVal - this.listTitleHeight : 0
      this.$refs.fixed.style[transform] = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      // e.target和e.currentTarget的区别是:
      // e.target是事件源,事件捕获的最后的元素
      // e.currentTarget是绑定这个事件的元素,这个值是即时的,打印指针时看不到
      // 点击ul时,anchorIndex是null
      let anchorIndex = getData(e.target, 'index')
      let touch = e.touches[0]
      // 记录touchstart点击的鼠标位置
      this.touch.y1 = touch.pageY
      // 字符串类型
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // touchmove是通过位移量的取底来做滚动
    onShortcutTouchMove(e) {
      let touch = e.touches[0]
      // 记录touchstart点击的鼠标位置
      this.touch.y2 = touch.pageY
      // | 0 相当于Math.floor()
      let delta = (this.touch.y2 - this.touch.y1) / this.anchorHeight | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _calculateAnchorHeight() {
      if (!this.$refs.anchor) {
        return
      }
      this.anchorHeight = this.$refs.anchor[0].clientHeight
    },
    _scrollTo(index) {
      // 在ul空白区域touchstart
      if (index === null) {
        return
      }
      // 往顶部滑
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 100)
    },
    scrollHandler(pos) {
      this.scrollY = pos.y
      this.$emit(EVENT_SCROLL, pos)
    },
    _calculateHeight() {
      if (!this.$refs.listGroup) {
        return
      }
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _calculateListTitleHeight() {
      if (!this.$refs.listTitle) {
        return
      }
      this.listTitleHeight = this.$refs.listTitle[0].clientHeight
    },
    selectItem(e, item) {
      if (!e._constructed) {
        return
      }
      this.$emit(EVENT_SELECT, item)
    },
    _findScroll() {
      if (!this.$refs.scroll) {
        return
      }
      this.scroll = this.$refs.scroll.scroll
    },
    refresh() {
      this.$refs.scroll.scroll && this.$refs.scroll.scroll.refresh()
    }
  },
  components: {
    ViScroll
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable.styl"
.vi-index-list
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .vi-index-list-ul
    box-sizing: border-box
    padding-bottom: 0px
    .vi-index-list-group
      padding-bottom: 30px
      .vi-index-list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .vi-index-list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
  .vi-index-list-nav
    position: absolute
    z-index: 20
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .vi-index-list-nav-item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .vi-index-list-fixed-title
    // 这种吸顶的位置是固定的
    position: absolute
    top: 0px
    left: 0
    width: 100%
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
</style>

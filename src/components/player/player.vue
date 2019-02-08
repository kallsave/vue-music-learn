<template>
  <div class="player"
    v-show="playList.length>0">
    <transition name="normal">
      <div class="normal-player"
        v-show="fullScreen">
        <div class="background">
            <img width="100%" height="100%"
              :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back"
            @click="close">
            <i class="icon-back"></i>
          </div>
          <h1 class="title"
            v-html="currentSong.name"></h1>
          <h2 class="subtitle"
            v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <vi-slide
            ref="slide"
            @scroll-end="slideEnd">
            <div class="middle-l">
              <div class="cd-wrapper">
                <div class="cd">
                  <transition :duration="durationChangeSone"
                    @enter="changeSongEnter"
                    @after-enter="changeSongAfterEnter">
                    <img class="image image-cover"
                      :src="oldSong.image"
                      v-show="isSongChange">
                  </transition>
                  <transition :duration="durationMove"
                    @enter="bigImgEnter"
                    @after-enter="bigImgAfterEnter"
                    @leave="bigImgLeave"
                    @after-leave="bigImgAfterLeave">
                    <img ref="bigImg" class="image"
                      :src="currentSong.image"
                      v-show="fullScreen">
                  </transition>
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <div class="middle-r">
              <vi-scroll
                ref="lyricScroll"
                :scroll-events="['scroll']"
                :options="scrollOptions">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p ref="lyricLine"
                      class="text"
                      :class="{'current': currentLineNum === index}"
                      v-for="(line, index) in currentLyric.lines"
                      :key="index">{{line.txt}}</p>
                  </div>
                </div>
              </vi-scroll>
            </div>
          </vi-slide>
        </div>
        <div class="bottom">
          <div class="slide-dots">
            <span class="slide-dot"
              :class="{active: currentSlideIndex === index }"
              :key="index"
              v-for="(item, index) in [0, 1]"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <base-progress-bar :percent="percent"
                @percent-change="percentChange"></base-progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center"
              :class="disableClass">
              <i :class="playIcon"
                @click.stop="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"
                @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
        v-show="!fullScreen"
        @click="open">
        <div class="icon">
          <transition :duration="durationMove"
            @before-enter="miniImgEnter"
            @after-enter="miniImgAfterEnter"
            @after-leave="miniImgAfterLeave">
            <img ref="miniImg"
              width="40" height="40"
              :src="currentSong.image"
              v-show="!fullScreen">
          </transition>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" ref="control">
          <base-progress-circle
            :radius="32"
            :percent="percent">
            <i class="icon-mini"
              :class="miniIcon"
              @click.stop="togglePlaying" ></i>
          </base-progress-circle>
        </div>
        <div class="control"
          @click.stop="redirectToRecommend">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="ended"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import createKeyframe from 'create-keyframe-animation'
import { prefixStyle, getTransformAngle } from '@/common/helpers/dom.js'
import { padZero, shuffle } from '@/common/helpers/utils.js'
import { playMode } from '@/store/modules/player/config.js'
import Lyric from 'lyric-parser'
import { createSong, Song } from '@/common/class/song.js'

const DURATION_MOVE = 400
const DURATION_ROTATE = 20000
const DURATION_CHANGE_SONG = 800
const DURATION_START_ROTATE = 800

const TRANSFORM = prefixStyle('transform')

export default {
  data() {
    return {
      isSongReady: false,
      currentTime: 0,
      isSongChange: false,
      durationMove: DURATION_MOVE,
      durationROTATE: DURATION_ROTATE,
      durationChangeSone: DURATION_CHANGE_SONG,
      oldSong: {},
      bigImgAngle: 0,
      currentLyric: null,
      currentLineNum: 0,
      scrollOptions: {
        probeType: 3
      },
      currentSlideIndex: 0,
      playingLyric: ''
    }
  },
  mounted() {
    // localStorage不能保存class的处理
    if (this.currentSong && !(this.currentSong instanceof Song)) {
      this.addSongClass()
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon() {
      return this.playing && this.isSongReady ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing && this.isSongReady ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdClass() {
      // 用js实现了
      // return this.playing && this.isSongReady ? 'play' : 'play pause'
      return ''
    },
    disableClass() {
      return this.isSongReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    }
  },
  watch: {
    fullScreen(newVal) {
      this.$nextTick(() => {
        this.$refs.slide.setSlideWidth()
      })
    },
    // 切换歌曲,未知歌曲的资源是否能使用是不可预见的
    currentSong(newVal, oldVal) {
      if (newVal.id === oldVal.id) {
        return
      }
      this.isSongReady = false
      this.isSongChange = true
      this.oldSong = oldVal
      // 等到isSongChange触发的视图更新完毕再让animatoin无效
      // 因为要获取this.$refs.bigImg的旋转角
      this.$nextTick(() => {
        this.$refs.bigImg.style.animation = ''
        // 重绘隔离
        requestAnimationFrame(() => {
          this.bigImgAngle = 0
          this.bigImgAfterEnter(this.$refs.bigImg, DURATION_START_ROTATE)
        })
      })
    },
    playing() {
      this.$nextTick(() => {
        this.playingHandler({
          durationStartRotate: 0
        })
      })
    },
    // 歌曲资源能找到并且当前状态是播放就播放
    isSongReady(newVal) {
      const audio = this.$refs.audio
      if (this.playing && newVal) {
        audio.play()
        if (this.currentLyric) {
          // Lyric是个定时器
          this.currentLyric.stop()
          this.currentTime = 0
          this.currentLineNum = 0
          this.playingLyric = ''
        }
        this.playLyric()
      } else {
        audio.pause()
      }
      this.$nextTick(() => {
        this.playingHandler()
      })
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'addSongClass',
      'tempDisableMutableKeepAliveName'
    ]),
    redirectToRecommend() {
      this.tempDisableMutableKeepAliveName()
      this.$router.push({
        path: '/recommend'
      })
    },
    close() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    // enter和leave有done
    // enter,leave相当于enter-active
    bigImgEnter(el, done) {
      const {x, y, scale, angle} = this._bigImgEnterConfig()

      this.bigImgAngle = angle

      this.frameList = [
        {
          translate: [x, y],
          scale: scale,
          rotate: angle
        },
        {
          translate: [0, 0],
          scale: 1.1,
          rotate: angle
        },
        {
          translate: [0, 0],
          scale: 1,
          rotate: angle
        }
      ]

      // createKeyframe每次注册前,都会把同名的animation删除
      // runAnimation会把一个元素的style.animation赋新值
      // 如果需要让元素的animation失效,el.style.animation = ''即可
      createKeyframe.registerAnimation({
        name: 'big-img-enter-move',
        animation: this.frameList,
        presets: {
          duration: DURATION_MOVE,
        }
      })

      createKeyframe.runAnimation(el, 'big-img-enter-move').then(() => {
        done()
      })
    },
    bigImgAfterEnter(el, startRotateTime = 0) {
      setTimeout(() => {
        if (!this.playing || !this.isSongReady) {
          return
        }
        this.$refs.bigImg.style[TRANSFORM] = ''
        let frameList = [
          {
            rotate: this.bigImgAngle
          },
          {
            rotate: 360 + this.bigImgAngle
          },
        ]
        createKeyframe.registerAnimation({
          name: 'big-img-rotate',
          animation: frameList,
          presets: {
            duration: DURATION_ROTATE,
            iterations: 'infinite',
            easing: 'linear',
          }
        })
        createKeyframe.runAnimation(el, 'big-img-rotate')
      }, startRotateTime)
    },
    bigImgLeave(el, done) {
      // 保存结束前的this.bigImgAngle给miniImgEnter使用
      this.bigImgAngle = getTransformAngle(el)
      const {x, y, scale} = this._bigImgEnterConfig()
      createKeyframe.registerAnimation({
        name: 'big-img-leave-move',
        animation: [
          {
            translate: [0, 0],
            scale: 1,
          },
          {
            translate: [x, y],
            scale: scale,
          },
        ],
        presets: {
          duration: DURATION_MOVE,
        }
      })
      createKeyframe.runAnimation(el, 'big-img-leave-move').then(() => {
        done()
      })
    },
    bigImgAfterLeave(el) {
      // 大圆隐藏后
      el.animation = ''
    },
    // 大圆的动画预设
    _bigImgEnterConfig() {
      // 小圆的宽度
      const targetWidth = 40
      // 小圆到页面左边的距离
      const paddingLeft = 40
      // 小圆到页面底部的距离
      const paddingBottom = 30
      // 大圆到页面顶部的距离
      const paddingTop = 80
      // 大圆的宽度
      const width = window.innerWidth * 0.8
      // 放大倍数
      const scale = targetWidth / width
      // 一开始是0,后面和bigImgAngle的数值一样
      const angle = getTransformAngle(this.$refs.miniImg)

      // 小圆中心点到大圆中心点的x轴距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 小圆中心点到大圆中心点的y轴距离
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale,
        angle
      }
    },
    miniImgEnter(el) {
      let frameList = [
        {
          rotate: 0
        },
        {
          rotate: this.bigImgAngle
        }
      ]
      createKeyframe.registerAnimation({
        name: 'mini-img-enter',
        animation: frameList,
        presets: {
          duration: 0,
        }
      })
      createKeyframe.runAnimation(el, 'mini-img-enter')
    },
    miniImgAfterEnter(el, startRotateTime = 0) {
      this.$refs.miniImg.style[TRANSFORM] = ''
      setTimeout(() => {
        if (!this.playing || !this.isSongReady) {
          return
        }
        let frameList = [
          {
            rotate: this.bigImgAngle
          },
          {
            rotate: 360 + this.bigImgAngle
          }
        ]
        createKeyframe.registerAnimation({
          name: 'mini-img-rotate',
          animation: frameList,
          presets: {
            duration: DURATION_ROTATE,
            iterations: 'infinite',
            easing: 'linear'
          }
        })
        createKeyframe.runAnimation(el, 'mini-img-rotate')
      }, startRotateTime)
    },
    miniImgAfterLeave(el) {
      // 小圆圆隐藏后
      el.animation = ''
    },
    _miniImgEnterConfig() {
      const angle = getTransformAngle(this.$refs.bigImg)
      return {
        angle
      }
    },
    // vue过渡动画最好css和js只用一个,createKeyframe的控制效果比css好
    changeSongEnter(el, done) {
      // createKeyframe里面的属性中scale,rotate,translate,transform支持函数
      // scale,rotate,translate是特殊处理过的格式,有简便写法
      // 其它的用css属性名不使用驼峰命名
      const angle = getTransformAngle(this.$refs.bigImg)
      // el.style.zIndex = 1
      let frameList = [
        {
          scale: 1,
          translate: [0, 0],
          opacity: 1,
          'z-index': 1,
          rotate: angle
        },
        {
          scale: 0.9,
          translate: [0, 0],
          opacity: 1,
          'z-index': 1,
          rotate: angle
        },
        {
          scale: 0.9,
          translate: [0, '-100%'],
          opacity: 0,
          'z-index': 1,
          rotate: angle
        },
      ]

      createKeyframe.registerAnimation({
        name: 'change-song',
        animation: frameList,
        presets: {
          duration: DURATION_CHANGE_SONG,
          easing: 'linear',
        }
      })

      createKeyframe.runAnimation(el, 'change-song').then(() => {
        done()
      })
    },
    changeSongAfterEnter(el) {
      el.style.display = 'none'
      this.isSongChange = false
    },
    togglePlaying() {
      if (!this.isSongReady) {
        return
      }
      this.setPlayState(!this.playing)
      // 歌曲暂停和播放用togglePlay方法
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    ready() {
      this.isSongReady = true
    },
    prev() {
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    next() {
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    ended() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        // 点击玄学,调用I/0操作的回调函数要和I/0操作的效果一模一样要加上异步
        // dom.click()也不行
        // I/0操作都是异步线程
        setTimeout(() => {
          this.next()
        }, 20)
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    error() {
      this.isSongReady = false
      this.toast = this.$createViToastTxt({
        txt: '资源出错啦',
        time: 3000,
      }).show()
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const minute = padZero(interval / 60 | 0)
      const second = padZero(interval % 60)
      return `${minute}:${second}`
    },
    percentChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode() {
      let txt = ''
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
        txt = '随机播放'
        this.$createViToastTxt({
          txt,
          time: 2000
        }).show()
      } else if (mode === playMode.loop) {
        list = this.sequenceList
        txt = '单曲循环'
        this.$createViToastTxt({
          txt,
          time: 2000
        }).show()
      } else {
        list = this.sequenceList
        txt = '列表循环'
        this.$createViToastTxt({
          txt,
          time: 2000
        }).show()
      }
      // 先改变currentIndex再改变playList
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      // currentSong的getter会自动根据playList和currentIndex得出
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    playLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.currentLyric.play()
        this.$nextTick(() => {
          this.$refs.lyricScroll.refresh()
        })
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricScroll.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    slideEnd(slideIndex) {
      this.currentSlideIndex = slideIndex
    },
    // 处理旋转动画的时机
    playingHandler({durationStartRotate = DURATION_START_ROTATE} = {}) {
      const audio = this.$refs.audio
      if (this.isSongReady && this.playing) {
        audio.play()
        this.bigImgAfterEnter(this.$refs.bigImg, durationStartRotate)
        this.miniImgAfterEnter(this.$refs.miniImg, durationStartRotate)
      } else {
        audio.pause()
        if (this.fullScreen) {
          this.bigImgAngle = getTransformAngle(this.$refs.bigImg)
          this.$refs.bigImg.style.animation = ''
          this.$refs.bigImg.style[TRANSFORM] = `rotate(${this.bigImgAngle}deg)`
        } else {
          this.bigImgAngle = getTransformAngle(this.$refs.miniImg)
          this.$refs.miniImg.style.animation = ''
          this.$refs.miniImg.style[TRANSFORM] = `rotate(${this.bigImgAngle}deg)`
        }
      }
    }
  }
}
</script>

<style lang="stylus" modules>
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

.player
  .normal-player
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: $z-index-page-xx
    background: $color-background
    &.normal-enter-active, &.normal-leave-active
      // 根元素一定要加上css时间
      transition: all 0.5s
      .top, .bottom
        transition: transform 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    // css-enter => css-enter-active(time) => => css-enter-to
    // css-leave => css-leave-active => css-leave-to
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: $z-index-normal
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: absolute
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80vw
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              // 动画暂停 paused|running 默认running
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .slide-dots
        text-align: center
        font-size: 0
        .slide-dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 40px
          line-height: 30px
          width: 40px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
  .mini-player
    display: flex
    align-items: center
    position: absolute
    left: 0
    bottom: 0
    z-index: $z-index-page-x
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.5s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      position: relative
      .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        color: $color-theme-d
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)

</style>

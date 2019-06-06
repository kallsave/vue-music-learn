## Html书写规范
- class使用-分割单词
- 减少html中的class,一个dom尽量只有一个class
- 一行代码的长度不得超过编辑器的长度,子元素尽量都换行
- ref > v-if = v-show > class >  for = key > : > @
- 一些坑点: 在苹果手机和谷歌浏览器上,button,input这些原生的控件对事件的捕获能力要比div强,所以写一些第三方组件,需要点击的bom可以优先考虑button

## JS代码书写规范
- 遵循eslint代码规范
- 常量需要使用const大写申明,单词区分用下滑线标识
- 内部函数用_开头
- name > extends > components > beforeCreate > mixins > provide > inject >  props > data > computed > watch > created > mounted > activated > methods > updated
生命周期:
created => children.props => children.data => children.created =>
- mounted中避免使用this.$nextTick,这种场景用于确保父组件中所有的子组件的dom都挂载完毕。

- 动作命名:
  can 判断是否可执行某个动作

  has 判断是否有某个值

  is 判断是否为某个值

  get 获取某个值

  set 设置某个值

## Css书写规范
- 一个样式一行
- 不推荐使用fixed,能用position: absolute的就不用fixed,fixed在很多场景下有bug:
  fixed会在transform下会降级为absolute

  fixed布局的弹窗如果有输入框,在ios上输入光标偏移

- transform的scale要写在translate之后

## 语法建议
- Promise的catch语法建议

```javascript
// 第一个then的Promise.resolve的回调,catch是reject的回调
updateImg().then((data) => {
  // ...
}).catch((err) => {
  // ...
  console.error(err)
})
```

- 如果是使用async/await语法,在await函数后使用catch避免阻断

```javascript
let imgList = [1, 2, 3]
function updateImg (img) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (img !== 2) {
        console.log(`第${img}张图片上传成功`)
        resolve(img)
      } else {
        console.log(`第${img}张图片上传失败`)
        reject(`第${img}张图片上传失败`)
      }
    }, 1000)
  })
}
async function updateAllImg () {
  for (let i = 0; i < imgList.length; i++) {
    let item = imgList[i]
    // 当await中的Promise对象reject被catch处理时,不会阻断下一个await执行
    await updateImg(item).catch((err) => {
      // ...
      // console.error(err)
    })
  }
}
```

如果在for循环中使用async/await,不想申明没必要的函数名
```javascript
; (async () => {
  for (let i = 0; i < arr.length; i++) {
    await (() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(i)
          resolve()
        }, 1000)
      })
    })()
  }
  await (() => {
    ...
  })()
})()
```
- arguments语法
  arguments适用于多参数的函数,使用...arguments而不是arguments

## Css代码规范
- 不使用active,content,left,right等容易被命名使用的全局样式
- 大量使用的icon-font才能作为全局字体图标
- 减少使用标签
- 不使用id写样式

## vue组件规范
- uikit是不带任何的业务逻辑和项目样式,高度封装化,全局挂载的ui组件库:
- uikit部分提供body挂载,由createAPI或者mount-in-body调用,样式使用vi-前缀严格开头,不使用css module的scoped,不使用webpack的alias语法,需要有component-name,使用局部图标字体,用[svgtofont](https://github.com/jaywcjlove/svgtofont)管理图标

- base有待进化成uikit,没有高度封装化,不带任何的业务逻辑

- components是业务逻辑组件,带有接口,vuex使用的components
全局的小零件,样式使用css module的scoped

- pages是页面级组件,vue-router的components
子路由应该放在父路由的文件夹的children里面
样式使用scoped

- 遵循就近维护的原则,该组件引用的字体,图片都放在该组件的文件夹内

- vue中$emit的事件名需要用const申明

- 组件传值是遵循props单向原则(vue只能检测props的指针而不能检测属性下的变动),
不能在子组件修改props的属性值(警惕v-model的隐形赋值改变属性的值),如果需要改变props的值传回给父组件,请使用深度克隆+$emit或者refs去拿值都可以


## 项目架构
- api文件夹是接口文件夹,一个页面的接口放在一个js文件

- assets是共用的图片

- common是共用的js代码和stylus函数和字体文件和一个字体文件带来的style.css

- class是项目中使用的类

- helpers文件夹是不带项目逻辑的js工具文件

- mixins文件夹是vue的mixins

- stylus文件夹有

  base设置项目的基础样式

  index样式的入口文件

  mixin函数文件

  reset第三方基础样式文件和variable项目样式风格文件

  animation全局的过渡动画样式

- store是vue-vuex的配置文件

- lib是没有提供npm下载的第三方库或者改过源码的第三方库

## 图标管理
- 图标使用svgtofont来管理,具体的配置看build/svgtofont

## Vue的语法
- .sync语法需要和update:配合使用,例如:

  this.$emit('update:isVisible', true) => @update:isVisible

  也会找到:is-visible.sync = xxx

  把传值赋给xxx => is-visible = xxx

  最终isVisible = 传值

- 因为.sync和update:使用有点绕,如果没有必要,减少.sync的使用:

  组件的显示和隐藏可以通过this.$refs.xxx.show()/hide(),v-model(嵌套组件里用)来控制

  这样可以减少变量,降低ui组件嵌套的复杂度,提高代码的可读性

- css modules优于 css scoped

## 关于keep-alive
  keep-alive是实现原生交互效果(缓存页面)的很强大的组件,keep-alive页面的生命周期没有停止,过多页面keep-alive会造成页面卡顿,所以要提供清除keep-alive,减少keep-alive页面的功能。
  不用$destory的原因是$destory这个功能有缺陷,一旦一个组件调用这个方法,后面都不会再被keep-alive。
  这个项目的路由层级只有两级,体现不了太多keep-alive的使用

  >keep-alive场景:
  >1. 列表页 => 详情页最经典的方式是列表页keep-alive,详情页不做keep-alive处理
  >2. tab => 各个页面类似slide做keep-alive(使用component组件,使用动态props,动态component)
  >3. 表单页跳转到其他页面,返回表单页填写的信息还保留在页面上
  >4. 没有数据变更的静态页面

  > 路由keep-alive管理方案1:
  考虑到一个项目可能就几个页面有动态的keep-alive需求,本项目把keep-alive分为始终不变的keep-alive和动态变更的keep-alive(通过vuex控制),这种简洁的方案只是一种折中的处理,对哪个页面keep-alive或者不keep-alive不能细粒化(或者说做到细粒化管理很麻烦)。需要考虑好的场景是如果详情页下面还有更多的跳转分支,比如
  > 用户列表 => 用户详情 => 备注列表 => 备注详情
    期望的效果是对备注列表页做keep-alive,那么首先用户详情页的name是no-keep-alive的,并且在跳转到用户详情页mounted钩子中清除所有immutable-keep-alive,因为备注列表是keep-alive的
  >keep-alive的命名在common/config/keep-alive-name.js中定义,给组件使用keep-alive需要import这个文件的变量

  ```javascript
  <template>
    <keep-alive :include="['immutable-keep-alive', mutableKeepAliveName]">
      <router-view></router-view>
    </keep-alive>
    ...
  </template>

  <script>
  import { mapGetters } from 'vuex'
  export default {
    ...
    computed: {
      ...mapGetters([
        'mutableKeepAliveName'
      ])
    }
  }
  </script>
  ```

  在一般场景下,这个组件是keep-alive的,当不需要keep-alive时,跳转到这个页面之前让keep-alive暂时失效,从而达到不做keep-alive的目的
  ```javascript
  import { mapActions } from 'vuex'
  ...
  methods: {
    ...mapActions([
      'tempDisableMutableKeepAliveName'
    ]),
    redirectToRecommend() {
      this.tempDisableMutableKeepAliveName()
      // /index/recommend页面是动态keep-alive的
      this.$router.push({
        path: '/index/recommend'
      })
    },
    ...
  }
  ```

 > 路由keep-alive管理方案2:
 > 这个方案好管理,应该是最佳方案
 > 实现前进刷新,后退不刷新
 > 为了方便使用,route.name和componentName要对应起来,这样compoentName===this.$route.name
 > 为了全局使用,管理keepAlive的数组用vuex来组织
 > 原理:

 > 跑在浏览器的页面:
 > 0.可以在每一个页面引入一个没有html模板的管理keepAlive的组件或者mixin,方便调用
 > 1.每进入一个页面用管理keepAlive的数组存当前页面的componentName
 > 2.跳转到新页面时,管理keepAlive的数组先删除即将去的页面的componentName,保证了浏览器反复(跳转+浏览器的返回)也不会导致将去的页面的keepAlive。保存按钮返回到原来页面前管理keepAlive的数组删除当前页面的componentName
 > 3.如果前进页面的数据更新会导致缓存页面的数据需要做刷新处理,如果是相邻的两个页面,使用vuex让列表页和详情页关联起来.如果是相差N(N>2)个页面,可以用vuex也可以数据更新后管理keepAlive的数组删除这个缓存页面的componentName

 > 嵌套在app的页面:
 > 0.对于嵌套在app的页面,有顶部导航返回按钮,封装这个page组件统一处理减少代码
 > 1.page组件进来时用管理keepAlive的数组存当前页面的componentName,
 > 2.page组件点击返回按钮删除当前页面的componentName(保持按钮等操作类似)
 > 3.如果前进页面的数据更新会导致缓存页面的数据需要做刷新处理,如果是相邻的两个页面(比如列表和详情)),使用vuex让列表页和详情页关联起来.如果是相差N(N>2)个页面,可以用vuex也可以数据更新后管理keepAlive的数组删除这个缓存页面的componentName
 > 4.保持按钮删除当前页面的componentName要引入vuex的代码,更简便的做法是调用this.$refs.page.back(),相当于点击了返回按钮

 > 更好的解决方案
 > 结合vue-router的api写一个插件

 > 遇到的问题:
 > 当用户可操作改变的数据过多时,要具体删除哪个页面的缓存成了一个问题(通常是保存提交按钮后检查这些数据都有哪些页面涉及,然后删除)

 > 路由keep-alive和滚动位置
 > 当keep-alive和页面跳转过渡动画在一起使用时,如果leave(比如列表页)的页面在过渡动画中改变了视图高度,那么返回到原来的页面时,页面的滚动位置不是原来切换到详情页的位置。vue-router提供scrollBehavior这个api,但是因为有过渡动画的缓动时间,所以不好选择时机操作滚动条做"无感知"的效果。正确的做法是需要keep-alive的leave不用改变高度,不需要keep-alive的enter可以改变高度,这样效果是无感知而且代码是最少的。并且要使用this.$router.back()才有效果。

 ```javascript
 <style lang="less">
  @easeInOut: cubic-bezier(.61,0,.44,1);
  @easeIn: cubic-bezier(.2,0,0,1);

  .router-view {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    // 防止布局溢出导致动画抖动
    overflow-x: hidden;
    background-color: #f4f4f4;
    &.move-right-enter {
      position: fixed;
      z-index: 20;
      height: 100vh;
      left: 100%;
      .vux-header {
        .vux-header-title {
          transform: translateX(200%);
        }
      }
    }
    &.move-right-enter-active {
      position: fixed;
      z-index: 20;
      height: 100vh;
      transition: left 300ms @easeIn;
      .vux-header {
        .vux-header-title {
          transition: transform 300ms @easeInOut;
        }
      }
    }
    &.move-right-enter-to {
      position: fixed;
      z-index: 20;
      height: 100vh;
    }
    &.move-right-leave {
      z-index: 10;
      .vux-header {
        z-index: 10;
      }
    }
    &.move-right-leave-active {
      z-index: 10;
      transition: left 280ms @easeInOut;
    }
    &.move-right-leave-to {
      z-index: 10;
      left: -50%;
      .vux-header {
        z-index: 10;
      }
    }
    &.move-left-enter {
      z-index: 10;
      left: -30%;
      .vux-header {
        z-index: 10;
        left: -30%;
      }
    }
    &.move-left-enter-active {
      z-index: 10;
      transition: left 300ms @easeIn;
      .vux-header {
        z-index: 10;
        transition: left 300ms @easeIn;
      }
    }
    &.move-left-enter-to {
      z-index: 10;
      .vux-header {
        z-index: 10;
      }
    }
    &.move-left-leave {
      position: fixed;
      z-index: 20;
      height: 100vh;
      left: 0%;
      .vux-header {
        z-index: 20;
        left: 0%;
      }
    }
    &.move-left-leave-active {
      position: fixed;
      z-index: 20;
      height: 100vh;
      left: 100%;
      transition: left 280ms @easeInOut;
      .vux-header {
        z-index: 20;
        left: 100%;
        transition: left 280ms @easeInOut;
      }
    }
    &.move-left-leave-to {
      position: fixed;
      z-index: 20;
      height: 100vh;
      left: 100%;
      .vux-header {
        z-index: 20;
        left: 100%;
      }
    }
  }
  </style>
 ```

  -当keep-alive和第三方scroll库一起使用,页面的高度是100vh,滚动只发生在容器内部,所以也是很好的"无感知"效果


## 关于vue-router的参数
- name:
>如果一个表单页面有新建和查看或者编辑的功能,那么可以配置多个路由同一个组件文件,用name来标识,跳转是通过
this.$route.push({
  name: 'xxx'
}),通过this.$route.name来判断是那个路由

- query和params
>query和params两者都可以传参
query是key=value格式,params如果匹配上是/value的格式(key是顺序)
query是经典的url参数,但是必须通过vue-router的使用方式才能获取到$route.query,拼接url是不能获取query的
params如果匹配上路由表的:key规则的会暴露在url中,不匹配上不会暴露在url上。
params无法和path配合使用


常见场景：
- 列表页传参给详情页(简单场景不需要用全局的vuex或者污染localStorage),如果需要刷新详情页仍能正常使用,参数要保留在url上,如果参数过多可能导致url过长,考虑用params,把数据挂载在params.data上,这种方式是的好处是不污染localStorage和别的页面,弊端是刷新详情页不能正常使用

## 路由过渡动画
- 路由过渡动画有loading的作用,过渡enter开始时,页面的生命周期已经开始,接口也开始请求,然后过来的时候显得接口特别快
- transform让fixed降级为absolute,如果页面有导航头是fixed的话,应该使用left而不是transform

- 通过maxLength为2的shift/unshift栈控制全局的路由跳转代码:
App.vue
```javascript
<template>
  <div id="app" class="app">
    <transition :name="transitionName">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>


</script>

```

## 关于better-scroll
- 本项目大量使用了[better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#preventdefaultexception)

- preventDefaultException

- 使用better-scroll的preventDefaultException规则,阻止浏览器的原生行为

  ios上fixed元素在滚动时消失,meta设置禁止缩小放大失效还有一系列原生浏览器带来的bug?

  同时也阻止了一些其他默认事件,开启需要preventDefaultException是非常麻烦的的,需要做exception处理

  better-scroll的preventDefaultException主要是在冒泡阶段阻止,所以对不需要进行阻止原生行为的元素的最小子代元素添加class,在需要点击,跳转,获得焦点等等都要加...建议不要开启

  对于click事件来说,从最小的元素冒泡到外围,所以没有点击到最小的元素是无法传递下去的,如果想扩大点击范围,范围内的元素都要添加class

  减少better-scroll嵌套场景的出现,因为会带来better-scroll嵌套事件分发的问题

  多层scroll嵌套的场景,复杂的场景通过监听scroll的位置,在一定范围手动让外层scroll滚动,对scroll进行enable,disable,scrollTo处理

  多层scroll嵌套可以考虑不做嵌套,做兄弟元素scroll,scrollTo处理

  stoppropagation已知问题不仅仅是对better-scroll的touch事件阻断,对原生的touch事件都会有阻断

- better-scroll的事件传递
  多层scroll嵌套的场景,使用[stoppropagation](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#stoppropagationv190)隔断,因为一旦隔断,所有的事件模型(click,scroll,scrollEnd等)都不会被传递,所以通常不会阻断,而是通过enable,disable,手动调用scrollTo处理,手动阻断事件传递

  如果better-scroll出现嵌套的scroll或者slide,有几层嵌套就会触发几次better-scroll的原生事件,比如slide轮播图的scrollEnd,scroll会分发到外层的scroll,slide的scrollEnd,scroll,为了解决这个问题,在二级组件使用better-scroll的原生事件明显有bug,而是通过判断使用由better-scroll的原生事件派生出的派生事件(比如换页的change,手动滚动而不是自动滚动的touch-scroll),而beforeScrolBefore,touchEnd这些事件是判断主动触发的关键,scrollEnd是判断是否换页的关键,这些都是一级slide组件必须监听的事件

  对于scroll,slide的组件设计,scroll事件比较消耗性能,其他better-scroll的原生事件性能消耗不大,scrollEvents有beforeScrollStart,scrollStart,scroll,scrollCancel,scrollEnd,touchEnd六个

## touchstart,touchmove,touchend,click
- touch系列的事件只要e.stopPropagation()都可以阻止他和他子元素的click的事件的触发,至于父元素的click因为stopPropagation阻止冒泡了,也不会触发

## 动画的过渡效果
- 当机子的性能不好时,动画就会掉帧,其中动画开始和动画结束最容易掉帧,会出现闪屏,卡顿等,优化的思路是用贝塞尔曲线对动画的速率做调节,在动画开始和结束时,动画的速率最低,也就是ease-out-in,比较好的曲线参数是cubic-bezier(.61,0,.44,1)

## 其他
- 使用TODO,FIXME,FORK标识代码,vscode下载TODO Highlight

```javascript
// TODO: 如果代码中有该标识,说明有功能待编写或者去除
// FIXME: 如果代码中有该标识,说明代码有bug或者需要优化
// FORK: 如果代码中有该标识,说明是修改的第三方库源码
```









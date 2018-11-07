## html书写规范
- class使用-分割单词
- 减少html中的class,一个dom尽量只有一个class
- 一行代码的长度不得超过编辑器的长度,子元素尽量都换行
- ref > v-if = v-show > class >  for = key > : > @

## JS代码书写规范
- 遵循eslint代码规范
- 常量需要使用const大写申明,单词区分用下滑线标识
- 内部函数用_开头
- components > beforeCreate> mixins > provide > inject >  props > data > computed > watch > created > mounted > activated > methods > updated
- mounted中避免使用this.$nextTick,这种场景用于确保父组件中所有的子组件的dom都挂载完毕。其它场景慎用

- 动作命名:
  can 判断是否可执行某个动作

  has 判断是否有某个值

  is 判断是否为某个值

  get 获取某个值

  set 设置某个值

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

## Css代码规范
- 不使用active,content,left,right等容易被命名使用的全局样式
- 大量使用的icon-font才能作为全局字体图标
- 减少使用标签
- 不使用id写样式

## 组件规范
- uikit是不带任何的业务逻辑和项目样式,高度封装化,全局挂载的ui组件库:
- uikit提供全局components,部分提供body挂载,由createAPI或者mount-in-body调用,样式使用vi-前缀严格开头,不使用css module的scoped,不使用webpack的alias语法,需要有component-name,使用局部图标字体,用[svgtofont](https://github.com/jaywcjlove/svgtofont)管理图标

- base-components有待进化成ui-components,没有高度封装化,不带任何的业务逻辑

- components是业务逻辑组件,带有接口,vuex使用的components
全局的小零件,样式使用css module的scoped

- pages是页面级组件,vue-router的components
子路由应该放在父路由的文件夹的children里面
样式使用scoped

- 遵循就近维护的原则,该组件引用的字体,图片都放在该组件的文件夹内

- vue中$emit的事件名需要用const申明

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

## 关于keep-alive
  keep-alive是实现原生交互效果(缓存页面)的很强大的组件,但是过多页面keep-alive也会造成页面卡顿
  >keep-alive场景:
  >1. 列表页 => 详情页最经典的方式是列表页keep-alive,详情页不做keep-alive处理
  >2. router-tab => 各个页面类似slide做keep-alive
  >3. 表单页跳转到其他页面,返回表单页填写的信息还保留在页面上
  >4. keep-alive还有更复杂的场景,有的页面既需要keep-alive又需要不keep-alive,即keep-alive的规则是动态的,比如表单既需要跳到个别页面(选择卡之类的页面)保持keep-alive,又需要在提交后不keep-alive,重新进来时不keep-alive

  考虑到一个项目可能就几个页面有动态的keep-alive需求,本项目把keep-alive分为始终不变的keep-alive和动态变更的keep-alive(通过vuex控制)

  keep-alive的命名在common/config/keep-alive-name.js中定义,给组件使用keep-alive需要import这个文件的变量

  ```javascript
  <keep-alive :include="['immutable-keep-alive', mutableKeepAliveName]">
    <router-view></router-view>
  </keep-alive>
  ...
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
      // /recommend页面是动态keep-alive的
      this.$router.push({
        path: '/recommend'
      })
    },
    ...
  }
  ```
  不用$destory的原因是
  $destory这个功能有缺陷,一旦一个组件调用这个方法,后面都不会再被keep-alive
  如果要做keep-alive的动态控制,应该使用上面这种动态的方式

 keep-alive是会占用内存的,所以提供临时清除所有keep-alive的功能

## 关于vue-router的参数
- name:
>如果一个表单页面有新建和查看或者编辑的功能,那么可以配置多个路由同一个组件文件,用name来标识,跳转是通过
this.$route.push({
  name: 'xxx'
}),通过this.$route.name来判断是那个路由

- query和params
>query和params两者都可以传参
query是经典的url参数,但是必须通过vue-router的使用方式才能获取到$route.query,拼接url是不能获取query的
params如果匹配上路由表的:key规则的会暴露在url中,不匹配上不会暴露在url上。

常见场景：
- 列表页传参给详情页(简单场景不需要用全局的vuex或者污染localStorage),如果需要刷新详情页仍能正常使用,参数要保留在url上,如果参数过多可能导致url过长,考虑用params,把数据挂载在params.data上,这种方式是的好处是不污染localStorage和别的页面,弊端是刷新详情页不能正常使用


## 关于better-scroll
- 本项目大量使用了[better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#preventdefaultexception)

- 使用better-scroll的preventDefaultException规则,阻止浏览器的原生行为

  ios上fixed元素在滚动时消失,meta设置禁止缩小放大失效还有一系列原生浏览器带来的bug?

  同时也阻止了一些其他默认事件,开启需要preventDefaultException是非常麻烦的的,需要做exception处理

  better-scroll的preventDefaultException主要是在冒泡阶段阻止,所以对不需要进行阻止原生行为的元素的最小子代元素添加class,在需要点击,跳转,获得焦点等等都要加...建议不要开启

  对于click事件来说,从最小的元素冒泡到外围,所以没有点击到最小的元素是无法传递下去的,如果想扩大点击范围,范围内的元素都要添加class

  多次scroll嵌套的场景,使用[stoppropagation](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#stoppropagationv190)隔断,通过监听scroll,,如果不使用stoppropagation,外层scroll的scroll-content上拉导致出现空白,复杂的场景通过监听scroll的位置,在一定范围手动让外层scroll滚动,对scroll进行enable,disable,scrollTo处理

  stoppropagation已知问题不仅仅是对better-scroll的touch事件阻断,对原生的touch事件都会有阻断


## 其他
- 使用TODO,FIXME,FORK标识代码,vscode下载TODO Highlight

```javascript
// TODO: 如果代码中有该标识,说明有功能待编写或者去除
// FIXME: 如果代码中有该标识,说明代码有bug或者需要优化
// FORK: 如果代码中有该标识,说明是修改的第三方库源码
```









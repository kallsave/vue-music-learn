## html书写规范
- class使用-分割单词
- 减少html中的class,一个dom尽量只有一个class
- 一行代码的长度不得超过编辑器的长度,子元素尽量都换行
- ref > v-if = v-show > class >  for = key > : > @

## JS代码书写规范
- 遵循eslint代码规范
- 常量需要使用const大写申明,单词区分用下滑线标识
- 内部函数用_开头
- components > mixins > provide > inject >  props > data > created > mounted > computed > watch > methods > updated
- mounted中避免使用this.$nextTick,这种场景用于确保父组件中所有的子组件的dom都挂载完毕。其它场景慎用
- 动作命名:
  can 判断是否可执行某个动作

  has 判断是否有某个值

  is 判断是否为某个值

  get 获取某个值

  set 设置某个值

  load 加载某些数据

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

- 关于keep-alive
  列表页 => 详情页最经典的方式是列表页keep-alive,详情页不做keep-alive处理

  通过keep-alive的exclude="no-keep-alive" 给详情页的组件加上name:"no-keep-alive"

  详情页操作反馈到列表页的数据改变通过vuex来操作

## 图标
- 图标使用svgtofont来管理,具体的配置看build/svgtofont

## 关于better-scroll
- 本项目大量使用了[better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#preventdefaultexception)

- 使用了better-scroll的preventDefaultException规则,阻止浏览器的原生行为

  特别是ios上fixed元素在滚动时消失,meta设置禁止缩小放大失效还有一系列原生浏览器带来的bug

  同时也阻止了一些其他默认事件,需要做exception处理

  better-scroll的preventDefaultException主要是在冒泡阶段阻止,所以对不需要进行阻止原生行为的元素的最小子代元元素添加class

  本项目设置preventDefaultException的class为better-scroll,具体在vi-scroll组件中

## 其他
- 使用TODO和FIXME标识代码

```javascript
  // TODO: 如果代码中有该标识,说明有功能待编写或者去除
  // FIXME: 如果代码中有该标识,说明代码有bug或者需要优化
```








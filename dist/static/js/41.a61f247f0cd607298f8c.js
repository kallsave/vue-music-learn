webpackJsonp([41],{"E+1l":function(t,n){t.exports={"list-animation":"list-animation-Z9aGE_0","list-load":"list-load-2y3Bm_0"}},"H/2v":function(t,n,e){"use strict";function i(){return"#"+(t=0,n=16777215,Math.random()*(n-t+1)+t|0).toString(16);var t,n}Object.defineProperty(n,"__esModule",{value:!0});var s={data:function(){return{list:[0,1,2,3,4,5,6,7,8]}},mounted:function(){this.$global.toast.show({title:"加载中..."}),console.log(this.$style)},methods:{setStyle:function(t){return{background:i(),animation:this.$style["list-load"]+" "+(200*t+400)+"ms"}},animationend:function(){},goRecommend:function(){this.$router.push({name:"IndexRecommend"})}}},o={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{class:t.$style["list-animation"]},[e("div",{staticClass:"list"},t._l(t.list,function(n,i){return e("div",{key:i,staticClass:"item",style:t.setStyle(i),on:{animationend:t.animationend,click:t.goRecommend}})}),0)])},staticRenderFns:[]};var a=e("VU/8")(s,o,!1,function(t){this.$style=e("E+1l")},null,null);n.default=a.exports}});
//# sourceMappingURL=41.a61f247f0cd607298f8c.js.map
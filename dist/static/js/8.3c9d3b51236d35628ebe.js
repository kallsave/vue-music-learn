webpackJsonp([8],{D0t9:function(t,n){t.exports={component:"component-3NX0p_0"}},FG14:function(t,n){t.exports={b:"b-37D-C_0"}},PpZu:function(t,n){t.exports={a:"a-1CF4R_0"}},VFVj:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s={name:"a-component",props:{a:{type:String,default:""}},data:function(){return{count:0}},methods:{add:function(){this.count++}}},o={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{class:t.$style.a},[e("div",[t._v("我是a组件")]),t._v(" "),e("div",[t._v(t._s(t.a))]),t._v(" "),e("div",[t._v(t._s(t.count))]),t._v(" "),e("div",{staticStyle:{"font-size":"30px"},on:{click:t.add}},[t._v("+")])])},staticRenderFns:[]};var i=e("VU/8")(s,o,!1,function(t){this.$style=e("PpZu")},null,null).exports,c={name:"b-component",props:{b:{type:String,default:""}},data:function(){return{count:0}},methods:{add:function(){this.count++}}},r={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{class:t.$style.b},[e("div",[t._v("我是b组件")]),t._v(" "),e("div",[t._v(t._s(t.b))]),t._v(" "),e("div",[t._v(t._s(t.count))]),t._v(" "),e("div",{staticStyle:{"font-size":"30px"},on:{click:t.add}},[t._v("+")])])},staticRenderFns:[]};var a=e("VU/8")(c,r,!1,function(t){this.$style=e("FG14")},null,null).exports,u={data:function(){return{currentComponent:i,isShowA:!0}},mounted:function(){},methods:{toggle:function(){this.isShowA=!this.isShowA,this.isShowA?this.currentComponent=i:this.currentComponent=a}}},l={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{class:this.$style.component},[n("div",{staticClass:"title"},[this._v("666")]),this._v(" "),n("keep-alive",{attrs:{include:["a-component","b-component"]}},[n(this.currentComponent,{tag:"component",attrs:{a:"a",b:"b"}})],1),this._v(" "),n("div",{staticClass:"toggle",on:{click:this.toggle}})],1)},staticRenderFns:[]};var d=e("VU/8")(u,l,!1,function(t){this.$style=e("D0t9")},null,null);n.default=d.exports}});
//# sourceMappingURL=8.3c9d3b51236d35628ebe.js.map
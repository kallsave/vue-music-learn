webpackJsonp([10],{"/vvJ":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={inject:["viInject"],data:function(){return{list:this.viInject}},created:function(){console.log("this.viInject",this.viInject)}},s={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"test"},t._l(t.list,function(e,i){return n("div",{key:i},[t._v(t._s(e.name))])}),0)},staticRenderFns:[]};var c={components:{Test:n("VU/8")(i,s,!1,function(t){n("YqP7")},null,null).exports},data:function(){return{list:[{name:"vue"}]}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"inject"},[e("vi-inject",{attrs:{"vi-inject":this.list}},[e("test")],1)],1)},staticRenderFns:[]};var a=n("VU/8")(c,r,!1,function(t){n("I94a")},null,null);e.default=a.exports},I94a:function(t,e){},YqP7:function(t,e){}});
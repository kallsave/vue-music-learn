webpackJsonp([23],{BPGh:function(e,t){e.exports={"sticky-view-container":"sticky-view-container-2p6kN_0"}},Xn9h:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=["😀 😁 😂 🤣 😃 😄 ","🙂 🤗 🤩 🤔 🤨 😐 ","👆🏻 scroll up/down 👇🏻 ","😔 😕 🙃 🤑 😲 ☹️ ","🐣 🐣 🐣 🐣 🐣 🐣 ","👆🏻 scroll up/down 👇🏻 ","🐥 🐥 🐥 🐥 🐥 🐥 ","🤓 🤓 🤓 🤓 🤓 🤓 ","👆🏻 scroll up/down 👇🏻 ","🦔 🦔 🦔 🦔 🦔 🦔 ","🙈 🙈 🙈 🙈 🙈 🙈 ","👆🏻 scroll up/down 👇🏻 ","🚖 🚖 🚖 🚖 🚖 🚖 ","✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 "],c={data:function(){return{items1:[],items2:[],items3:s.concat(),items4:s.concat(),first:!0}},created:function(){this.items1=s.concat(),this.items2=s.concat()},methods:{imgLoad:function(){this.$refs.sticky&&this.$refs.sticky.calculateAllStickyEleTop()},stickyChange:function(e){},clickHandle:function(){console.log(66)}}},l={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{class:e.$style["sticky-view-container"]},[i("div",{staticClass:"scroll-wrapper"},[i("vi-sticky",{ref:"sticky",attrs:{"z-index":50,"sticky-data":[e.items1,e.items2]},on:{change:e.stickyChange}},[i("img",{attrs:{src:"https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/6.jpg"},on:{load:e.imgLoad}}),e._v(" "),e.first?i("vi-sticky-ele",{attrs:{"merge-ele-key":"1"}},[i("div",{staticClass:"title1"},[e._v("256")])]):e._e(),e._v(" "),i("ul",e._l(e.items2,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("vi-sticky-ele",{attrs:{"merge-ele-key":"1"}},[i("div",{staticClass:"title2 needsclick",on:{click:e.clickHandle}},[e._v("999")])]),e._v(" "),i("ul",e._l(e.items4,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("vi-sticky-ele",{attrs:{"merge-ele-key":"3"}},[i("div",{staticClass:"title2 needsclick",on:{click:e.clickHandle}},[e._v("3669")])]),e._v(" "),i("ul",e._l(e.items3,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("ul",e._l(e.items4,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("ul",e._l(e.items4,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("vi-sticky-ele",{attrs:{"merge-ele-key":"4"}},[i("div",{staticClass:"title2 needsclick",on:{click:e.clickHandle}},[e._v("4")])]),e._v(" "),i("ul",e._l(e.items4,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0),e._v(" "),i("vi-sticky-ele",{attrs:{"merge-ele-key":"5"}},[i("div",{staticClass:"title2 needsclick",on:{click:e.clickHandle}},[e._v("5")])]),e._v(" "),i("ul",e._l(e.items4,function(t,s){return i("li",{key:s},[e._v(e._s(t))])}),0)],1)],1)])},staticRenderFns:[]};var n=i("VU/8")(c,l,!1,function(e){this.$style=i("BPGh")},null,null);t.default=n.exports}});
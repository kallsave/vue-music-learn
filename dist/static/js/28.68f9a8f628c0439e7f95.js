webpackJsonp([28],{"+r2p":function(t,e){t.exports={"action-sheet":"action-sheet-1UKg8_0"}},vCWP:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={data:function(){return{isShowActionSheet:!1,list:[{content:"分享到朋友圈",style:{color:"red"}},{content:"分享给朋友",style:{}}]}},mounted:function(){this.sheet=this.$createViActionSheet({data:this.list,touchColor:"gold",onSelect:function(t,e){console.log(t)},onCancel:function(){}})},methods:{show:function(){this.sheet.show()},select:function(t){console.log(t),this.sheet.hide()}}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{class:this.$style["action-sheet"]},[e("div",{staticClass:"show-action-sheet",on:{click:this.show}})])},staticRenderFns:[]};var i=n("VU/8")(s,o,!1,function(t){this.$style=n("+r2p")},null,null);e.default=i.exports}});
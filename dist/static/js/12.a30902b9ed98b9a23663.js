webpackJsonp([12],{OGM0:function(i,t){i.exports={popup:"popup-1qeGy_0"}},qqAJ:function(i,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e={data:function(){return{isVisible:!1,transitionDuration:{enter:500,leave:500}}},methods:{show:function(){console.log(6),this.isVisible=!0},close:function(){this.isVisible=!1},maskClick:function(){}}},n={render:function(){var i=this,t=i.$createElement,e=i._self._c||t;return e("div",{class:i.$style.popup},[e("div",{staticStyle:{width:"50px",height:"50px",background:"red"},on:{click:i.show}}),i._v(" "),e("transition",{attrs:{name:"dialog-fade",duration:i.transitionDuration}},[e("vi-popup",{directives:[{name:"show",rawName:"v-show",value:i.isVisible,expression:"isVisible"}],ref:"popup",on:{"mask-click":i.maskClick}},[e("div",{staticClass:"popup-content"},[e("img",{staticClass:"image",attrs:{src:s("rJTd")}}),i._v(" "),e("div",{staticClass:"close",on:{click:i.close}})])])],1)],1)},staticRenderFns:[]};var o=s("VU/8")(e,n,!1,function(i){this.$style=s("OGM0")},null,null);t.default=o.exports},rJTd:function(i,t,s){i.exports=s.p+"static/img/dialog.06186f7.jpg"}});
webpackJsonp([37],{UgFW:function(t,e){t.exports={abstract:"abstract-3THa1_0"}},uqQR:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n("BuZz"),r={components:{ThrottleButton:{name:"throttle-button",abstract:!0,props:{throttleTime:{type:Number,default:2e3}},data:function(){return{}},render:function(){var t=this;this._throttle=new o.b(this.throttleTime);var e=this.$slots.default[0];if(e&&e.data&&e.data.on&&e.data.on.click){var n=e.data.on.click;"function"==typeof n&&(e.data.on.click=function(){t._throttle.run(function(){n()})})}return e},beforeDestroy:function(){this._throttle.destroy()}}},methods:{clickHandler:function(){console.log(66)}}},s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{class:this.$style.abstract},[e("div",[this._v("abstract")]),this._v(" "),e("throttle-button",[e("div",{on:{click:this.clickHandler}},[this._v("sss")])])],1)},staticRenderFns:[]};var a=n("VU/8")(r,s,!1,function(t){this.$style=n("UgFW")},null,null);e.default=a.exports}});
webpackJsonp([42],{"OF/o":function(t,n){t.exports={slow:"slow-2sydo_0"}},lftW:function(t,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=i("Zrlr"),o=i.n(e),s=i("wxAW"),r=i.n(s),a=void 0,u=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(function(){var n=(new Date).getTime();a||(a=n),t(n-a)},100/6)},f=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||function(t){return window.clearTimeout(t)},c=i("BuZz");function d(t){return 1- --t*t*t*t}var l=function(){function t(n,i){o()(this,t),this.init(n,i)}return r()(t,[{key:"init",value:function(t,n){this.target=t,this.offset=Object(c.e)({},n.offset),this.duration=n.duration,this.easing=n.easing,this.done=n.done,this.run()}},{key:"run",value:function(){var t=this;for(var n in this.offset){var i=this.offset[n];this.offset[n]={begin:0,count:i}}this.requestAnimationFrameId=u(function(n){t.timeStart=n,t.isRunning=!0,t.loop(n)})}},{key:"loop",value:function(t){this.isRunning&&(this.update(t),this.timeCurrent<this.duration?this.continueHandler():this.doneHandler())}},{key:"continueHandler",value:function(){var t=this;this.transform(),this.requestAnimationFrameId=u(function(n){t.loop(n)})}},{key:"doneHandler",value:function(){this.timeCurrent=this.duration,this.transform(),"function"==typeof this.done&&this.done()}},{key:"update",value:function(t){this.timeCurrent=t-this.timeStart}},{key:"transform",value:function(){var t="";for(var n in this.offset){this.timeCurrent;var i=this.offset[n].begin,e=this.offset[n].count;this.duration;if(this.timeCurrent<this.duration)t+=n+"("+(e-i)*(this.timeCurrent/this.duration)+"px) ";else t+=n+"("+e+"px) "}this.target.style.transform=t}},{key:"stop",value:function(){f(this.requestAnimationFrameId)}}]),t}(),h=function(t,n){var i={offset:{},duration:1e3,easing:d,done:function(){}};return new l(t,Object(c.e)({},i,n))},m={data:function(){return{list:[0,1]}},methods:{clickHandler:function(t){if(!this.hadClick)return this.hadClick=!this.hadClick,void(this.move||(this.move=h(t.target,{duration:4e3,offset:{translateY:200,translateX:200},done:function(){console.log("done")}})));this.move.stop()}}},w={render:function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("div",{class:t.$style.slow},t._l(t.list,function(n,e){return i("div",{key:e,staticClass:"box",on:{click:t.clickHandler}})}),0)},staticRenderFns:[]};var v=i("VU/8")(m,w,!1,function(t){this.$style=i("OF/o")},null,null);n.default=v.exports}});
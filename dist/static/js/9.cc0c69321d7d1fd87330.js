webpackJsonp([9,41],{CF5e:function(t,s){t.exports={"list-animation":"list-animation-Z9aGE_0","list-load":"list-load-2y3Bm_0"}},"H/2v":function(t,s,e){"use strict";function i(){return"#"+(t=0,s=16777215,Math.random()*(s-t+1)+t|0).toString(16);var t,s}Object.defineProperty(s,"__esModule",{value:!0});var n={data:function(){return{list:[0,1,2,3,4,5,6,7,8]}},mounted:function(){this.$global.toast.show({title:"加载中..."}),console.log(this.$style)},methods:{setStyle:function(t){return{background:i(),animation:this.$style["list-load"]+" "+(200*t+400)+"ms"}},animationend:function(){},goRecommend:function(){this.$router.push({name:"IndexRecommend"})}}},a={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{class:t.$style["list-animation"]},[e("div",{staticClass:"list"},t._l(t.list,function(s,i){return e("div",{key:i,staticClass:"item",style:t.setStyle(i),on:{animationend:t.animationend,click:t.goRecommend}})}),0)])},staticRenderFns:[]};var l=e("VU/8")(n,a,!1,function(t){this.$style=e("CF5e")},null,null);s.default=l.exports},NJ94:function(t,s){t.exports={"keep-alive-list":"keep-alive-list-155X7_0","list-load":"list-load-21RTg_0"}},Odu5:function(t,s,e){"use strict";function i(){return"#"+(t=0,s=16777215,Math.random()*(s-t+1)+t|0).toString(16);var t,s}Object.defineProperty(s,"__esModule",{value:!0});var n={components:{ListAnimation:e("H/2v").default},data:function(){return{num:1,person:{name:"ss",cityList:[]},list:[{id:0,status:0,value:0},{id:1,status:0,value:1},{id:2,status:0,value:2},{id:3,status:0,value:3},{id:4,status:0,value:4},{id:5,status:0,value:5},{id:6,status:0,value:6},{id:7,status:0,value:7},{id:8,status:0,value:8}]}},watch:{num:{handler:function(t){console.log(t)},deep:!0},"person.cityList":{handler:function(t){console.log(t)}},person:{handler:function(t){console.log("watch")},deep:!0}},methods:{parseStatus:function(){},setStyle:function(t,s){var e=i();return t.background=e,{background:e,animation:this.$style["list-load"]+" "+(200*s+400)+"ms"}},clickHandler:function(){this.person.cityList.push("深圳")}}},a={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{class:t.$style["keep-alive-list"]},[e("div",{staticClass:"list"},t._l(t.list,function(s,i){return e("div",{key:s.id,staticClass:"item",style:t.setStyle(s,i),on:{click:t.clickHandler}},[e("div",{staticClass:"content"},[t._v(t._s(s.value))]),t._v(" "),t._m(0,!0)])}),0)])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"btn-list"},[s("div",{staticClass:"pay"},[this._v("支付")]),this._v(" "),s("div",{staticClass:"cancel"},[this._v("取消")]),this._v(" "),s("div",{staticClass:"delete"},[this._v("删除")]),this._v(" "),s("div",{staticClass:"value"},[this._v("改值")])])}]};var l=e("VU/8")(n,a,!1,function(t){this.$style=e("NJ94")},null,null);s.default=l.exports}});
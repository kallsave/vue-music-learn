webpackJsonp([3],{BRgg:function(t,e,n){"use strict";e.b=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object(i.d)({},a.d,{uin:"0",format:"json",platform:"h5",needNewCode:"1"},t);return Object(a.c)(function(){return l({method:"get",url:"v8/fcg-bin/fcg_myqq_toplist.fcg",params:e}).then(function(t){return r.a.resolve(t.data)})})},e.a=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object(i.d)({},a.d,{needNewCode:1,uin:0,tpl:3,page:"detail",type:"top",platform:"h5"},t);return Object(a.c)(function(){return Object(a.e)({url:"https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",data:e})})};var s=n("//Fk"),r=n.n(s),a=n("T452"),i=n("BuZz"),o=n("mtWM"),l=n.n(o).a.create({baseURL:"https://c.y.qq.com",validateStatus:function(t){return!0}});l.interceptors.response.use(function(t){return 200!==t.status&&"200"!==t.status||t.data.code!==a.b?(console.log(t),r.a.reject(a.a)):r.a.resolve(t)})},LJ3K:function(t,e){t.exports={rank:"rank-1QOx5_0"}},q9Cf:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n("Dd8w"),r=n.n(s),a=n("BRgg"),i=n("hAM6"),o=n("NYxO"),l=n("9n/1"),c=n("1VIM"),u={mixins:[l.a,i.a,c.a],data:function(){return{rankList:[],scrollOptions:{probeType:3,click:!0,directionLockThreshold:0}}},mounted:function(){this._getTopList()},methods:r()({},Object(o.d)({setRankAlbum:"SET_RANK_ALBUM"}),{handlePlayList:function(){this.$refs.scrollWrapper.style.paddingBottom=this.playerHeight+"px",this.$refs.scroll.refresh()},_getTopList:function(){var t=this;this.$global.toast.show({icon:"loading",titleColor:"#ffcd32",iconColor:"#ffcd32",scalc:.8}),Object(a.b)().then(function(e){t.rankList=e.data.topList,t.$global.toast.hide()})},selectItem:function(t,e){var n=this;this.throttle.run(function(){n.setRankAlbum(e),n.$router.push({name:"DetailRank",params:{id:e.id}})})}})},d={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"rank",class:t.$style.rank},[n("div",{ref:"scrollWrapper",staticClass:"scroll-wrapper"},[n("vi-scroll",{ref:"scroll",attrs:{"scroll-events":["scroll"],options:t.scrollOptions,data:[t.rankList]},on:{scroll:t.scrollHandler}},[n("ul",{staticClass:"rank-list"},t._l(t.rankList,function(e,s){return n("li",{key:s,staticClass:"item",on:{click:function(n){t.selectItem(n,e)}}},[n("div",{staticClass:"icon"},[n("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}],attrs:{width:"100",height:"100"}})]),t._v(" "),n("ul",{staticClass:"song-name-list"},t._l(e.songList,function(e,s){return n("li",{key:s,staticClass:"song-name"},[n("span",[t._v(t._s(s+1))]),t._v(" "),n("span",[t._v(t._s(e.songname)+"-"+t._s(e.singername))])])}),0)])}),0)])],1)])},staticRenderFns:[]};var f=n("VU/8")(u,d,!1,function(t){this.$style=n("LJ3K")},null,null);e.default=f.exports}});
//# sourceMappingURL=Rank.1b6356d5fa12f6bdb6cf.js.map
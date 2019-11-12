webpackJsonp([0],{"+wyn":function(t,e,s){"use strict";var n=s("Dd8w"),i=s.n(n),a="select",c={props:{songList:{type:Array,default:function(){return[]}},rank:{type:Boolean,default:!1}},methods:{selectItem:function(t,e,s){this.$emit.apply(this,[a].concat(Array.prototype.slice.call(arguments)))},getDesc:function(t){return t.singer+"·"+t.album},getRankCls:function(t){return t<=2?"icon icon"+t:"text"},getRankText:function(t){if(t>2)return t+1}}},r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:t.$style["song-list"]},[s("ul",t._l(t.songList,function(e,n){return s("li",{key:n,staticClass:"song-list-item",on:{click:function(s){t.selectItem(s,e,n)}}},[s("div",{directives:[{name:"show",rawName:"v-show",value:t.rank,expression:"rank"}],staticClass:"song-list-rank"},[s("span",{class:t.getRankCls(n),domProps:{textContent:t._s(t.getRankText(n))}})]),t._v(" "),s("div",{staticClass:"song-list-content"},[s("h2",{staticClass:"song-list-name"},[t._v(t._s(e.name))]),t._v(" "),s("p",{staticClass:"song-list-desc"},[t._v(t._s(t.getDesc(e)))])])])}),0)])},staticRenderFns:[]};var l=s("VU/8")(c,r,!1,function(t){this.$style=s("SVxE")},null,null).exports,o=s("hAM6"),u=s("t7U9"),d=s("NYxO"),f=s("1VIM"),h=Object(u.c)("transform"),g=Object(u.c)("backdrop-filter"),p={components:{SongList:l},mixins:[o.a,f.a],props:{title:{type:String,default:""},bgImage:{type:String,default:""},songList:{type:Array,default:function(){return[]}},isFetchSongList:{type:Boolean,default:!1},rank:{type:Boolean,default:!1}},data:function(){return{scrollOptions:{probeType:3,click:!0},scrollY:0}},computed:i()({},Object(d.c)(["fullScreen"]),{bgStyle:function(){return"background-image:url("+this.bgImage+")"}}),watch:{scrollY:{handler:function(t){var e=Math.abs(t/this.imageHeight),s=1,n=0,i=0;t>0?s=1+e:(n=Math.min(10,10*e),i=Math.max(0,e-.2)),this.$refs.bgImage.style[h]="scale("+s+")",this.$refs.title.style.opacity=i,this.$refs.filter.style[g]="blur("+n+"px)"}},isFetchSongList:{handler:function(t){this.$refs.scroll.refresh()}}},created:function(){this.imageHeight=.7*document.body.clientWidth},mounted:function(){this.$refs.scrollBlank.style.height=this.imageHeight-40+"px"},methods:i()({},Object(d.d)({setRouterTransition:"SET_ROUTER_TRANSITION"}),Object(d.b)(["selectPlay","randomPlay"]),{handlePlayList:function(){this.$refs.stickyWrapper.style.paddingBottom="60px",this.$refs.scroll.refresh()},back:function(){this.$router.back()},scrollHandler:function(t){var e=t.y;this.scrollY=e,this.$refs.sticky.listenScrollY(-e)},stickyChange:function(t){this.$refs.bgImage.style.paddingTop=t.clientHeight+40+"px",this.$refs.bgImage.style.zIndex=5},stickyCancel:function(){this.$refs.bgImage.style.paddingTop="70%",this.$refs.bgImage.style.zIndex=0},selectItem:function(t,e,s){var n=this;this.throttle.run(function(){n.selectPlay({list:n.songList,index:s})})},random:function(t){this.$router.push("/test/scroll-popup/1")}})},y={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:t.$style.music},[s("div",{staticClass:"header"},[s("div",{staticClass:"back",on:{touchstart:t.back}},[s("i",{staticClass:"icon-back"})]),t._v(" "),s("h1",{ref:"title",staticClass:"title"},[t._v(t._s(t.title))])]),t._v(" "),s("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[s("div",{ref:"filter",staticClass:"filter"})]),t._v(" "),s("div",{ref:"stickyWrapper",staticClass:"sticky-wrapper"},[s("vi-native-sticky",{ref:"sticky",on:{"sticky-change":t.stickyChange,"sticky-cancel":t.stickyCancel}},[s("vi-scroll",{ref:"scroll",attrs:{data:[t.songList],options:t.scrollOptions,scrollEvents:["scroll"]},on:{scroll:t.scrollHandler}},[s("div",{ref:"scrollBlank",staticClass:"scroll-blank"},[t.isFetchSongList?s("vi-native-sticky-ele",[s("div",{staticClass:"play-wrapper"},[s("div",{ref:"playBtn",staticClass:"play",on:{click:function(e){t.random(e)}}},[s("i",{staticClass:"icon-play"}),t._v(" "),s("span",{staticClass:"text"},[t._v("随机播放全部")])])])]):t._e()],1),t._v(" "),s("div",{staticClass:"song-list-wrapper"},[s("song-list",{attrs:{rank:t.rank,"song-list":t.songList},on:{select:t.selectItem}})],1)])],1)],1)])},staticRenderFns:[]};var m=s("VU/8")(p,y,!1,function(t){this.$style=s("oZUM")},null,null);e.a=m.exports},"9n/1":function(t,e,s){"use strict";e.b=i,s.d(e,"a",function(){return a});var n=44;function i(t){var e=this.ViScroll;t.y<-n?e.$disY!==-n&&(e.$disY=-n,e.scroll.refresh(),e.scroll.scrollTo(0,-n,0),e.scroll.disable()):t.y>=0&&e.$disY!==n&&(e.$disY=n,e.scroll.enable(),e.scroll.scrollTo(0,0,0))}var a={inject:["ViScroll"],methods:{scrollHandler:i}}},MdVR:function(t,e,s){"use strict";var n=s("Zrlr"),i=s.n(n);e.a=function t(e){var s=e.id,n=e.name;i()(this,t),this.id=s,this.name=n,this.avatar="https://y.gtimg.cn/music/photo_new/T001R300x300M000"+s+".jpg?max_age=2592000"}},SVxE:function(t,e){t.exports={"song-list":"song-list-cdjwD_0"}},hAM6:function(t,e,s){"use strict";var n=s("Dd8w"),i=s.n(n),a=s("NYxO"),c=(s("J9wY"),{data:function(){return{playerHeight:"60"}},computed:i()({},Object(a.c)(["playList","routerTransitionState"])),mounted:function(){this.playList.length&&this.handlePlayList()},activated:function(){var t=this;this.playList.length&&window.setTimeout(function(){t.handlePlayList()},350)},methods:{handlePlayList:function(){throw new Error("component must implement handlePlayList method")}}});e.a=c},m40h:function(t,e,s){"use strict";e.b=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object(c.d)({},a.d,{platform:"h5",vin:0,needNewCode:1},t);return Object(a.c)(function(){return Object(a.e)({url:"https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",data:e})})},e.a=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e={platform:"yqq",hostUin:0,sin:0,ein:29,sortId:5,needNewCode:0,categoryId:1e7,rnd:Math.random(),format:"json"},s=Object(c.d)({},a.d,e,t);return Object(a.c)(function(){return l({method:"get",url:"splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",params:s}).then(function(t){return i.a.resolve(t.data)})})},e.c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object(c.d)({},a.d,{type:1,json:1,utf8:1,onlysong:0,platform:"yqq",hostUin:0,needNewCode:0},t);return Object(a.c)(function(){return l({method:"get",url:"qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",params:e}).then(function(t){return i.a.resolve(t.data)})})};var n=s("//Fk"),i=s.n(n),a=s("T452"),c=s("BuZz"),r=s("mtWM"),l=s.n(r).a.create({baseURL:"https://c.y.qq.com",validateStatus:function(t){return!0}});l.interceptors.response.use(function(t,e,s){return-1!==t.request.responseURL.indexOf("qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg")&&(t.data=t.data.replace(/^\w+\((.*)\)$/g,"$1"),t.data=JSON.parse(t.data)),200===t.status&&t.data.code===a.b?i.a.resolve(t):i.a.reject(a.a)})},oZUM:function(t,e){t.exports={music:"music-2TvtQ_0"}}});
//# sourceMappingURL=vendor-async.9ee1a23f0b6ffefafb96.js.map
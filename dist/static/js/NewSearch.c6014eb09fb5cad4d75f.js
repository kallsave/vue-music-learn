webpackJsonp([5],{"8stH":function(e,t,s){"use strict";t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object(n.e)({},a.d,{uin:0,needNewCode:1,platform:"h5"},e);return Object(a.c)(function(){return Object(a.e)({url:"https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg",data:t})})},t.b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object(n.e)({},a.d,{g_tk:5381,uin:0,format:"json",notice:0,platform:"h5",needNewCode:1,zhidaqu:1,t:0,flag:1,ie:"utf-8",sem:1,aggr:0,remoteplace:"txt.mqq.all"},e);return Object(a.c)(function(){return o({method:"get",url:"soso/fcgi-bin/search_for_qq_cp",params:t}).then(function(e){return i.a.resolve(e.data)})})};var r=s("//Fk"),i=s.n(r),a=s("T452"),n=s("BuZz"),c=s("mtWM"),o=s.n(c).a.create({baseURL:"https://c.y.qq.com",validateStatus:function(e){return!0}});o.interceptors.response.use(function(e){return-1!==e.request.responseURL.indexOf("qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg")&&(e.data=e.data.replace(/^\w+\((.*)\)$/g,"$1"),e.data=JSON.parse(e.data)),200===e.status&&e.data.code===a.b?i.a.resolve(e):(console.log(e),i.a.reject(a.a))})},ALKb:function(e,t){e.exports={"search-list":"search-list-2kfh4_0"}},"F6/U":function(e,t){e.exports={"search-box-wrapper":"search-box-wrapper-1dRJ0_0","hot-key-title":"hot-key-title-3C2Op_0",search:"search-3CP_0_0","search-scroll-wrapper":"search-scroll-wrapper-1Mezd_0","shortcut-wrapper":"shortcut-wrapper-2-o2f_0","hot-key":"hot-key-3qVZS_0","hot-key-list":"hot-key-list-2S7iy_0",item:"item-3d7KJ_0","search-history":"search-history-3zn3k_0","search-history-title":"search-history-title-12tGQ_0","search-history-text":"search-history-text-3DtVd_0","clear-search-history":"clear-search-history-2QbM9_0","icon-clear":"icon-clear-3_Qxk_0","result-scroll-wrapper":"result-scroll-wrapper-XKugW_0","suggest-list":"suggest-list-D63e6_0","suggest-item":"suggest-item-v-Bxk_0",icon:"icon-cqquy_0",name:"name-Qga5T_0",text:"text-2Eiby_0","no-result-wrapper":"no-result-wrapper-33hcH_0"}},ar59:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=s("//Fk"),i=s.n(r),a=s("Dd8w"),n=s.n(a),c=s("8stH"),o=s("50ZC"),l=(s("BuZz"),s("hAM6")),h=s("MdVR"),u=s("NYxO"),d=s("tv0T"),p=s("qiwx"),f=s("1VIM"),y=s("vXfL"),g={components:{NoResult:d.a,SearchList:p.a},mixins:[l.a,f.a,y.a],data:function(){return{hotKey:[],page:1,query:"",result:[],isShowSinger:!0,scrollOptions:{probeType:3,click:!0,pullUpLoad:{threshold:0,txt:{more:"下拉加载",noMore:"没有更多的结果啦"},size:14},directionLockThreshold:0},isFetchSearch:!1}},computed:n()({},Object(u.c)(["searchHistoryList"])),watch:{query:{handler:function(e){var t=this;this.isFetchSearch=!1,e.trim()?this.debounce.run(function(){t.searchHistoryAdd(e),t.page=1,t.$refs.scroll.scroll.scrollTo(0,0,0),t.search().then(function(e){t.isFetchSearch=!0,t.result=t._genResult(e.data)})}):this.result=[]}}},mounted:function(){this._getHotKey()},methods:n()({},Object(u.d)({setSinger:"SET_SINGER"}),Object(u.b)(["insertSong","searchHistoryAdd","searchHistoryDelete","searchHistoryClear"]),{handlePlayList:function(){this.$refs.scrollWrapper.style.paddingBottom=this.playerHeight+"px",this.$refs.scroll.refresh()},_getHotKey:function(){var e=this;Object(c.a)().then(function(t){e.hotKey=t.data.hotkey.slice(0,10)})},search:function(e){var t=this;return new i.a(function(e,s){Object(c.b)({w:t.query,p:t.page,catZhida:t.isShowSinger?1:0,n:20,perpage:20}).then(function(s){t._checkMore(s.data),e(s)})})},_checkMore:function(e){var t=e.song;!t.list.length||t.curnum+20*t.curpage>t.totalnum?this.hasMore=!1:this.hasMore=!0},_genResult:function(e){var t=[];return e.zhida&&e.zhida.singerid&&t.push(n()({},e.zhida,{type:"singer"})),e.song&&(t=t.concat(this._normalizeSongs(e.song.list))),t},_normalizeSongs:function(e){var t=[];return e.forEach(function(e){e.songid&&e.albummid&&e.songmid&&(e.strMediaMid=e.songmid,t.push(Object(o.b)(e)))}),t},getIconClass:function(e){return"singer"===e.type?"icon-mine":"icon-music"},getDisplayName:function(e){return"singer"===e.type?e.singername:e.name+"-"+e.singer},clearHandler:function(){this.query=""},hotSearch:function(e){this.query=e.k},pullingUpHandler:function(){var e=this;this.hasMore&&(this.page++,this.search().then(function(t){e.result=e.result.concat(e._genResult(t.data))}))},focusHandler:function(){this.isFetchSearch=!1},selectItem:function(e){var t=this;this.throttle.run(function(){if("singer"===e.type){var s=new h.a({id:e.singermid,name:e.singername});t.setSinger(s),t.$router.push({name:"DetailSinger",params:{id:s.id}})}else t.insertSong(e)})},clearSearchHistoryHandler:function(){var e=this;this.$createBaseConfirm({text:"确定要删除吗",onConfirm:function(){e.searchHistoryClear()}}).show()},addQuery:function(e){var t=this;this.throttle.run(function(){t.query=e})},searchHistoryDeleteHistory:function(e){var t=this;this.throttle.run(function(){t.searchHistoryDelete(e)})}})},v={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"search",class:e.$style.search},[s("div",{ref:"scrollWrapper",staticClass:"search-scroll-wrapper"},[s("vi-sticky",{ref:"scroll",staticStyle:{color:"rgba(255, 255, 255, 0.5)"},attrs:{data:e.result,options:e.scrollOptions,"scroll-events":["scroll"]},on:{"pulling-up":e.pullingUpHandler}},[s("vi-sticky-ele",[s("div",{staticClass:"search-box-wrapper"},[s("base-search-box",{ref:"searchBox",attrs:{placeholder:"搜索歌曲、歌手"},on:{clear:e.clearHandler,focus:e.focusHandler},model:{value:e.query,callback:function(t){e.query=t},expression:"query"}})],1)]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!e.query,expression:"!query"}],staticClass:"shortcut-wrapper"},[s("div",{staticClass:"hot-key"},[s("h1",{staticClass:"hot-key-title"},[e._v("热门搜索")]),e._v(" "),s("ul",{staticClass:"hot-key-list"},e._l(e.hotKey,function(t,r){return s("li",{key:r,staticClass:"item",on:{click:function(s){e.hotSearch(t)}}},[s("span",[e._v(e._s(t.k))])])}),0)]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.searchHistoryList.length,expression:"searchHistoryList.length"}],staticClass:"search-history"},[s("h1",{staticClass:"search-history-title"},[s("span",{staticClass:"search-history-text"},[e._v("搜索历史")]),e._v(" "),s("span",{staticClass:"clear-search-history",on:{touchstart:e.clearSearchHistoryHandler}},[s("i",{staticClass:"icon-clear"})])]),e._v(" "),s("search-list",{attrs:{searches:e.searchHistoryList},on:{delete:e.searchHistoryDeleteHistory,select:e.addQuery}})],1)]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.query,expression:"query"}],staticClass:"result-scroll-wrapper"},[s("ul",{staticClass:"suggest-list"},e._l(e.result,function(t,r){return s("li",{key:r,staticClass:"suggest-item",on:{click:function(s){e.selectItem(t)}}},[s("div",{staticClass:"icon"},[s("i",{class:e.getIconClass(t)})]),e._v(" "),s("div",{staticClass:"name"},[s("p",{staticClass:"text",domProps:{innerHTML:e._s(e.getDisplayName(t))}})])])}),0)]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.query&&!e.result.length&&e.isFetchSearch,expression:"query && !result.length && isFetchSearch"}],staticClass:"no-result-wrapper"},[s("no-result",{attrs:{title:"抱歉，暂无搜索结果"}})],1)],1)],1)])},staticRenderFns:[]};var m=s("VU/8")(g,v,!1,function(e){this.$style=s("F6/U")},null,null);t.default=m.exports},evOS:function(e,t){e.exports={"no-result":"no-result-nz2j5_0"}},qiwx:function(e,t,s){"use strict";var r={props:{searches:{type:Array,default:function(){return[]}}},methods:{selectItem:function(e){this.$emit("select",e)},deleteItem:function(e){this.$emit("delete",e)}}},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{directives:[{name:"show",rawName:"v-show",value:e.searches.length,expression:"searches.length"}],class:e.$style["search-list"]},[s("transition-group",{attrs:{name:"list",tag:"ul"}},e._l(e.searches,function(t){return s("li",{key:t,staticClass:"search-item",on:{click:function(s){e.selectItem(t)}}},[s("span",{staticClass:"text"},[e._v(e._s(t))]),e._v(" "),s("span",{staticClass:"icon",on:{click:function(s){s.stopPropagation(),e.deleteItem(t)}}},[s("i",{staticClass:"icon-delete delete"})])])}),0)],1)},staticRenderFns:[]};var a=s("VU/8")(r,i,!1,function(e){this.$style=s("ALKb")},null,null);t.a=a.exports},tv0T:function(e,t,s){"use strict";var r={props:{title:{type:String,default:""}}},i={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{class:this.$style["no-result"]},[t("div",{staticClass:"no-result-icon"}),this._v(" "),t("p",{staticClass:"no-result-text"},[this._v(this._s(this.title))])])},staticRenderFns:[]};var a=s("VU/8")(r,i,!1,function(e){this.$style=s("evOS")},null,null);t.a=a.exports},vXfL:function(e,t,s){"use strict";var r=s("BuZz");t.a={mounted:function(){this._createDebounceInstance()},methods:{_createDebounceInstance:function(){this.debounce=new r.a(400)}},beforeDestroy:function(){this.debounce.destroy()}}}});
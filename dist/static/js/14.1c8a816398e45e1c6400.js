webpackJsonp([14],{QMns:function(t,e){t.exports={"tree-folder":"tree-folder-2tSV7_0"}},WOVI:function(t,e){t.exports={tree:"tree-xYdOa_0"}},w8iQ:function(t,e,l){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=l("7+uW"),r={name:"tree-folder",props:{list:{type:Array,default:function(){return{}}}}},n={render:function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{class:t.$style["tree-folder"]},t._l(t.list,function(e,i){return l("div",{key:i,staticClass:"item"},[l("div",{staticClass:"title"},[t._v(t._s(e.title))]),t._v(" "),l("div",{staticStyle:{"margin-left":"20px"}},[e.children?l("tree-folder",{attrs:{list:e.children}}):t._e()],1)])}),0)},staticRenderFns:[]};var s=l("VU/8")(r,n,!1,function(t){this.$style=l("QMns")},null,null).exports;i.a.component(s.name,s);var c={components:{TreeFolder:s},data:function(){return{list:[{title:"1",children:[{title:"2",children:[{title:"3"},{title:"3"}]},{title:"2",children:[{title:"3"},{title:"3"}]}]},{title:"1",children:[{title:"2",children:[{title:"3"},{title:"3"}]},{title:"2",children:[{title:"3"},{title:"3"}]}]}]}}},a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{class:this.$style.tree},[e("tree-folder",{attrs:{list:this.list}})],1)},staticRenderFns:[]};var d=l("VU/8")(c,a,!1,function(t){this.$style=l("WOVI")},null,null);e.default=d.exports}});
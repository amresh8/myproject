define(["exports","./vendor-22992e2c"],(function(e,t){"use strict";const o=t.defineComponent({name:"AppTopBar",props:{resource:{type:Object,default:null}}});var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"oc-flex oc-p-s app-top-bar"},[e.resource?o("oc-resource",{attrs:{id:"app-top-bar-resource","is-thumbnail-displayed":!1,resource:e.resource}}):o("div"),e._v(" "),o("div",[e._t("right"),e._v(" "),o("oc-button",{attrs:{id:"app-top-bar-close","aria-label":e.$gettext("Close"),size:"small"},on:{click:function(t){return e.$emit("close")}}},[o("oc-icon",{attrs:{name:"close",size:"small"}})],1)],2)],1)};r._withStripped=!0;const n=t.normalizeComponent({render:r,staticRenderFns:[]},undefined,o,"data-v-5c3c8a4a",false,undefined,!1,void 0,void 0,void 0);e.__vue_component__=n}));

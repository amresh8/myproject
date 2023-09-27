(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":2}],2:[function(require,module,exports){
var core = require('../../modules/_core');
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

},{"../../modules/_core":3}],3:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":4,"timers":5}],6:[function(require,module,exports){
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance)
      instance.$forceUpdate()
      instance.$nextTick(restore)
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      // prevent record.options._Ctor from being overwritten accidentally
      newCtor.options._Ctor = record.options._Ctor
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

// 2.6 optimizes template-compiled scoped slots and skips updates if child
// only uses scoped slots. We need to patch the scoped slots resolving helper
// to temporarily mark all scoped slots as unstable in order to force child
// updates.
function patchScopedSlots (instance) {
  if (!instance._u) { return }
  // https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/resolve-scoped-slots.js
  var original = instance._u
  instance._u = function (slots) {
    try {
      // 2.6.4 ~ 2.6.6
      return original(slots, true)
    } catch (e) {
      // 2.5 / >= 2.6.7
      return original(slots, null, true)
    }
  }
  return function () {
    instance._u = original
  }
}

},{}],7:[function(require,module,exports){
(function (global,setImmediate){
/*!
 * Vue.js v2.7.10
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
/*!
 * Vue.js v2.7.10
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Vue=e()}(this,(function(){"use strict";var t=Object.freeze({}),e=Array.isArray;function n(t){return null==t}function r(t){return null!=t}function o(t){return!0===t}function i(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function a(t){return"function"==typeof t}function s(t){return null!==t&&"object"==typeof t}var c=Object.prototype.toString;function u(t){return"[object Object]"===c.call(t)}function l(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function f(t){return r(t)&&"function"==typeof t.then&&"function"==typeof t.catch}function d(t){return null==t?"":Array.isArray(t)||u(t)&&t.toString===c?JSON.stringify(t,null,2):String(t)}function p(t){var e=parseFloat(t);return isNaN(e)?t:e}function v(t,e){for(var n=Object.create(null),r=t.split(","),o=0;o<r.length;o++)n[r[o]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}var h=v("slot,component",!0),m=v("key,ref,slot,slot-scope,is");function g(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}var y=Object.prototype.hasOwnProperty;function _(t,e){return y.call(t,e)}function b(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}var $=/-(\w)/g,w=b((function(t){return t.replace($,(function(t,e){return e?e.toUpperCase():""}))})),x=b((function(t){return t.charAt(0).toUpperCase()+t.slice(1)})),C=/\B([A-Z])/g,k=b((function(t){return t.replace(C,"-$1").toLowerCase()}));var S=Function.prototype.bind?function(t,e){return t.bind(e)}:function(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n};function O(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function T(t,e){for(var n in e)t[n]=e[n];return t}function A(t){for(var e={},n=0;n<t.length;n++)t[n]&&T(e,t[n]);return e}function j(t,e,n){}var E=function(t,e,n){return!1},N=function(t){return t};function P(t,e){if(t===e)return!0;var n=s(t),r=s(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var o=Array.isArray(t),i=Array.isArray(e);if(o&&i)return t.length===e.length&&t.every((function(t,n){return P(t,e[n])}));if(t instanceof Date&&e instanceof Date)return t.getTime()===e.getTime();if(o||i)return!1;var a=Object.keys(t),c=Object.keys(e);return a.length===c.length&&a.every((function(n){return P(t[n],e[n])}))}catch(t){return!1}}function D(t,e){for(var n=0;n<t.length;n++)if(P(t[n],e))return n;return-1}function M(t){var e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}function I(t,e){return t===e?0===t&&1/t!=1/e:t==t||e==e}var L="data-server-rendered",R=["component","directive","filter"],F=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch","renderTracked","renderTriggered"],H={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:E,isReservedAttr:E,isUnknownElement:E,getTagNamespace:j,parsePlatformTagName:N,mustUseProp:E,async:!0,_lifecycleHooks:F},B=/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;function U(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function z(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0})}var V=new RegExp("[^".concat(B.source,".$_\\d]"));var K="__proto__"in{},J="undefined"!=typeof window,q=J&&window.navigator.userAgent.toLowerCase(),W=q&&/msie|trident/.test(q),Z=q&&q.indexOf("msie 9.0")>0,G=q&&q.indexOf("edge/")>0;q&&q.indexOf("android");var X=q&&/iphone|ipad|ipod|ios/.test(q);q&&/chrome\/\d+/.test(q),q&&/phantomjs/.test(q);var Y,Q=q&&q.match(/firefox\/(\d+)/),tt={}.watch,et=!1;if(J)try{var nt={};Object.defineProperty(nt,"passive",{get:function(){et=!0}}),window.addEventListener("test-passive",null,nt)}catch(t){}var rt=function(){return void 0===Y&&(Y=!J&&"undefined"!=typeof global&&(global.process&&"server"===global.process.env.VUE_ENV)),Y},ot=J&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function it(t){return"function"==typeof t&&/native code/.test(t.toString())}var at,st="undefined"!=typeof Symbol&&it(Symbol)&&"undefined"!=typeof Reflect&&it(Reflect.ownKeys);at="undefined"!=typeof Set&&it(Set)?Set:function(){function t(){this.set=Object.create(null)}return t.prototype.has=function(t){return!0===this.set[t]},t.prototype.add=function(t){this.set[t]=!0},t.prototype.clear=function(){this.set=Object.create(null)},t}();var ct=null;function ut(t){void 0===t&&(t=null),t||ct&&ct._scope.off(),ct=t,t&&t._scope.on()}var lt=function(){function t(t,e,n,r,o,i,a,s){this.tag=t,this.data=e,this.children=n,this.text=r,this.elm=o,this.ns=void 0,this.context=i,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1}return Object.defineProperty(t.prototype,"child",{get:function(){return this.componentInstance},enumerable:!1,configurable:!0}),t}(),ft=function(t){void 0===t&&(t="");var e=new lt;return e.text=t,e.isComment=!0,e};function dt(t){return new lt(void 0,void 0,void 0,String(t))}function pt(t){var e=new lt(t.tag,t.data,t.children&&t.children.slice(),t.text,t.elm,t.context,t.componentOptions,t.asyncFactory);return e.ns=t.ns,e.isStatic=t.isStatic,e.key=t.key,e.isComment=t.isComment,e.fnContext=t.fnContext,e.fnOptions=t.fnOptions,e.fnScopeId=t.fnScopeId,e.asyncMeta=t.asyncMeta,e.isCloned=!0,e}var vt=0,ht=function(){function t(){this.id=vt++,this.subs=[]}return t.prototype.addSub=function(t){this.subs.push(t)},t.prototype.removeSub=function(t){g(this.subs,t)},t.prototype.depend=function(e){t.target&&t.target.addDep(this)},t.prototype.notify=function(t){for(var e=this.subs.slice(),n=0,r=e.length;n<r;n++)e[n].update()},t}();ht.target=null;var mt=[];function gt(t){mt.push(t),ht.target=t}function yt(){mt.pop(),ht.target=mt[mt.length-1]}var _t=Array.prototype,bt=Object.create(_t);["push","pop","shift","unshift","splice","sort","reverse"].forEach((function(t){var e=_t[t];z(bt,t,(function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];var o,i=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":o=n;break;case"splice":o=n.slice(2)}return o&&a.observeArray(o),a.dep.notify(),i}))}));var $t=Object.getOwnPropertyNames(bt),wt={},xt=!0;function Ct(t){xt=t}var kt={notify:j,depend:j,addSub:j,removeSub:j},St=function(){function t(t,n,r){if(void 0===n&&(n=!1),void 0===r&&(r=!1),this.value=t,this.shallow=n,this.mock=r,this.dep=r?kt:new ht,this.vmCount=0,z(t,"__ob__",this),e(t)){if(!r)if(K)t.__proto__=bt;else for(var o=0,i=$t.length;o<i;o++){z(t,s=$t[o],bt[s])}n||this.observeArray(t)}else{var a=Object.keys(t);for(o=0;o<a.length;o++){var s;Tt(t,s=a[o],wt,void 0,n,r)}}}return t.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)Ot(t[e],!1,this.mock)},t}();function Ot(t,n,r){var o;if(!(!s(t)||Rt(t)||t instanceof lt))return _(t,"__ob__")&&t.__ob__ instanceof St?o=t.__ob__:!xt||!r&&rt()||!e(t)&&!u(t)||!Object.isExtensible(t)||t.__v_skip||(o=new St(t,n,r)),o}function Tt(t,n,r,o,i,a){var s=new ht,c=Object.getOwnPropertyDescriptor(t,n);if(!c||!1!==c.configurable){var u=c&&c.get,l=c&&c.set;u&&!l||r!==wt&&2!==arguments.length||(r=t[n]);var f=!i&&Ot(r,!1,a);return Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:function(){var n=u?u.call(t):r;return ht.target&&(s.depend(),f&&(f.dep.depend(),e(n)&&Et(n))),Rt(n)&&!i?n.value:n},set:function(e){var n=u?u.call(t):r;if(I(n,e)){if(l)l.call(t,e);else{if(u)return;if(!i&&Rt(n)&&!Rt(e))return void(n.value=e);r=e}f=!i&&Ot(e,!1,a),s.notify()}}}),s}}function At(t,n,r){if(!It(t)){var o=t.__ob__;return e(t)&&l(n)?(t.length=Math.max(t.length,n),t.splice(n,1,r),o&&!o.shallow&&o.mock&&Ot(r,!1,!0),r):n in t&&!(n in Object.prototype)?(t[n]=r,r):t._isVue||o&&o.vmCount?r:o?(Tt(o.value,n,r,void 0,o.shallow,o.mock),o.dep.notify(),r):(t[n]=r,r)}}function jt(t,n){if(e(t)&&l(n))t.splice(n,1);else{var r=t.__ob__;t._isVue||r&&r.vmCount||It(t)||_(t,n)&&(delete t[n],r&&r.dep.notify())}}function Et(t){for(var n=void 0,r=0,o=t.length;r<o;r++)(n=t[r])&&n.__ob__&&n.__ob__.dep.depend(),e(n)&&Et(n)}function Nt(t){return Pt(t,!0),z(t,"__v_isShallow",!0),t}function Pt(t,e){It(t)||Ot(t,e,rt())}function Dt(t){return It(t)?Dt(t.__v_raw):!(!t||!t.__ob__)}function Mt(t){return!(!t||!t.__v_isShallow)}function It(t){return!(!t||!t.__v_isReadonly)}var Lt="__v_isRef";function Rt(t){return!(!t||!0!==t.__v_isRef)}function Ft(t,e){if(Rt(t))return t;var n={};return z(n,Lt,!0),z(n,"__v_isShallow",e),z(n,"dep",Tt(n,"value",t,null,e,rt())),n}function Ht(t,e,n){Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:function(){var t=e[n];if(Rt(t))return t.value;var r=t&&t.__ob__;return r&&r.dep.depend(),t},set:function(t){var r=e[n];Rt(r)&&!Rt(t)?r.value=t:e[n]=t}})}function Bt(t,e,n){var r=t[e];if(Rt(r))return r;var o={get value(){var r=t[e];return void 0===r?n:r},set value(n){t[e]=n}};return z(o,Lt,!0),o}function Ut(t){return zt(t,!1)}function zt(t,e){if(!u(t))return t;if(It(t))return t;var n=e?"__v_rawToShallowReadonly":"__v_rawToReadonly",r=t[n];if(r)return r;var o=Object.create(Object.getPrototypeOf(t));z(t,n,o),z(o,"__v_isReadonly",!0),z(o,"__v_raw",t),Rt(t)&&z(o,Lt,!0),(e||Mt(t))&&z(o,"__v_isShallow",!0);for(var i=Object.keys(t),a=0;a<i.length;a++)Vt(o,t,i[a],e);return o}function Vt(t,e,n,r){Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:function(){var t=e[n];return r||!u(t)?t:Ut(t)},set:function(){}})}var Kt=b((function(t){var e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),r="!"===(t=n?t.slice(1):t).charAt(0);return{name:t=r?t.slice(1):t,once:n,capture:r,passive:e}}));function Jt(t,n){function r(){var t=r.fns;if(!e(t))return fn(t,null,arguments,n,"v-on handler");for(var o=t.slice(),i=0;i<o.length;i++)fn(o[i],null,arguments,n,"v-on handler")}return r.fns=t,r}function qt(t,e,r,i,a,s){var c,u,l,f;for(c in t)u=t[c],l=e[c],f=Kt(c),n(u)||(n(l)?(n(u.fns)&&(u=t[c]=Jt(u,s)),o(f.once)&&(u=t[c]=a(f.name,u,f.capture)),r(f.name,u,f.capture,f.passive,f.params)):u!==l&&(l.fns=u,t[c]=l));for(c in e)n(t[c])&&i((f=Kt(c)).name,e[c],f.capture)}function Wt(t,e,i){var a;t instanceof lt&&(t=t.data.hook||(t.data.hook={}));var s=t[e];function c(){i.apply(this,arguments),g(a.fns,c)}n(s)?a=Jt([c]):r(s.fns)&&o(s.merged)?(a=s).fns.push(c):a=Jt([s,c]),a.merged=!0,t[e]=a}function Zt(t,e,n,o,i){if(r(e)){if(_(e,n))return t[n]=e[n],i||delete e[n],!0;if(_(e,o))return t[n]=e[o],i||delete e[o],!0}return!1}function Gt(t){return i(t)?[dt(t)]:e(t)?Yt(t):void 0}function Xt(t){return r(t)&&r(t.text)&&!1===t.isComment}function Yt(t,a){var s,c,u,l,f=[];for(s=0;s<t.length;s++)n(c=t[s])||"boolean"==typeof c||(l=f[u=f.length-1],e(c)?c.length>0&&(Xt((c=Yt(c,"".concat(a||"","_").concat(s)))[0])&&Xt(l)&&(f[u]=dt(l.text+c[0].text),c.shift()),f.push.apply(f,c)):i(c)?Xt(l)?f[u]=dt(l.text+c):""!==c&&f.push(dt(c)):Xt(c)&&Xt(l)?f[u]=dt(l.text+c.text):(o(t._isVList)&&r(c.tag)&&n(c.key)&&r(a)&&(c.key="__vlist".concat(a,"_").concat(s,"__")),f.push(c)));return f}function Qt(t,n,c,u,l,f){return(e(c)||i(c))&&(l=u,u=c,c=void 0),o(f)&&(l=2),function(t,n,o,i,c){if(r(o)&&r(o.__ob__))return ft();r(o)&&r(o.is)&&(n=o.is);if(!n)return ft();e(i)&&a(i[0])&&((o=o||{}).scopedSlots={default:i[0]},i.length=0);2===c?i=Gt(i):1===c&&(i=function(t){for(var n=0;n<t.length;n++)if(e(t[n]))return Array.prototype.concat.apply([],t);return t}(i));var u,l;if("string"==typeof n){var f=void 0;l=t.$vnode&&t.$vnode.ns||H.getTagNamespace(n),u=H.isReservedTag(n)?new lt(H.parsePlatformTagName(n),o,i,void 0,void 0,t):o&&o.pre||!r(f=gr(t.$options,"components",n))?new lt(n,o,i,void 0,void 0,t):sr(f,o,t,i,n)}else u=sr(n,o,t,i);return e(u)?u:r(u)?(r(l)&&te(u,l),r(o)&&function(t){s(t.style)&&Hn(t.style);s(t.class)&&Hn(t.class)}(o),u):ft()}(t,n,c,u,l)}function te(t,e,i){if(t.ns=e,"foreignObject"===t.tag&&(e=void 0,i=!0),r(t.children))for(var a=0,s=t.children.length;a<s;a++){var c=t.children[a];r(c.tag)&&(n(c.ns)||o(i)&&"svg"!==c.tag)&&te(c,e,i)}}function ee(t,n){var o,i,a,c,u=null;if(e(t)||"string"==typeof t)for(u=new Array(t.length),o=0,i=t.length;o<i;o++)u[o]=n(t[o],o);else if("number"==typeof t)for(u=new Array(t),o=0;o<t;o++)u[o]=n(o+1,o);else if(s(t))if(st&&t[Symbol.iterator]){u=[];for(var l=t[Symbol.iterator](),f=l.next();!f.done;)u.push(n(f.value,u.length)),f=l.next()}else for(a=Object.keys(t),u=new Array(a.length),o=0,i=a.length;o<i;o++)c=a[o],u[o]=n(t[c],c,o);return r(u)||(u=[]),u._isVList=!0,u}function ne(t,e,n,r){var o,i=this.$scopedSlots[t];i?(n=n||{},r&&(n=T(T({},r),n)),o=i(n)||(a(e)?e():e)):o=this.$slots[t]||(a(e)?e():e);var s=n&&n.slot;return s?this.$createElement("template",{slot:s},o):o}function re(t){return gr(this.$options,"filters",t)||N}function oe(t,n){return e(t)?-1===t.indexOf(n):t!==n}function ie(t,e,n,r,o){var i=H.keyCodes[e]||n;return o&&r&&!H.keyCodes[e]?oe(o,r):i?oe(i,t):r?k(r)!==e:void 0===t}function ae(t,n,r,o,i){if(r)if(s(r)){e(r)&&(r=A(r));var a=void 0,c=function(e){if("class"===e||"style"===e||m(e))a=t;else{var s=t.attrs&&t.attrs.type;a=o||H.mustUseProp(n,s,e)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}var c=w(e),u=k(e);c in a||u in a||(a[e]=r[e],i&&((t.on||(t.on={}))["update:".concat(e)]=function(t){r[e]=t}))};for(var u in r)c(u)}else;return t}function se(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e||ue(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,this._c,this),"__static__".concat(t),!1),r}function ce(t,e,n){return ue(t,"__once__".concat(e).concat(n?"_".concat(n):""),!0),t}function ue(t,n,r){if(e(t))for(var o=0;o<t.length;o++)t[o]&&"string"!=typeof t[o]&&le(t[o],"".concat(n,"_").concat(o),r);else le(t,n,r)}function le(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function fe(t,e){if(e)if(u(e)){var n=t.on=t.on?T({},t.on):{};for(var r in e){var o=n[r],i=e[r];n[r]=o?[].concat(o,i):i}}else;return t}function de(t,n,r,o){n=n||{$stable:!r};for(var i=0;i<t.length;i++){var a=t[i];e(a)?de(a,n,r):a&&(a.proxy&&(a.fn.proxy=!0),n[a.key]=a.fn)}return o&&(n.$key=o),n}function pe(t,e){for(var n=0;n<e.length;n+=2){var r=e[n];"string"==typeof r&&r&&(t[e[n]]=e[n+1])}return t}function ve(t,e){return"string"==typeof t?e+t:t}function he(t){t._o=ce,t._n=p,t._s=d,t._l=ee,t._t=ne,t._q=P,t._i=D,t._m=se,t._f=re,t._k=ie,t._b=ae,t._v=dt,t._e=ft,t._u=de,t._g=fe,t._d=pe,t._p=ve}function me(t,e){if(!t||!t.length)return{};for(var n={},r=0,o=t.length;r<o;r++){var i=t[r],a=i.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,i.context!==e&&i.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(i);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===i.tag?c.push.apply(c,i.children||[]):c.push(i)}}for(var u in n)n[u].every(ge)&&delete n[u];return n}function ge(t){return t.isComment&&!t.asyncFactory||" "===t.text}function ye(t){return t.isComment&&t.asyncFactory}function _e(e,n,r,o){var i,a=Object.keys(r).length>0,s=n?!!n.$stable:!a,c=n&&n.$key;if(n){if(n._normalized)return n._normalized;if(s&&o&&o!==t&&c===o.$key&&!a&&!o.$hasNormal)return o;for(var u in i={},n)n[u]&&"$"!==u[0]&&(i[u]=be(e,r,u,n[u]))}else i={};for(var l in r)l in i||(i[l]=$e(r,l));return n&&Object.isExtensible(n)&&(n._normalized=i),z(i,"$stable",s),z(i,"$key",c),z(i,"$hasNormal",a),i}function be(t,n,r,o){var i=function(){var n=ct;ut(t);var r=arguments.length?o.apply(null,arguments):o({}),i=(r=r&&"object"==typeof r&&!e(r)?[r]:Gt(r))&&r[0];return ut(n),r&&(!i||1===r.length&&i.isComment&&!ye(i))?void 0:r};return o.proxy&&Object.defineProperty(n,r,{get:i,enumerable:!0,configurable:!0}),i}function $e(t,e){return function(){return t[e]}}function we(e){return{get attrs(){if(!e._attrsProxy){var n=e._attrsProxy={};z(n,"_v_attr_proxy",!0),xe(n,e.$attrs,t,e,"$attrs")}return e._attrsProxy},get listeners(){e._listenersProxy||xe(e._listenersProxy={},e.$listeners,t,e,"$listeners");return e._listenersProxy},get slots(){return function(t){t._slotsProxy||ke(t._slotsProxy={},t.$scopedSlots);return t._slotsProxy}(e)},emit:S(e.$emit,e),expose:function(t){t&&Object.keys(t).forEach((function(n){return Ht(e,t,n)}))}}}function xe(t,e,n,r,o){var i=!1;for(var a in e)a in t?e[a]!==n[a]&&(i=!0):(i=!0,Ce(t,a,r,o));for(var a in t)a in e||(i=!0,delete t[a]);return i}function Ce(t,e,n,r){Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){return n[r][e]}})}function ke(t,e){for(var n in e)t[n]=e[n];for(var n in t)n in e||delete t[n]}function Se(){var t=ct;return t._setupContext||(t._setupContext=we(t))}var Oe,Te=null;function Ae(t,e){return(t.__esModule||st&&"Module"===t[Symbol.toStringTag])&&(t=t.default),s(t)?e.extend(t):t}function je(t){if(e(t))for(var n=0;n<t.length;n++){var o=t[n];if(r(o)&&(r(o.componentOptions)||ye(o)))return o}}function Ee(t,e){Oe.$on(t,e)}function Ne(t,e){Oe.$off(t,e)}function Pe(t,e){var n=Oe;return function r(){var o=e.apply(null,arguments);null!==o&&n.$off(t,r)}}function De(t,e,n){Oe=t,qt(e,n||{},Ee,Ne,Pe,t),Oe=void 0}var Me=null;function Ie(t){var e=Me;return Me=t,function(){Me=e}}function Le(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function Re(t,e){if(e){if(t._directInactive=!1,Le(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)Re(t.$children[n]);He(t,"activated")}}function Fe(t,e){if(!(e&&(t._directInactive=!0,Le(t))||t._inactive)){t._inactive=!0;for(var n=0;n<t.$children.length;n++)Fe(t.$children[n]);He(t,"deactivated")}}function He(t,e,n,r){void 0===r&&(r=!0),gt();var o=ct;r&&ut(t);var i=t.$options[e],a="".concat(e," hook");if(i)for(var s=0,c=i.length;s<c;s++)fn(i[s],t,n||null,t,a);t._hasHookEvent&&t.$emit("hook:"+e),r&&ut(o),yt()}var Be=[],Ue=[],ze={},Ve=!1,Ke=!1,Je=0;var qe=0,We=Date.now;if(J&&!W){var Ze=window.performance;Ze&&"function"==typeof Ze.now&&We()>document.createEvent("Event").timeStamp&&(We=function(){return Ze.now()})}var Ge=function(t,e){if(t.post){if(!e.post)return 1}else if(e.post)return-1;return t.id-e.id};function Xe(){var t,e;for(qe=We(),Ke=!0,Be.sort(Ge),Je=0;Je<Be.length;Je++)(t=Be[Je]).before&&t.before(),e=t.id,ze[e]=null,t.run();var n=Ue.slice(),r=Be.slice();Je=Be.length=Ue.length=0,ze={},Ve=Ke=!1,function(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0,Re(t[e],!0)}(n),function(t){var e=t.length;for(;e--;){var n=t[e],r=n.vm;r&&r._watcher===n&&r._isMounted&&!r._isDestroyed&&He(r,"updated")}}(r),ot&&H.devtools&&ot.emit("flush")}function Ye(t){var e=t.id;if(null==ze[e]&&(t!==ht.target||!t.noRecurse)){if(ze[e]=!0,Ke){for(var n=Be.length-1;n>Je&&Be[n].id>t.id;)n--;Be.splice(n+1,0,t)}else Be.push(t);Ve||(Ve=!0,xn(Xe))}}var Qe="watcher",tn="".concat(Qe," callback"),en="".concat(Qe," getter"),nn="".concat(Qe," cleanup");function rn(t,e){return sn(t,null,{flush:"post"})}var on,an={};function sn(n,r,o){var i=void 0===o?t:o,s=i.immediate,c=i.deep,u=i.flush,l=void 0===u?"pre":u;i.onTrack,i.onTrigger;var f,d,p=ct,v=function(t,e,n){return void 0===n&&(n=null),fn(t,null,n,p,e)},h=!1,m=!1;if(Rt(n)?(f=function(){return n.value},h=Mt(n)):Dt(n)?(f=function(){return n.__ob__.dep.depend(),n},c=!0):e(n)?(m=!0,h=n.some((function(t){return Dt(t)||Mt(t)})),f=function(){return n.map((function(t){return Rt(t)?t.value:Dt(t)?Hn(t):a(t)?v(t,en):void 0}))}):f=a(n)?r?function(){return v(n,en)}:function(){if(!p||!p._isDestroyed)return d&&d(),v(n,Qe,[y])}:j,r&&c){var g=f;f=function(){return Hn(g())}}var y=function(t){d=_.onStop=function(){v(t,nn)}};if(rt())return y=j,r?s&&v(r,tn,[f(),m?[]:void 0,y]):f(),j;var _=new zn(ct,f,j,{lazy:!0});_.noRecurse=!r;var b=m?[]:an;return _.run=function(){if(_.active)if(r){var t=_.get();(c||h||(m?t.some((function(t,e){return I(t,b[e])})):I(t,b)))&&(d&&d(),v(r,tn,[t,b===an?void 0:b,y]),b=t)}else _.get()},"sync"===l?_.update=_.run:"post"===l?(_.post=!0,_.update=function(){return Ye(_)}):_.update=function(){if(p&&p===ct&&!p._isMounted){var t=p._preWatchers||(p._preWatchers=[]);t.indexOf(_)<0&&t.push(_)}else Ye(_)},r?s?_.run():b=_.get():"post"===l&&p?p.$once("hook:mounted",(function(){return _.get()})):_.get(),function(){_.teardown()}}var cn=function(){function t(t){void 0===t&&(t=!1),this.active=!0,this.effects=[],this.cleanups=[],!t&&on&&(this.parent=on,this.index=(on.scopes||(on.scopes=[])).push(this)-1)}return t.prototype.run=function(t){if(this.active){var e=on;try{return on=this,t()}finally{on=e}}},t.prototype.on=function(){on=this},t.prototype.off=function(){on=this.parent},t.prototype.stop=function(t){if(this.active){var e=void 0,n=void 0;for(e=0,n=this.effects.length;e<n;e++)this.effects[e].teardown();for(e=0,n=this.cleanups.length;e<n;e++)this.cleanups[e]();if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].stop(!0);if(this.parent&&!t){var r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.active=!1}},t}();function un(t){var e=t._provided,n=t.$parent&&t.$parent._provided;return n===e?t._provided=Object.create(n):e}function ln(t,e,n){gt();try{if(e)for(var r=e;r=r.$parent;){var o=r.$options.errorCaptured;if(o)for(var i=0;i<o.length;i++)try{if(!1===o[i].call(r,t,e,n))return}catch(t){dn(t,r,"errorCaptured hook")}}dn(t,e,n)}finally{yt()}}function fn(t,e,n,r,o){var i;try{(i=n?t.apply(e,n):t.call(e))&&!i._isVue&&f(i)&&!i._handled&&(i.catch((function(t){return ln(t,r,o+" (Promise/async)")})),i._handled=!0)}catch(t){ln(t,r,o)}return i}function dn(t,e,n){if(H.errorHandler)try{return H.errorHandler.call(null,t,e,n)}catch(e){e!==t&&pn(e)}pn(t)}function pn(t,e,n){if(!J||"undefined"==typeof console)throw t;console.error(t)}var vn,hn=!1,mn=[],gn=!1;function yn(){gn=!1;var t=mn.slice(0);mn.length=0;for(var e=0;e<t.length;e++)t[e]()}if("undefined"!=typeof Promise&&it(Promise)){var _n=Promise.resolve();vn=function(){_n.then(yn),X&&setTimeout(j)},hn=!0}else if(W||"undefined"==typeof MutationObserver||!it(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())vn="undefined"!=typeof setImmediate&&it(setImmediate)?function(){setImmediate(yn)}:function(){setTimeout(yn,0)};else{var bn=1,$n=new MutationObserver(yn),wn=document.createTextNode(String(bn));$n.observe(wn,{characterData:!0}),vn=function(){bn=(bn+1)%2,wn.data=String(bn)},hn=!0}function xn(t,e){var n;if(mn.push((function(){if(t)try{t.call(e)}catch(t){ln(t,e,"nextTick")}else n&&n(e)})),gn||(gn=!0,vn()),!t&&"undefined"!=typeof Promise)return new Promise((function(t){n=t}))}function Cn(t){return function(e,n){if(void 0===n&&(n=ct),n)return function(t,e,n){var r=t.$options;r[e]=pr(r[e],n)}(n,t,e)}}var kn=Cn("beforeMount"),Sn=Cn("mounted"),On=Cn("beforeUpdate"),Tn=Cn("updated"),An=Cn("beforeDestroy"),jn=Cn("destroyed"),En=Cn("activated"),Nn=Cn("deactivated"),Pn=Cn("serverPrefetch"),Dn=Cn("renderTracked"),Mn=Cn("renderTriggered"),In=Cn("errorCaptured");var Ln="2.7.10";var Rn=Object.freeze({__proto__:null,version:Ln,defineComponent:function(t){return t},ref:function(t){return Ft(t,!1)},shallowRef:function(t){return Ft(t,!0)},isRef:Rt,toRef:Bt,toRefs:function(t){var n=e(t)?new Array(t.length):{};for(var r in t)n[r]=Bt(t,r);return n},unref:function(t){return Rt(t)?t.value:t},proxyRefs:function(t){if(Dt(t))return t;for(var e={},n=Object.keys(t),r=0;r<n.length;r++)Ht(e,t,n[r]);return e},customRef:function(t){var e=new ht,n=t((function(){e.depend()}),(function(){e.notify()})),r=n.get,o=n.set,i={get value(){return r()},set value(t){o(t)}};return z(i,Lt,!0),i},triggerRef:function(t){t.dep&&t.dep.notify()},reactive:function(t){return Pt(t,!1),t},isReactive:Dt,isReadonly:It,isShallow:Mt,isProxy:function(t){return Dt(t)||It(t)},shallowReactive:Nt,markRaw:function(t){return z(t,"__v_skip",!0),t},toRaw:function t(e){var n=e&&e.__v_raw;return n?t(n):e},readonly:Ut,shallowReadonly:function(t){return zt(t,!0)},computed:function(t,e){var n,r,o=a(t);o?(n=t,r=j):(n=t.get,r=t.set);var i=rt()?null:new zn(ct,n,j,{lazy:!0}),s={effect:i,get value(){return i?(i.dirty&&i.evaluate(),ht.target&&i.depend(),i.value):n()},set value(t){r(t)}};return z(s,Lt,!0),z(s,"__v_isReadonly",o),s},watch:function(t,e,n){return sn(t,e,n)},watchEffect:function(t,e){return sn(t,null,e)},watchPostEffect:rn,watchSyncEffect:function(t,e){return sn(t,null,{flush:"sync"})},EffectScope:cn,effectScope:function(t){return new cn(t)},onScopeDispose:function(t){on&&on.cleanups.push(t)},getCurrentScope:function(){return on},provide:function(t,e){ct&&(un(ct)[t]=e)},inject:function(t,e,n){void 0===n&&(n=!1);var r=ct;if(r){var o=r.$parent&&r.$parent._provided;if(o&&t in o)return o[t];if(arguments.length>1)return n&&a(e)?e.call(r):e}},h:function(t,e,n){return Qt(ct,t,e,n,2,!0)},getCurrentInstance:function(){return ct&&{proxy:ct}},useSlots:function(){return Se().slots},useAttrs:function(){return Se().attrs},useListeners:function(){return Se().listeners},mergeDefaults:function(t,n){var r=e(t)?t.reduce((function(t,e){return t[e]={},t}),{}):t;for(var o in n){var i=r[o];i?e(i)||a(i)?r[o]={type:i,default:n[o]}:i.default=n[o]:null===i&&(r[o]={default:n[o]})}return r},nextTick:xn,set:At,del:jt,useCssModule:function(e){return t},useCssVars:function(t){if(J){var e=ct;e&&rn((function(){var n=e.$el,r=t(e,e._setupProxy);if(n&&1===n.nodeType){var o=n.style;for(var i in r)o.setProperty("--".concat(i),r[i])}}))}},defineAsyncComponent:function(t){a(t)&&(t={loader:t});var e=t.loader,n=t.loadingComponent,r=t.errorComponent,o=t.delay,i=void 0===o?200:o,s=t.timeout;t.suspensible;var c=t.onError,u=null,l=0,f=function(){var t;return u||(t=u=e().catch((function(t){if(t=t instanceof Error?t:new Error(String(t)),c)return new Promise((function(e,n){c(t,(function(){return e((l++,u=null,f()))}),(function(){return n(t)}),l+1)}));throw t})).then((function(e){return t!==u&&u?u:(e&&(e.__esModule||"Module"===e[Symbol.toStringTag])&&(e=e.default),e)})))};return function(){return{component:f(),delay:i,timeout:s,error:r,loading:n}}},onBeforeMount:kn,onMounted:Sn,onBeforeUpdate:On,onUpdated:Tn,onBeforeUnmount:An,onUnmounted:jn,onActivated:En,onDeactivated:Nn,onServerPrefetch:Pn,onRenderTracked:Dn,onRenderTriggered:Mn,onErrorCaptured:function(t,e){void 0===e&&(e=ct),In(t,e)}}),Fn=new at;function Hn(t){return Bn(t,Fn),Fn.clear(),t}function Bn(t,n){var r,o,i=e(t);if(!(!i&&!s(t)||Object.isFrozen(t)||t instanceof lt)){if(t.__ob__){var a=t.__ob__.dep.id;if(n.has(a))return;n.add(a)}if(i)for(r=t.length;r--;)Bn(t[r],n);else if(Rt(t))Bn(t.value,n);else for(r=(o=Object.keys(t)).length;r--;)Bn(t[o[r]],n)}}var Un=0,zn=function(){function t(t,e,n,r,o){!function(t,e){void 0===e&&(e=on),e&&e.active&&e.effects.push(t)}(this,on&&!on._vm?on:t?t._scope:void 0),(this.vm=t)&&o&&(t._watcher=this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.before=r.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++Un,this.active=!0,this.post=!1,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new at,this.newDepIds=new at,this.expression="",a(e)?this.getter=e:(this.getter=function(t){if(!V.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}}(e),this.getter||(this.getter=j)),this.value=this.lazy?void 0:this.get()}return t.prototype.get=function(){var t;gt(this);var e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;ln(t,e,'getter for watcher "'.concat(this.expression,'"'))}finally{this.deep&&Hn(t),yt(),this.cleanupDeps()}return t},t.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},t.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},t.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():Ye(this)},t.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||s(t)||this.deep){var e=this.value;if(this.value=t,this.user){var n='callback for watcher "'.concat(this.expression,'"');fn(this.cb,this.vm,[t,e],this.vm,n)}else this.cb.call(this.vm,t,e)}}},t.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},t.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},t.prototype.teardown=function(){if(this.vm&&!this.vm._isBeingDestroyed&&g(this.vm._scope.effects,this),this.active){for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1,this.onStop&&this.onStop()}},t}(),Vn={enumerable:!0,configurable:!0,get:j,set:j};function Kn(t,e,n){Vn.get=function(){return this[e][n]},Vn.set=function(t){this[e][n]=t},Object.defineProperty(t,n,Vn)}function Jn(t){var n=t.$options;if(n.props&&function(t,e){var n=t.$options.propsData||{},r=t._props=Nt({}),o=t.$options._propKeys=[];t.$parent&&Ct(!1);var i=function(i){o.push(i);var a=yr(i,e,n,t);Tt(r,i,a),i in t||Kn(t,"_props",i)};for(var a in e)i(a);Ct(!0)}(t,n.props),function(t){var e=t.$options,n=e.setup;if(n){var r=t._setupContext=we(t);ut(t),gt();var o=fn(n,null,[t._props||Nt({}),r],t,"setup");if(yt(),ut(),a(o))e.render=o;else if(s(o))if(t._setupState=o,o.__sfc){var i=t._setupProxy={};for(var c in o)"__sfc"!==c&&Ht(i,o,c)}else for(var c in o)U(c)||Ht(t,o,c)}}(t),n.methods&&function(t,e){for(var n in t.$options.props,e)t[n]="function"!=typeof e[n]?j:S(e[n],t)}(t,n.methods),n.data)!function(t){var e=t.$options.data;u(e=t._data=a(e)?function(t,e){gt();try{return t.call(e,e)}catch(t){return ln(t,e,"data()"),{}}finally{yt()}}(e,t):e||{})||(e={});var n=Object.keys(e),r=t.$options.props;t.$options.methods;var o=n.length;for(;o--;){var i=n[o];r&&_(r,i)||U(i)||Kn(t,"_data",i)}var s=Ot(e);s&&s.vmCount++}(t);else{var r=Ot(t._data={});r&&r.vmCount++}n.computed&&function(t,e){var n=t._computedWatchers=Object.create(null),r=rt();for(var o in e){var i=e[o],s=a(i)?i:i.get;r||(n[o]=new zn(t,s||j,j,qn)),o in t||Wn(t,o,i)}}(t,n.computed),n.watch&&n.watch!==tt&&function(t,n){for(var r in n){var o=n[r];if(e(o))for(var i=0;i<o.length;i++)Xn(t,r,o[i]);else Xn(t,r,o)}}(t,n.watch)}var qn={lazy:!0};function Wn(t,e,n){var r=!rt();a(n)?(Vn.get=r?Zn(e):Gn(n),Vn.set=j):(Vn.get=n.get?r&&!1!==n.cache?Zn(e):Gn(n.get):j,Vn.set=n.set||j),Object.defineProperty(t,e,Vn)}function Zn(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),ht.target&&e.depend(),e.value}}function Gn(t){return function(){return t.call(this,this)}}function Xn(t,e,n,r){return u(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,r)}function Yn(t,e){if(t){for(var n=Object.create(null),r=st?Reflect.ownKeys(t):Object.keys(t),o=0;o<r.length;o++){var i=r[o];if("__ob__"!==i){var s=t[i].from;if(s in e._provided)n[i]=e._provided[s];else if("default"in t[i]){var c=t[i].default;n[i]=a(c)?c.call(e):c}}}return n}}var Qn=0;function tr(t){var e=t.options;if(t.super){var n=tr(t.super);if(n!==t.superOptions){t.superOptions=n;var r=function(t){var e,n=t.options,r=t.sealedOptions;for(var o in n)n[o]!==r[o]&&(e||(e={}),e[o]=n[o]);return e}(t);r&&T(t.extendOptions,r),(e=t.options=mr(n,t.extendOptions)).name&&(e.components[e.name]=t)}}return e}function er(n,r,i,a,s){var c,u=this,l=s.options;_(a,"_uid")?(c=Object.create(a))._original=a:(c=a,a=a._original);var f=o(l._compiled),d=!f;this.data=n,this.props=r,this.children=i,this.parent=a,this.listeners=n.on||t,this.injections=Yn(l.inject,a),this.slots=function(){return u.$slots||_e(a,n.scopedSlots,u.$slots=me(i,a)),u.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return _e(a,n.scopedSlots,this.slots())}}),f&&(this.$options=l,this.$slots=this.slots(),this.$scopedSlots=_e(a,n.scopedSlots,this.$slots)),l._scopeId?this._c=function(t,n,r,o){var i=Qt(c,t,n,r,o,d);return i&&!e(i)&&(i.fnScopeId=l._scopeId,i.fnContext=a),i}:this._c=function(t,e,n,r){return Qt(c,t,e,n,r,d)}}function nr(t,e,n,r,o){var i=pt(t);return i.fnContext=n,i.fnOptions=r,e.slot&&((i.data||(i.data={})).slot=e.slot),i}function rr(t,e){for(var n in e)t[w(n)]=e[n]}function or(t){return t.name||t.__name||t._componentTag}he(er.prototype);var ir={init:function(t,e){if(t.componentInstance&&!t.componentInstance._isDestroyed&&t.data.keepAlive){var n=t;ir.prepatch(n,n)}else{(t.componentInstance=function(t,e){var n={_isComponent:!0,_parentVnode:t,parent:e},o=t.data.inlineTemplate;r(o)&&(n.render=o.render,n.staticRenderFns=o.staticRenderFns);return new t.componentOptions.Ctor(n)}(t,Me)).$mount(e?t.elm:void 0,e)}},prepatch:function(e,n){var r=n.componentOptions;!function(e,n,r,o,i){var a=o.data.scopedSlots,s=e.$scopedSlots,c=!!(a&&!a.$stable||s!==t&&!s.$stable||a&&e.$scopedSlots.$key!==a.$key||!a&&e.$scopedSlots.$key),u=!!(i||e.$options._renderChildren||c),l=e.$vnode;e.$options._parentVnode=o,e.$vnode=o,e._vnode&&(e._vnode.parent=o),e.$options._renderChildren=i;var f=o.data.attrs||t;e._attrsProxy&&xe(e._attrsProxy,f,l.data&&l.data.attrs||t,e,"$attrs")&&(u=!0),e.$attrs=f,r=r||t;var d=e.$options._parentListeners;if(e._listenersProxy&&xe(e._listenersProxy,r,d||t,e,"$listeners"),e.$listeners=e.$options._parentListeners=r,De(e,r,d),n&&e.$options.props){Ct(!1);for(var p=e._props,v=e.$options._propKeys||[],h=0;h<v.length;h++){var m=v[h],g=e.$options.props;p[m]=yr(m,g,n,e)}Ct(!0),e.$options.propsData=n}u&&(e.$slots=me(i,o.context),e.$forceUpdate())}(n.componentInstance=e.componentInstance,r.propsData,r.listeners,n,r.children)},insert:function(t){var e,n=t.context,r=t.componentInstance;r._isMounted||(r._isMounted=!0,He(r,"mounted")),t.data.keepAlive&&(n._isMounted?((e=r)._inactive=!1,Ue.push(e)):Re(r,!0))},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?Fe(e,!0):e.$destroy())}},ar=Object.keys(ir);function sr(i,a,c,u,l){if(!n(i)){var d=c.$options._base;if(s(i)&&(i=d.extend(i)),"function"==typeof i){var p;if(n(i.cid)&&(i=function(t,e){if(o(t.error)&&r(t.errorComp))return t.errorComp;if(r(t.resolved))return t.resolved;var i=Te;if(i&&r(t.owners)&&-1===t.owners.indexOf(i)&&t.owners.push(i),o(t.loading)&&r(t.loadingComp))return t.loadingComp;if(i&&!r(t.owners)){var a=t.owners=[i],c=!0,u=null,l=null;i.$on("hook:destroyed",(function(){return g(a,i)}));var d=function(t){for(var e=0,n=a.length;e<n;e++)a[e].$forceUpdate();t&&(a.length=0,null!==u&&(clearTimeout(u),u=null),null!==l&&(clearTimeout(l),l=null))},p=M((function(n){t.resolved=Ae(n,e),c?a.length=0:d(!0)})),v=M((function(e){r(t.errorComp)&&(t.error=!0,d(!0))})),h=t(p,v);return s(h)&&(f(h)?n(t.resolved)&&h.then(p,v):f(h.component)&&(h.component.then(p,v),r(h.error)&&(t.errorComp=Ae(h.error,e)),r(h.loading)&&(t.loadingComp=Ae(h.loading,e),0===h.delay?t.loading=!0:u=setTimeout((function(){u=null,n(t.resolved)&&n(t.error)&&(t.loading=!0,d(!1))}),h.delay||200)),r(h.timeout)&&(l=setTimeout((function(){l=null,n(t.resolved)&&v(null)}),h.timeout)))),c=!1,t.loading?t.loadingComp:t.resolved}}(p=i,d),void 0===i))return function(t,e,n,r,o){var i=ft();return i.asyncFactory=t,i.asyncMeta={data:e,context:n,children:r,tag:o},i}(p,a,c,u,l);a=a||{},tr(i),r(a.model)&&function(t,n){var o=t.model&&t.model.prop||"value",i=t.model&&t.model.event||"input";(n.attrs||(n.attrs={}))[o]=n.model.value;var a=n.on||(n.on={}),s=a[i],c=n.model.callback;r(s)?(e(s)?-1===s.indexOf(c):s!==c)&&(a[i]=[c].concat(s)):a[i]=c}(i.options,a);var v=function(t,e,o){var i=e.options.props;if(!n(i)){var a={},s=t.attrs,c=t.props;if(r(s)||r(c))for(var u in i){var l=k(u);Zt(a,c,u,l,!0)||Zt(a,s,u,l,!1)}return a}}(a,i);if(o(i.options.functional))return function(n,o,i,a,s){var c=n.options,u={},l=c.props;if(r(l))for(var f in l)u[f]=yr(f,l,o||t);else r(i.attrs)&&rr(u,i.attrs),r(i.props)&&rr(u,i.props);var d=new er(i,u,s,a,n),p=c.render.call(null,d._c,d);if(p instanceof lt)return nr(p,i,d.parent,c);if(e(p)){for(var v=Gt(p)||[],h=new Array(v.length),m=0;m<v.length;m++)h[m]=nr(v[m],i,d.parent,c);return h}}(i,v,a,c,u);var h=a.on;if(a.on=a.nativeOn,o(i.options.abstract)){var m=a.slot;a={},m&&(a.slot=m)}!function(t){for(var e=t.hook||(t.hook={}),n=0;n<ar.length;n++){var r=ar[n],o=e[r],i=ir[r];o===i||o&&o._merged||(e[r]=o?cr(i,o):i)}}(a);var y=or(i.options)||l;return new lt("vue-component-".concat(i.cid).concat(y?"-".concat(y):""),a,void 0,void 0,void 0,c,{Ctor:i,propsData:v,listeners:h,tag:l,children:u},p)}}}function cr(t,e){var n=function(n,r){t(n,r),e(n,r)};return n._merged=!0,n}var ur=j,lr=H.optionMergeStrategies;function fr(t,e){if(!e)return t;for(var n,r,o,i=st?Reflect.ownKeys(e):Object.keys(e),a=0;a<i.length;a++)"__ob__"!==(n=i[a])&&(r=t[n],o=e[n],_(t,n)?r!==o&&u(r)&&u(o)&&fr(r,o):At(t,n,o));return t}function dr(t,e,n){return n?function(){var r=a(e)?e.call(n,n):e,o=a(t)?t.call(n,n):t;return r?fr(r,o):o}:e?t?function(){return fr(a(e)?e.call(this,this):e,a(t)?t.call(this,this):t)}:e:t}function pr(t,n){var r=n?t?t.concat(n):e(n)?n:[n]:t;return r?function(t){for(var e=[],n=0;n<t.length;n++)-1===e.indexOf(t[n])&&e.push(t[n]);return e}(r):r}function vr(t,e,n,r){var o=Object.create(t||null);return e?T(o,e):o}lr.data=function(t,e,n){return n?dr(t,e,n):e&&"function"!=typeof e?t:dr(t,e)},F.forEach((function(t){lr[t]=pr})),R.forEach((function(t){lr[t+"s"]=vr})),lr.watch=function(t,n,r,o){if(t===tt&&(t=void 0),n===tt&&(n=void 0),!n)return Object.create(t||null);if(!t)return n;var i={};for(var a in T(i,t),n){var s=i[a],c=n[a];s&&!e(s)&&(s=[s]),i[a]=s?s.concat(c):e(c)?c:[c]}return i},lr.props=lr.methods=lr.inject=lr.computed=function(t,e,n,r){if(!t)return e;var o=Object.create(null);return T(o,t),e&&T(o,e),o},lr.provide=dr;var hr=function(t,e){return void 0===e?t:e};function mr(t,n,r){if(a(n)&&(n=n.options),function(t,n){var r=t.props;if(r){var o,i,a={};if(e(r))for(o=r.length;o--;)"string"==typeof(i=r[o])&&(a[w(i)]={type:null});else if(u(r))for(var s in r)i=r[s],a[w(s)]=u(i)?i:{type:i};t.props=a}}(n),function(t,n){var r=t.inject;if(r){var o=t.inject={};if(e(r))for(var i=0;i<r.length;i++)o[r[i]]={from:r[i]};else if(u(r))for(var a in r){var s=r[a];o[a]=u(s)?T({from:a},s):{from:s}}}}(n),function(t){var e=t.directives;if(e)for(var n in e){var r=e[n];a(r)&&(e[n]={bind:r,update:r})}}(n),!n._base&&(n.extends&&(t=mr(t,n.extends,r)),n.mixins))for(var o=0,i=n.mixins.length;o<i;o++)t=mr(t,n.mixins[o],r);var s,c={};for(s in t)l(s);for(s in n)_(t,s)||l(s);function l(e){var o=lr[e]||hr;c[e]=o(t[e],n[e],r,e)}return c}function gr(t,e,n,r){if("string"==typeof n){var o=t[e];if(_(o,n))return o[n];var i=w(n);if(_(o,i))return o[i];var a=x(i);return _(o,a)?o[a]:o[n]||o[i]||o[a]}}function yr(t,e,n,r){var o=e[t],i=!_(n,t),s=n[t],c=wr(Boolean,o.type);if(c>-1)if(i&&!_(o,"default"))s=!1;else if(""===s||s===k(t)){var u=wr(String,o.type);(u<0||c<u)&&(s=!0)}if(void 0===s){s=function(t,e,n){if(!_(e,"default"))return;var r=e.default;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return a(r)&&"Function"!==br(e.type)?r.call(t):r}(r,o,t);var l=xt;Ct(!0),Ot(s),Ct(l)}return s}var _r=/^\s*function (\w+)/;function br(t){var e=t&&t.toString().match(_r);return e?e[1]:""}function $r(t,e){return br(t)===br(e)}function wr(t,n){if(!e(n))return $r(n,t)?0:-1;for(var r=0,o=n.length;r<o;r++)if($r(n[r],t))return r;return-1}function xr(t){this._init(t)}function Cr(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,o=t._Ctor||(t._Ctor={});if(o[r])return o[r];var i=or(t)||or(n.options),a=function(t){this._init(t)};return(a.prototype=Object.create(n.prototype)).constructor=a,a.cid=e++,a.options=mr(n.options,t),a.super=n,a.options.props&&function(t){var e=t.options.props;for(var n in e)Kn(t.prototype,"_props",n)}(a),a.options.computed&&function(t){var e=t.options.computed;for(var n in e)Wn(t.prototype,n,e[n])}(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,R.forEach((function(t){a[t]=n[t]})),i&&(a.options.components[i]=a),a.superOptions=n.options,a.extendOptions=t,a.sealedOptions=T({},a.options),o[r]=a,a}}function kr(t){return t&&(or(t.Ctor.options)||t.tag)}function Sr(t,n){return e(t)?t.indexOf(n)>-1:"string"==typeof t?t.split(",").indexOf(n)>-1:(r=t,"[object RegExp]"===c.call(r)&&t.test(n));var r}function Or(t,e){var n=t.cache,r=t.keys,o=t._vnode;for(var i in n){var a=n[i];if(a){var s=a.name;s&&!e(s)&&Tr(n,i,r,o)}}}function Tr(t,e,n,r){var o=t[e];!o||r&&o.tag===r.tag||o.componentInstance.$destroy(),t[e]=null,g(n,e)}!function(e){e.prototype._init=function(e){var n=this;n._uid=Qn++,n._isVue=!0,n.__v_skip=!0,n._scope=new cn(!0),n._scope._vm=!0,e&&e._isComponent?function(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent,n._parentVnode=r;var o=r.componentOptions;n.propsData=o.propsData,n._parentListeners=o.listeners,n._renderChildren=o.children,n._componentTag=o.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(n,e):n.$options=mr(tr(n.constructor),e||{},n),n._renderProxy=n,n._self=n,function(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._provided=n?n._provided:Object.create(null),t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(n),function(t){t._events=Object.create(null),t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&De(t,e)}(n),function(e){e._vnode=null,e._staticTrees=null;var n=e.$options,r=e.$vnode=n._parentVnode,o=r&&r.context;e.$slots=me(n._renderChildren,o),e.$scopedSlots=r?_e(e.$parent,r.data.scopedSlots,e.$slots):t,e._c=function(t,n,r,o){return Qt(e,t,n,r,o,!1)},e.$createElement=function(t,n,r,o){return Qt(e,t,n,r,o,!0)};var i=r&&r.data;Tt(e,"$attrs",i&&i.attrs||t,null,!0),Tt(e,"$listeners",n._parentListeners||t,null,!0)}(n),He(n,"beforeCreate",void 0,!1),function(t){var e=Yn(t.$options.inject,t);e&&(Ct(!1),Object.keys(e).forEach((function(n){Tt(t,n,e[n])})),Ct(!0))}(n),Jn(n),function(t){var e=t.$options.provide;if(e){var n=a(e)?e.call(t):e;if(!s(n))return;for(var r=un(t),o=st?Reflect.ownKeys(n):Object.keys(n),i=0;i<o.length;i++){var c=o[i];Object.defineProperty(r,c,Object.getOwnPropertyDescriptor(n,c))}}}(n),He(n,"created"),n.$options.el&&n.$mount(n.$options.el)}}(xr),function(t){var e={get:function(){return this._data}},n={get:function(){return this._props}};Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=At,t.prototype.$delete=jt,t.prototype.$watch=function(t,e,n){var r=this;if(u(e))return Xn(r,t,e,n);(n=n||{}).user=!0;var o=new zn(r,t,e,n);if(n.immediate){var i='callback for immediate watcher "'.concat(o.expression,'"');gt(),fn(e,r,[o.value],r,i),yt()}return function(){o.teardown()}}}(xr),function(t){var n=/^hook:/;t.prototype.$on=function(t,r){var o=this;if(e(t))for(var i=0,a=t.length;i<a;i++)o.$on(t[i],r);else(o._events[t]||(o._events[t]=[])).push(r),n.test(t)&&(o._hasHookEvent=!0);return o},t.prototype.$once=function(t,e){var n=this;function r(){n.$off(t,r),e.apply(n,arguments)}return r.fn=e,n.$on(t,r),n},t.prototype.$off=function(t,n){var r=this;if(!arguments.length)return r._events=Object.create(null),r;if(e(t)){for(var o=0,i=t.length;o<i;o++)r.$off(t[o],n);return r}var a,s=r._events[t];if(!s)return r;if(!n)return r._events[t]=null,r;for(var c=s.length;c--;)if((a=s[c])===n||a.fn===n){s.splice(c,1);break}return r},t.prototype.$emit=function(t){var e=this,n=e._events[t];if(n){n=n.length>1?O(n):n;for(var r=O(arguments,1),o='event handler for "'.concat(t,'"'),i=0,a=n.length;i<a;i++)fn(n[i],e,r,e,o)}return e}}(xr),function(t){t.prototype._update=function(t,e){var n=this,r=n.$el,o=n._vnode,i=Ie(n);n._vnode=t,n.$el=o?n.__patch__(o,t):n.__patch__(n.$el,t,e,!1),i(),r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n);for(var a=n;a&&a.$vnode&&a.$parent&&a.$vnode===a.$parent._vnode;)a.$parent.$el=a.$el,a=a.$parent},t.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},t.prototype.$destroy=function(){var t=this;if(!t._isBeingDestroyed){He(t,"beforeDestroy"),t._isBeingDestroyed=!0;var e=t.$parent;!e||e._isBeingDestroyed||t.$options.abstract||g(e.$children,t),t._scope.stop(),t._data.__ob__&&t._data.__ob__.vmCount--,t._isDestroyed=!0,t.__patch__(t._vnode,null),He(t,"destroyed"),t.$off(),t.$el&&(t.$el.__vue__=null),t.$vnode&&(t.$vnode.parent=null)}}}(xr),function(t){he(t.prototype),t.prototype.$nextTick=function(t){return xn(t,this)},t.prototype._render=function(){var t,n=this,r=n.$options,o=r.render,i=r._parentVnode;i&&n._isMounted&&(n.$scopedSlots=_e(n.$parent,i.data.scopedSlots,n.$slots,n.$scopedSlots),n._slotsProxy&&ke(n._slotsProxy,n.$scopedSlots)),n.$vnode=i;try{ut(n),Te=n,t=o.call(n._renderProxy,n.$createElement)}catch(e){ln(e,n,"render"),t=n._vnode}finally{Te=null,ut()}return e(t)&&1===t.length&&(t=t[0]),t instanceof lt||(t=ft()),t.parent=i,t}}(xr);var Ar=[String,RegExp,Array],jr={name:"keep-alive",abstract:!0,props:{include:Ar,exclude:Ar,max:[String,Number]},methods:{cacheVNode:function(){var t=this,e=t.cache,n=t.keys,r=t.vnodeToCache,o=t.keyToCache;if(r){var i=r.tag,a=r.componentInstance,s=r.componentOptions;e[o]={name:kr(s),tag:i,componentInstance:a},n.push(o),this.max&&n.length>parseInt(this.max)&&Tr(e,n[0],n,this._vnode),this.vnodeToCache=null}}},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var t in this.cache)Tr(this.cache,t,this.keys)},mounted:function(){var t=this;this.cacheVNode(),this.$watch("include",(function(e){Or(t,(function(t){return Sr(e,t)}))})),this.$watch("exclude",(function(e){Or(t,(function(t){return!Sr(e,t)}))}))},updated:function(){this.cacheVNode()},render:function(){var t=this.$slots.default,e=je(t),n=e&&e.componentOptions;if(n){var r=kr(n),o=this.include,i=this.exclude;if(o&&(!r||!Sr(o,r))||i&&r&&Sr(i,r))return e;var a=this.cache,s=this.keys,c=null==e.key?n.Ctor.cid+(n.tag?"::".concat(n.tag):""):e.key;a[c]?(e.componentInstance=a[c].componentInstance,g(s,c),s.push(c)):(this.vnodeToCache=e,this.keyToCache=c),e.data.keepAlive=!0}return e||t&&t[0]}},Er={KeepAlive:jr};!function(t){var e={get:function(){return H}};Object.defineProperty(t,"config",e),t.util={warn:ur,extend:T,mergeOptions:mr,defineReactive:Tt},t.set=At,t.delete=jt,t.nextTick=xn,t.observable=function(t){return Ot(t),t},t.options=Object.create(null),R.forEach((function(e){t.options[e+"s"]=Object.create(null)})),t.options._base=t,T(t.options.components,Er),function(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=O(arguments,1);return n.unshift(this),a(t.install)?t.install.apply(t,n):a(t)&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=mr(this.options,t),this}}(t),Cr(t),function(t){R.forEach((function(e){t[e]=function(t,n){return n?("component"===e&&u(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&a(n)&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}}))}(t)}(xr),Object.defineProperty(xr.prototype,"$isServer",{get:rt}),Object.defineProperty(xr.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(xr,"FunctionalRenderContext",{value:er}),xr.version=Ln;var Nr=v("style,class"),Pr=v("input,textarea,option,select,progress"),Dr=function(t,e,n){return"value"===n&&Pr(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},Mr=v("contenteditable,draggable,spellcheck"),Ir=v("events,caret,typing,plaintext-only"),Lr=v("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible"),Rr="http://www.w3.org/1999/xlink",Fr=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},Hr=function(t){return Fr(t)?t.slice(6,t.length):""},Br=function(t){return null==t||!1===t};function Ur(t){for(var e=t.data,n=t,o=t;r(o.componentInstance);)(o=o.componentInstance._vnode)&&o.data&&(e=zr(o.data,e));for(;r(n=n.parent);)n&&n.data&&(e=zr(e,n.data));return function(t,e){if(r(t)||r(e))return Vr(t,Kr(e));return""}(e.staticClass,e.class)}function zr(t,e){return{staticClass:Vr(t.staticClass,e.staticClass),class:r(t.class)?[t.class,e.class]:e.class}}function Vr(t,e){return t?e?t+" "+e:t:e||""}function Kr(t){return Array.isArray(t)?function(t){for(var e,n="",o=0,i=t.length;o<i;o++)r(e=Kr(t[o]))&&""!==e&&(n&&(n+=" "),n+=e);return n}(t):s(t)?function(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}var Jr={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},qr=v("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Wr=v("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Zr=function(t){return qr(t)||Wr(t)};function Gr(t){return Wr(t)?"svg":"math"===t?"math":void 0}var Xr=Object.create(null);var Yr=v("text,number,password,search,email,tel,url");function Qr(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}var to=Object.freeze({__proto__:null,createElement:function(t,e){var n=document.createElement(t);return"select"!==t||e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n},createElementNS:function(t,e){return document.createElementNS(Jr[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setStyleScope:function(t,e){t.setAttribute(e,"")}}),eo={create:function(t,e){no(e)},update:function(t,e){t.data.ref!==e.data.ref&&(no(t,!0),no(e))},destroy:function(t){no(t,!0)}};function no(t,n){var o=t.data.ref;if(r(o)){var i=t.context,s=t.componentInstance||t.elm,c=n?null:s,u=n?void 0:s;if(a(o))fn(o,i,[c],i,"template ref function");else{var l=t.data.refInFor,f="string"==typeof o||"number"==typeof o,d=Rt(o),p=i.$refs;if(f||d)if(l){var v=f?p[o]:o.value;n?e(v)&&g(v,s):e(v)?v.includes(s)||v.push(s):f?(p[o]=[s],ro(i,o,p[o])):o.value=[s]}else if(f){if(n&&p[o]!==s)return;p[o]=u,ro(i,o,c)}else if(d){if(n&&o.value!==s)return;o.value=c}}}}function ro(t,e,n){var r=t._setupState;r&&_(r,e)&&(Rt(r[e])?r[e].value=n:r[e]=n)}var oo=new lt("",{},[]),io=["create","activate","update","remove","destroy"];function ao(t,e){return t.key===e.key&&t.asyncFactory===e.asyncFactory&&(t.tag===e.tag&&t.isComment===e.isComment&&r(t.data)===r(e.data)&&function(t,e){if("input"!==t.tag)return!0;var n,o=r(n=t.data)&&r(n=n.attrs)&&n.type,i=r(n=e.data)&&r(n=n.attrs)&&n.type;return o===i||Yr(o)&&Yr(i)}(t,e)||o(t.isAsyncPlaceholder)&&n(e.asyncFactory.error))}function so(t,e,n){var o,i,a={};for(o=e;o<=n;++o)r(i=t[o].key)&&(a[i]=o);return a}var co={create:uo,update:uo,destroy:function(t){uo(t,oo)}};function uo(t,e){(t.data.directives||e.data.directives)&&function(t,e){var n,r,o,i=t===oo,a=e===oo,s=fo(t.data.directives,t.context),c=fo(e.data.directives,e.context),u=[],l=[];for(n in c)r=s[n],o=c[n],r?(o.oldValue=r.value,o.oldArg=r.arg,vo(o,"update",e,t),o.def&&o.def.componentUpdated&&l.push(o)):(vo(o,"bind",e,t),o.def&&o.def.inserted&&u.push(o));if(u.length){var f=function(){for(var n=0;n<u.length;n++)vo(u[n],"inserted",e,t)};i?Wt(e,"insert",f):f()}l.length&&Wt(e,"postpatch",(function(){for(var n=0;n<l.length;n++)vo(l[n],"componentUpdated",e,t)}));if(!i)for(n in s)c[n]||vo(s[n],"unbind",t,t,a)}(t,e)}var lo=Object.create(null);function fo(t,e){var n,r,o=Object.create(null);if(!t)return o;for(n=0;n<t.length;n++){if((r=t[n]).modifiers||(r.modifiers=lo),o[po(r)]=r,e._setupState&&e._setupState.__sfc){var i=r.def||gr(e,"_setupState","v-"+r.name);r.def="function"==typeof i?{bind:i,update:i}:i}r.def=r.def||gr(e.$options,"directives",r.name)}return o}function po(t){return t.rawName||"".concat(t.name,".").concat(Object.keys(t.modifiers||{}).join("."))}function vo(t,e,n,r,o){var i=t.def&&t.def[e];if(i)try{i(n.elm,t,n,r,o)}catch(r){ln(r,n.context,"directive ".concat(t.name," ").concat(e," hook"))}}var ho=[eo,co];function mo(t,e){var i=e.componentOptions;if(!(r(i)&&!1===i.Ctor.options.inheritAttrs||n(t.data.attrs)&&n(e.data.attrs))){var a,s,c=e.elm,u=t.data.attrs||{},l=e.data.attrs||{};for(a in(r(l.__ob__)||o(l._v_attr_proxy))&&(l=e.data.attrs=T({},l)),l)s=l[a],u[a]!==s&&go(c,a,s,e.data.pre);for(a in(W||G)&&l.value!==u.value&&go(c,"value",l.value),u)n(l[a])&&(Fr(a)?c.removeAttributeNS(Rr,Hr(a)):Mr(a)||c.removeAttribute(a))}}function go(t,e,n,r){r||t.tagName.indexOf("-")>-1?yo(t,e,n):Lr(e)?Br(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n)):Mr(e)?t.setAttribute(e,function(t,e){return Br(e)||"false"===e?"false":"contenteditable"===t&&Ir(e)?e:"true"}(e,n)):Fr(e)?Br(n)?t.removeAttributeNS(Rr,Hr(e)):t.setAttributeNS(Rr,e,n):yo(t,e,n)}function yo(t,e,n){if(Br(n))t.removeAttribute(e);else{if(W&&!Z&&"TEXTAREA"===t.tagName&&"placeholder"===e&&""!==n&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(),t.removeEventListener("input",r)};t.addEventListener("input",r),t.__ieph=!0}t.setAttribute(e,n)}}var _o={create:mo,update:mo};function bo(t,e){var o=e.elm,i=e.data,a=t.data;if(!(n(i.staticClass)&&n(i.class)&&(n(a)||n(a.staticClass)&&n(a.class)))){var s=Ur(e),c=o._transitionClasses;r(c)&&(s=Vr(s,Kr(c))),s!==o._prevClass&&(o.setAttribute("class",s),o._prevClass=s)}}var $o,wo,xo,Co,ko,So,Oo={create:bo,update:bo},To=/[\w).+\-_$\]]/;function Ao(t){var e,n,r,o,i,a=!1,s=!1,c=!1,u=!1,l=0,f=0,d=0,p=0;for(r=0;r<t.length;r++)if(n=e,e=t.charCodeAt(r),a)39===e&&92!==n&&(a=!1);else if(s)34===e&&92!==n&&(s=!1);else if(c)96===e&&92!==n&&(c=!1);else if(u)47===e&&92!==n&&(u=!1);else if(124!==e||124===t.charCodeAt(r+1)||124===t.charCodeAt(r-1)||l||f||d){switch(e){case 34:s=!0;break;case 39:a=!0;break;case 96:c=!0;break;case 40:d++;break;case 41:d--;break;case 91:f++;break;case 93:f--;break;case 123:l++;break;case 125:l--}if(47===e){for(var v=r-1,h=void 0;v>=0&&" "===(h=t.charAt(v));v--);h&&To.test(h)||(u=!0)}}else void 0===o?(p=r+1,o=t.slice(0,r).trim()):m();function m(){(i||(i=[])).push(t.slice(p,r).trim()),p=r+1}if(void 0===o?o=t.slice(0,r).trim():0!==p&&m(),i)for(r=0;r<i.length;r++)o=jo(o,i[r]);return o}function jo(t,e){var n=e.indexOf("(");if(n<0)return'_f("'.concat(e,'")(').concat(t,")");var r=e.slice(0,n),o=e.slice(n+1);return'_f("'.concat(r,'")(').concat(t).concat(")"!==o?","+o:o)}function Eo(t,e){console.error("[Vue compiler]: ".concat(t))}function No(t,e){return t?t.map((function(t){return t[e]})).filter((function(t){return t})):[]}function Po(t,e,n,r,o){(t.props||(t.props=[])).push(Uo({name:e,value:n,dynamic:o},r)),t.plain=!1}function Do(t,e,n,r,o){(o?t.dynamicAttrs||(t.dynamicAttrs=[]):t.attrs||(t.attrs=[])).push(Uo({name:e,value:n,dynamic:o},r)),t.plain=!1}function Mo(t,e,n,r){t.attrsMap[e]=n,t.attrsList.push(Uo({name:e,value:n},r))}function Io(t,e,n,r,o,i,a,s){(t.directives||(t.directives=[])).push(Uo({name:e,rawName:n,value:r,arg:o,isDynamicArg:i,modifiers:a},s)),t.plain=!1}function Lo(t,e,n){return n?"_p(".concat(e,',"').concat(t,'")'):t+e}function Ro(e,n,r,o,i,a,s,c){var u;(o=o||t).right?c?n="(".concat(n,")==='click'?'contextmenu':(").concat(n,")"):"click"===n&&(n="contextmenu",delete o.right):o.middle&&(c?n="(".concat(n,")==='click'?'mouseup':(").concat(n,")"):"click"===n&&(n="mouseup")),o.capture&&(delete o.capture,n=Lo("!",n,c)),o.once&&(delete o.once,n=Lo("~",n,c)),o.passive&&(delete o.passive,n=Lo("&",n,c)),o.native?(delete o.native,u=e.nativeEvents||(e.nativeEvents={})):u=e.events||(e.events={});var l=Uo({value:r.trim(),dynamic:c},s);o!==t&&(l.modifiers=o);var f=u[n];Array.isArray(f)?i?f.unshift(l):f.push(l):u[n]=f?i?[l,f]:[f,l]:l,e.plain=!1}function Fo(t,e,n){var r=Ho(t,":"+e)||Ho(t,"v-bind:"+e);if(null!=r)return Ao(r);if(!1!==n){var o=Ho(t,e);if(null!=o)return JSON.stringify(o)}}function Ho(t,e,n){var r;if(null!=(r=t.attrsMap[e]))for(var o=t.attrsList,i=0,a=o.length;i<a;i++)if(o[i].name===e){o.splice(i,1);break}return n&&delete t.attrsMap[e],r}function Bo(t,e){for(var n=t.attrsList,r=0,o=n.length;r<o;r++){var i=n[r];if(e.test(i.name))return n.splice(r,1),i}}function Uo(t,e){return e&&(null!=e.start&&(t.start=e.start),null!=e.end&&(t.end=e.end)),t}function zo(t,e,n){var r=n||{},o=r.number,i="$$v",a=i;r.trim&&(a="(typeof ".concat(i," === 'string'")+"? ".concat(i,".trim()")+": ".concat(i,")")),o&&(a="_n(".concat(a,")"));var s=Vo(e,a);t.model={value:"(".concat(e,")"),expression:JSON.stringify(e),callback:"function (".concat(i,") {").concat(s,"}")}}function Vo(t,e){var n=function(t){if(t=t.trim(),$o=t.length,t.indexOf("[")<0||t.lastIndexOf("]")<$o-1)return(Co=t.lastIndexOf("."))>-1?{exp:t.slice(0,Co),key:'"'+t.slice(Co+1)+'"'}:{exp:t,key:null};wo=t,Co=ko=So=0;for(;!Jo();)qo(xo=Ko())?Zo(xo):91===xo&&Wo(xo);return{exp:t.slice(0,ko),key:t.slice(ko+1,So)}}(t);return null===n.key?"".concat(t,"=").concat(e):"$set(".concat(n.exp,", ").concat(n.key,", ").concat(e,")")}function Ko(){return wo.charCodeAt(++Co)}function Jo(){return Co>=$o}function qo(t){return 34===t||39===t}function Wo(t){var e=1;for(ko=Co;!Jo();)if(qo(t=Ko()))Zo(t);else if(91===t&&e++,93===t&&e--,0===e){So=Co;break}}function Zo(t){for(var e=t;!Jo()&&(t=Ko())!==e;);}var Go,Xo="__r";function Yo(t,e,n){var r=Go;return function o(){var i=e.apply(null,arguments);null!==i&&ei(t,o,n,r)}}var Qo=hn&&!(Q&&Number(Q[1])<=53);function ti(t,e,n,r){if(Qo){var o=qe,i=e;e=i._wrapper=function(t){if(t.target===t.currentTarget||t.timeStamp>=o||t.timeStamp<=0||t.target.ownerDocument!==document)return i.apply(this,arguments)}}Go.addEventListener(t,e,et?{capture:n,passive:r}:n)}function ei(t,e,n,r){(r||Go).removeEventListener(t,e._wrapper||e,n)}function ni(t,e){if(!n(t.data.on)||!n(e.data.on)){var o=e.data.on||{},i=t.data.on||{};Go=e.elm||t.elm,function(t){if(r(t.__r)){var e=W?"change":"input";t[e]=[].concat(t.__r,t[e]||[]),delete t.__r}r(t.__c)&&(t.change=[].concat(t.__c,t.change||[]),delete t.__c)}(o),qt(o,i,ti,ei,Yo,e.context),Go=void 0}}var ri,oi={create:ni,update:ni,destroy:function(t){return ni(t,oo)}};function ii(t,e){if(!n(t.data.domProps)||!n(e.data.domProps)){var i,a,s=e.elm,c=t.data.domProps||{},u=e.data.domProps||{};for(i in(r(u.__ob__)||o(u._v_attr_proxy))&&(u=e.data.domProps=T({},u)),c)i in u||(s[i]="");for(i in u){if(a=u[i],"textContent"===i||"innerHTML"===i){if(e.children&&(e.children.length=0),a===c[i])continue;1===s.childNodes.length&&s.removeChild(s.childNodes[0])}if("value"===i&&"PROGRESS"!==s.tagName){s._value=a;var l=n(a)?"":String(a);ai(s,l)&&(s.value=l)}else if("innerHTML"===i&&Wr(s.tagName)&&n(s.innerHTML)){(ri=ri||document.createElement("div")).innerHTML="<svg>".concat(a,"</svg>");for(var f=ri.firstChild;s.firstChild;)s.removeChild(s.firstChild);for(;f.firstChild;)s.appendChild(f.firstChild)}else if(a!==c[i])try{s[i]=a}catch(t){}}}}function ai(t,e){return!t.composing&&("OPTION"===t.tagName||function(t,e){var n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,e)||function(t,e){var n=t.value,o=t._vModifiers;if(r(o)){if(o.number)return p(n)!==p(e);if(o.trim)return n.trim()!==e.trim()}return n!==e}(t,e))}var si={create:ii,update:ii},ci=b((function(t){var e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach((function(t){if(t){var r=t.split(n);r.length>1&&(e[r[0].trim()]=r[1].trim())}})),e}));function ui(t){var e=li(t.style);return t.staticStyle?T(t.staticStyle,e):e}function li(t){return Array.isArray(t)?A(t):"string"==typeof t?ci(t):t}var fi,di=/^--/,pi=/\s*!important$/,vi=function(t,e,n){if(di.test(e))t.style.setProperty(e,n);else if(pi.test(n))t.style.setProperty(k(e),n.replace(pi,""),"important");else{var r=mi(e);if(Array.isArray(n))for(var o=0,i=n.length;o<i;o++)t.style[r]=n[o];else t.style[r]=n}},hi=["Webkit","Moz","ms"],mi=b((function(t){if(fi=fi||document.createElement("div").style,"filter"!==(t=w(t))&&t in fi)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<hi.length;n++){var r=hi[n]+e;if(r in fi)return r}}));function gi(t,e){var o=e.data,i=t.data;if(!(n(o.staticStyle)&&n(o.style)&&n(i.staticStyle)&&n(i.style))){var a,s,c=e.elm,u=i.staticStyle,l=i.normalizedStyle||i.style||{},f=u||l,d=li(e.data.style)||{};e.data.normalizedStyle=r(d.__ob__)?T({},d):d;var p=function(t,e){var n,r={};if(e)for(var o=t;o.componentInstance;)(o=o.componentInstance._vnode)&&o.data&&(n=ui(o.data))&&T(r,n);(n=ui(t.data))&&T(r,n);for(var i=t;i=i.parent;)i.data&&(n=ui(i.data))&&T(r,n);return r}(e,!0);for(s in f)n(p[s])&&vi(c,s,"");for(s in p)(a=p[s])!==f[s]&&vi(c,s,null==a?"":a)}}var yi={create:gi,update:gi},_i=/\s+/;function bi(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(_i).forEach((function(e){return t.classList.add(e)})):t.classList.add(e);else{var n=" ".concat(t.getAttribute("class")||""," ");n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function $i(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(_i).forEach((function(e){return t.classList.remove(e)})):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{for(var n=" ".concat(t.getAttribute("class")||""," "),r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?t.setAttribute("class",n):t.removeAttribute("class")}}function wi(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&T(e,xi(t.name||"v")),T(e,t),e}return"string"==typeof t?xi(t):void 0}}var xi=b((function(t){return{enterClass:"".concat(t,"-enter"),enterToClass:"".concat(t,"-enter-to"),enterActiveClass:"".concat(t,"-enter-active"),leaveClass:"".concat(t,"-leave"),leaveToClass:"".concat(t,"-leave-to"),leaveActiveClass:"".concat(t,"-leave-active")}})),Ci=J&&!Z,ki="transition",Si="animation",Oi="transition",Ti="transitionend",Ai="animation",ji="animationend";Ci&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Oi="WebkitTransition",Ti="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Ai="WebkitAnimation",ji="webkitAnimationEnd"));var Ei=J?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()};function Ni(t){Ei((function(){Ei(t)}))}function Pi(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),bi(t,e))}function Di(t,e){t._transitionClasses&&g(t._transitionClasses,e),$i(t,e)}function Mi(t,e,n){var r=Li(t,e),o=r.type,i=r.timeout,a=r.propCount;if(!o)return n();var s=o===ki?Ti:ji,c=0,u=function(){t.removeEventListener(s,l),n()},l=function(e){e.target===t&&++c>=a&&u()};setTimeout((function(){c<a&&u()}),i+1),t.addEventListener(s,l)}var Ii=/\b(transform|all)(,|$)/;function Li(t,e){var n,r=window.getComputedStyle(t),o=(r[Oi+"Delay"]||"").split(", "),i=(r[Oi+"Duration"]||"").split(", "),a=Ri(o,i),s=(r[Ai+"Delay"]||"").split(", "),c=(r[Ai+"Duration"]||"").split(", "),u=Ri(s,c),l=0,f=0;return e===ki?a>0&&(n=ki,l=a,f=i.length):e===Si?u>0&&(n=Si,l=u,f=c.length):f=(n=(l=Math.max(a,u))>0?a>u?ki:Si:null)?n===ki?i.length:c.length:0,{type:n,timeout:l,propCount:f,hasTransform:n===ki&&Ii.test(r[Oi+"Property"])}}function Ri(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map((function(e,n){return Fi(e)+Fi(t[n])})))}function Fi(t){return 1e3*Number(t.slice(0,-1).replace(",","."))}function Hi(t,e){var o=t.elm;r(o._leaveCb)&&(o._leaveCb.cancelled=!0,o._leaveCb());var i=wi(t.data.transition);if(!n(i)&&!r(o._enterCb)&&1===o.nodeType){for(var c=i.css,u=i.type,l=i.enterClass,f=i.enterToClass,d=i.enterActiveClass,v=i.appearClass,h=i.appearToClass,m=i.appearActiveClass,g=i.beforeEnter,y=i.enter,_=i.afterEnter,b=i.enterCancelled,$=i.beforeAppear,w=i.appear,x=i.afterAppear,C=i.appearCancelled,k=i.duration,S=Me,O=Me.$vnode;O&&O.parent;)S=O.context,O=O.parent;var T=!S._isMounted||!t.isRootInsert;if(!T||w||""===w){var A=T&&v?v:l,j=T&&m?m:d,E=T&&h?h:f,N=T&&$||g,P=T&&a(w)?w:y,D=T&&x||_,I=T&&C||b,L=p(s(k)?k.enter:k),R=!1!==c&&!Z,F=zi(P),H=o._enterCb=M((function(){R&&(Di(o,E),Di(o,j)),H.cancelled?(R&&Di(o,A),I&&I(o)):D&&D(o),o._enterCb=null}));t.data.show||Wt(t,"insert",(function(){var e=o.parentNode,n=e&&e._pending&&e._pending[t.key];n&&n.tag===t.tag&&n.elm._leaveCb&&n.elm._leaveCb(),P&&P(o,H)})),N&&N(o),R&&(Pi(o,A),Pi(o,j),Ni((function(){Di(o,A),H.cancelled||(Pi(o,E),F||(Ui(L)?setTimeout(H,L):Mi(o,u,H)))}))),t.data.show&&(e&&e(),P&&P(o,H)),R||F||H()}}}function Bi(t,e){var o=t.elm;r(o._enterCb)&&(o._enterCb.cancelled=!0,o._enterCb());var i=wi(t.data.transition);if(n(i)||1!==o.nodeType)return e();if(!r(o._leaveCb)){var a=i.css,c=i.type,u=i.leaveClass,l=i.leaveToClass,f=i.leaveActiveClass,d=i.beforeLeave,v=i.leave,h=i.afterLeave,m=i.leaveCancelled,g=i.delayLeave,y=i.duration,_=!1!==a&&!Z,b=zi(v),$=p(s(y)?y.leave:y),w=o._leaveCb=M((function(){o.parentNode&&o.parentNode._pending&&(o.parentNode._pending[t.key]=null),_&&(Di(o,l),Di(o,f)),w.cancelled?(_&&Di(o,u),m&&m(o)):(e(),h&&h(o)),o._leaveCb=null}));g?g(x):x()}function x(){w.cancelled||(!t.data.show&&o.parentNode&&((o.parentNode._pending||(o.parentNode._pending={}))[t.key]=t),d&&d(o),_&&(Pi(o,u),Pi(o,f),Ni((function(){Di(o,u),w.cancelled||(Pi(o,l),b||(Ui($)?setTimeout(w,$):Mi(o,c,w)))}))),v&&v(o,w),_||b||w())}}function Ui(t){return"number"==typeof t&&!isNaN(t)}function zi(t){if(n(t))return!1;var e=t.fns;return r(e)?zi(Array.isArray(e)?e[0]:e):(t._length||t.length)>1}function Vi(t,e){!0!==e.data.show&&Hi(e)}var Ki=function(t){var a,s,c={},u=t.modules,l=t.nodeOps;for(a=0;a<io.length;++a)for(c[io[a]]=[],s=0;s<u.length;++s)r(u[s][io[a]])&&c[io[a]].push(u[s][io[a]]);function f(t){var e=l.parentNode(t);r(e)&&l.removeChild(e,t)}function d(t,e,n,i,a,s,u){if(r(t.elm)&&r(s)&&(t=s[u]=pt(t)),t.isRootInsert=!a,!function(t,e,n,i){var a=t.data;if(r(a)){var s=r(t.componentInstance)&&a.keepAlive;if(r(a=a.hook)&&r(a=a.init)&&a(t,!1),r(t.componentInstance))return p(t,e),h(n,t.elm,i),o(s)&&function(t,e,n,o){var i,a=t;for(;a.componentInstance;)if(r(i=(a=a.componentInstance._vnode).data)&&r(i=i.transition)){for(i=0;i<c.activate.length;++i)c.activate[i](oo,a);e.push(a);break}h(n,t.elm,o)}(t,e,n,i),!0}}(t,e,n,i)){var f=t.data,d=t.children,v=t.tag;r(v)?(t.elm=t.ns?l.createElementNS(t.ns,v):l.createElement(v,t),_(t),m(t,d,e),r(f)&&y(t,e),h(n,t.elm,i)):o(t.isComment)?(t.elm=l.createComment(t.text),h(n,t.elm,i)):(t.elm=l.createTextNode(t.text),h(n,t.elm,i))}}function p(t,e){r(t.data.pendingInsert)&&(e.push.apply(e,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,g(t)?(y(t,e),_(t)):(no(t),e.push(t))}function h(t,e,n){r(t)&&(r(n)?l.parentNode(n)===t&&l.insertBefore(t,e,n):l.appendChild(t,e))}function m(t,n,r){if(e(n))for(var o=0;o<n.length;++o)d(n[o],r,t.elm,null,!0,n,o);else i(t.text)&&l.appendChild(t.elm,l.createTextNode(String(t.text)))}function g(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return r(t.tag)}function y(t,e){for(var n=0;n<c.create.length;++n)c.create[n](oo,t);r(a=t.data.hook)&&(r(a.create)&&a.create(oo,t),r(a.insert)&&e.push(t))}function _(t){var e;if(r(e=t.fnScopeId))l.setStyleScope(t.elm,e);else for(var n=t;n;)r(e=n.context)&&r(e=e.$options._scopeId)&&l.setStyleScope(t.elm,e),n=n.parent;r(e=Me)&&e!==t.context&&e!==t.fnContext&&r(e=e.$options._scopeId)&&l.setStyleScope(t.elm,e)}function b(t,e,n,r,o,i){for(;r<=o;++r)d(n[r],i,t,e,!1,n,r)}function $(t){var e,n,o=t.data;if(r(o))for(r(e=o.hook)&&r(e=e.destroy)&&e(t),e=0;e<c.destroy.length;++e)c.destroy[e](t);if(r(e=t.children))for(n=0;n<t.children.length;++n)$(t.children[n])}function w(t,e,n){for(;e<=n;++e){var o=t[e];r(o)&&(r(o.tag)?(x(o),$(o)):f(o.elm))}}function x(t,e){if(r(e)||r(t.data)){var n,o=c.remove.length+1;for(r(e)?e.listeners+=o:e=function(t,e){function n(){0==--n.listeners&&f(t)}return n.listeners=e,n}(t.elm,o),r(n=t.componentInstance)&&r(n=n._vnode)&&r(n.data)&&x(n,e),n=0;n<c.remove.length;++n)c.remove[n](t,e);r(n=t.data.hook)&&r(n=n.remove)?n(t,e):e()}else f(t.elm)}function C(t,e,n,o){for(var i=n;i<o;i++){var a=e[i];if(r(a)&&ao(t,a))return i}}function k(t,e,i,a,s,u){if(t!==e){r(e.elm)&&r(a)&&(e=a[s]=pt(e));var f=e.elm=t.elm;if(o(t.isAsyncPlaceholder))r(e.asyncFactory.resolved)?T(t.elm,e,i):e.isAsyncPlaceholder=!0;else if(o(e.isStatic)&&o(t.isStatic)&&e.key===t.key&&(o(e.isCloned)||o(e.isOnce)))e.componentInstance=t.componentInstance;else{var p,v=e.data;r(v)&&r(p=v.hook)&&r(p=p.prepatch)&&p(t,e);var h=t.children,m=e.children;if(r(v)&&g(e)){for(p=0;p<c.update.length;++p)c.update[p](t,e);r(p=v.hook)&&r(p=p.update)&&p(t,e)}n(e.text)?r(h)&&r(m)?h!==m&&function(t,e,o,i,a){for(var s,c,u,f=0,p=0,v=e.length-1,h=e[0],m=e[v],g=o.length-1,y=o[0],_=o[g],$=!a;f<=v&&p<=g;)n(h)?h=e[++f]:n(m)?m=e[--v]:ao(h,y)?(k(h,y,i,o,p),h=e[++f],y=o[++p]):ao(m,_)?(k(m,_,i,o,g),m=e[--v],_=o[--g]):ao(h,_)?(k(h,_,i,o,g),$&&l.insertBefore(t,h.elm,l.nextSibling(m.elm)),h=e[++f],_=o[--g]):ao(m,y)?(k(m,y,i,o,p),$&&l.insertBefore(t,m.elm,h.elm),m=e[--v],y=o[++p]):(n(s)&&(s=so(e,f,v)),n(c=r(y.key)?s[y.key]:C(y,e,f,v))?d(y,i,t,h.elm,!1,o,p):ao(u=e[c],y)?(k(u,y,i,o,p),e[c]=void 0,$&&l.insertBefore(t,u.elm,h.elm)):d(y,i,t,h.elm,!1,o,p),y=o[++p]);f>v?b(t,n(o[g+1])?null:o[g+1].elm,o,p,g,i):p>g&&w(e,f,v)}(f,h,m,i,u):r(m)?(r(t.text)&&l.setTextContent(f,""),b(f,null,m,0,m.length-1,i)):r(h)?w(h,0,h.length-1):r(t.text)&&l.setTextContent(f,""):t.text!==e.text&&l.setTextContent(f,e.text),r(v)&&r(p=v.hook)&&r(p=p.postpatch)&&p(t,e)}}}function S(t,e,n){if(o(n)&&r(t.parent))t.parent.data.pendingInsert=e;else for(var i=0;i<e.length;++i)e[i].data.hook.insert(e[i])}var O=v("attrs,class,staticClass,staticStyle,key");function T(t,e,n,i){var a,s=e.tag,c=e.data,u=e.children;if(i=i||c&&c.pre,e.elm=t,o(e.isComment)&&r(e.asyncFactory))return e.isAsyncPlaceholder=!0,!0;if(r(c)&&(r(a=c.hook)&&r(a=a.init)&&a(e,!0),r(a=e.componentInstance)))return p(e,n),!0;if(r(s)){if(r(u))if(t.hasChildNodes())if(r(a=c)&&r(a=a.domProps)&&r(a=a.innerHTML)){if(a!==t.innerHTML)return!1}else{for(var l=!0,f=t.firstChild,d=0;d<u.length;d++){if(!f||!T(f,u[d],n,i)){l=!1;break}f=f.nextSibling}if(!l||f)return!1}else m(e,u,n);if(r(c)){var v=!1;for(var h in c)if(!O(h)){v=!0,y(e,n);break}!v&&c.class&&Hn(c.class)}}else t.data!==e.text&&(t.data=e.text);return!0}return function(t,e,i,a){if(!n(e)){var s,u=!1,f=[];if(n(t))u=!0,d(e,f);else{var p=r(t.nodeType);if(!p&&ao(t,e))k(t,e,f,null,null,a);else{if(p){if(1===t.nodeType&&t.hasAttribute(L)&&(t.removeAttribute(L),i=!0),o(i)&&T(t,e,f))return S(e,f,!0),t;s=t,t=new lt(l.tagName(s).toLowerCase(),{},[],void 0,s)}var v=t.elm,h=l.parentNode(v);if(d(e,f,v._leaveCb?null:h,l.nextSibling(v)),r(e.parent))for(var m=e.parent,y=g(e);m;){for(var _=0;_<c.destroy.length;++_)c.destroy[_](m);if(m.elm=e.elm,y){for(var b=0;b<c.create.length;++b)c.create[b](oo,m);var x=m.data.hook.insert;if(x.merged)for(var C=1;C<x.fns.length;C++)x.fns[C]()}else no(m);m=m.parent}r(h)?w([t],0,0):r(t.tag)&&$(t)}}return S(e,f,u),e.elm}r(t)&&$(t)}}({nodeOps:to,modules:[_o,Oo,oi,si,yi,J?{create:Vi,activate:Vi,remove:function(t,e){!0!==t.data.show?Bi(t,e):e()}}:{}].concat(ho)});Z&&document.addEventListener("selectionchange",(function(){var t=document.activeElement;t&&t.vmodel&&Qi(t,"input")}));var Ji={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?Wt(n,"postpatch",(function(){Ji.componentUpdated(t,e,n)})):qi(t,e,n.context),t._vOptions=[].map.call(t.options,Gi)):("textarea"===n.tag||Yr(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("compositionstart",Xi),t.addEventListener("compositionend",Yi),t.addEventListener("change",Yi),Z&&(t.vmodel=!0)))},componentUpdated:function(t,e,n){if("select"===n.tag){qi(t,e,n.context);var r=t._vOptions,o=t._vOptions=[].map.call(t.options,Gi);if(o.some((function(t,e){return!P(t,r[e])})))(t.multiple?e.value.some((function(t){return Zi(t,o)})):e.value!==e.oldValue&&Zi(e.value,o))&&Qi(t,"change")}}};function qi(t,e,n){Wi(t,e),(W||G)&&setTimeout((function(){Wi(t,e)}),0)}function Wi(t,e,n){var r=e.value,o=t.multiple;if(!o||Array.isArray(r)){for(var i,a,s=0,c=t.options.length;s<c;s++)if(a=t.options[s],o)i=D(r,Gi(a))>-1,a.selected!==i&&(a.selected=i);else if(P(Gi(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));o||(t.selectedIndex=-1)}}function Zi(t,e){return e.every((function(e){return!P(e,t)}))}function Gi(t){return"_value"in t?t._value:t.value}function Xi(t){t.target.composing=!0}function Yi(t){t.target.composing&&(t.target.composing=!1,Qi(t.target,"input"))}function Qi(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function ta(t){return!t.componentInstance||t.data&&t.data.transition?t:ta(t.componentInstance._vnode)}var ea={bind:function(t,e,n){var r=e.value,o=(n=ta(n)).data&&n.data.transition,i=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&o?(n.data.show=!0,Hi(n,(function(){t.style.display=i}))):t.style.display=r?i:"none"},update:function(t,e,n){var r=e.value;!r!=!e.oldValue&&((n=ta(n)).data&&n.data.transition?(n.data.show=!0,r?Hi(n,(function(){t.style.display=t.__vOriginalDisplay})):Bi(n,(function(){t.style.display="none"}))):t.style.display=r?t.__vOriginalDisplay:"none")},unbind:function(t,e,n,r,o){o||(t.style.display=t.__vOriginalDisplay)}},na={model:Ji,show:ea},ra={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function oa(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?oa(je(e.children)):t}function ia(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var o=n._parentListeners;for(var r in o)e[w(r)]=o[r];return e}function aa(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}var sa=function(t){return t.tag||ye(t)},ca=function(t){return"show"===t.name},ua={name:"transition",props:ra,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(sa)).length){var r=this.mode,o=n[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return o;var a=oa(o);if(!a)return o;if(this._leaving)return aa(t,o);var s="__transition-".concat(this._uid,"-");a.key=null==a.key?a.isComment?s+"comment":s+a.tag:i(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=ia(this),u=this._vnode,l=oa(u);if(a.data.directives&&a.data.directives.some(ca)&&(a.data.show=!0),l&&l.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(a,l)&&!ye(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=T({},c);if("out-in"===r)return this._leaving=!0,Wt(f,"afterLeave",(function(){e._leaving=!1,e.$forceUpdate()})),aa(t,o);if("in-out"===r){if(ye(a))return u;var d,p=function(){d()};Wt(c,"afterEnter",p),Wt(c,"enterCancelled",p),Wt(f,"delayLeave",(function(t){d=t}))}}return o}}},la=T({tag:String,moveClass:String},ra);delete la.mode;var fa={props:la,beforeMount:function(){var t=this,e=this._update;this._update=function(n,r){var o=Ie(t);t.__patch__(t._vnode,t.kept,!1,!0),t._vnode=t.kept,o(),e.call(t,n,r)}},render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,o=this.$slots.default||[],i=this.children=[],a=ia(this),s=0;s<o.length;s++){(l=o[s]).tag&&null!=l.key&&0!==String(l.key).indexOf("__vlist")&&(i.push(l),n[l.key]=l,(l.data||(l.data={})).transition=a)}if(r){var c=[],u=[];for(s=0;s<r.length;s++){var l;(l=r[s]).data.transition=a,l.data.pos=l.elm.getBoundingClientRect(),n[l.key]?c.push(l):u.push(l)}this.kept=t(e,null,c),this.removed=u}return t(e,null,i)},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(da),t.forEach(pa),t.forEach(va),this._reflow=document.body.offsetHeight,t.forEach((function(t){if(t.data.moved){var n=t.elm,r=n.style;Pi(n,e),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Ti,n._moveCb=function t(r){r&&r.target!==n||r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Ti,t),n._moveCb=null,Di(n,e))})}})))},methods:{hasMove:function(t,e){if(!Ci)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach((function(t){$i(n,t)})),bi(n,e),n.style.display="none",this.$el.appendChild(n);var r=Li(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}};function da(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function pa(t){t.data.newPos=t.elm.getBoundingClientRect()}function va(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,o=e.top-n.top;if(r||o){t.data.moved=!0;var i=t.elm.style;i.transform=i.WebkitTransform="translate(".concat(r,"px,").concat(o,"px)"),i.transitionDuration="0s"}}var ha={Transition:ua,TransitionGroup:fa};xr.config.mustUseProp=Dr,xr.config.isReservedTag=Zr,xr.config.isReservedAttr=Nr,xr.config.getTagNamespace=Gr,xr.config.isUnknownElement=function(t){if(!J)return!0;if(Zr(t))return!1;if(t=t.toLowerCase(),null!=Xr[t])return Xr[t];var e=document.createElement(t);return t.indexOf("-")>-1?Xr[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Xr[t]=/HTMLUnknownElement/.test(e.toString())},T(xr.options.directives,na),T(xr.options.components,ha),xr.prototype.__patch__=J?Ki:j,xr.prototype.$mount=function(t,e){return function(t,e,n){var r;t.$el=e,t.$options.render||(t.$options.render=ft),He(t,"beforeMount"),r=function(){t._update(t._render(),n)},new zn(t,r,j,{before:function(){t._isMounted&&!t._isDestroyed&&He(t,"beforeUpdate")}},!0),n=!1;var o=t._preWatchers;if(o)for(var i=0;i<o.length;i++)o[i].run();return null==t.$vnode&&(t._isMounted=!0,He(t,"mounted")),t}(this,t=t&&J?Qr(t):void 0,e)},J&&setTimeout((function(){H.devtools&&ot&&ot.emit("init",xr)}),0);var ma=/\{\{((?:.|\r?\n)+?)\}\}/g,ga=/[-.*+?^${}()|[\]\/\\]/g,ya=b((function(t){var e=t[0].replace(ga,"\\$&"),n=t[1].replace(ga,"\\$&");return new RegExp(e+"((?:.|\\n)+?)"+n,"g")}));var _a={staticKeys:["staticClass"],transformNode:function(t,e){e.warn;var n=Ho(t,"class");n&&(t.staticClass=JSON.stringify(n.replace(/\s+/g," ").trim()));var r=Fo(t,"class",!1);r&&(t.classBinding=r)},genData:function(t){var e="";return t.staticClass&&(e+="staticClass:".concat(t.staticClass,",")),t.classBinding&&(e+="class:".concat(t.classBinding,",")),e}};var ba,$a={staticKeys:["staticStyle"],transformNode:function(t,e){e.warn;var n=Ho(t,"style");n&&(t.staticStyle=JSON.stringify(ci(n)));var r=Fo(t,"style",!1);r&&(t.styleBinding=r)},genData:function(t){var e="";return t.staticStyle&&(e+="staticStyle:".concat(t.staticStyle,",")),t.styleBinding&&(e+="style:(".concat(t.styleBinding,"),")),e}},wa=function(t){return(ba=ba||document.createElement("div")).innerHTML=t,ba.textContent},xa=v("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),Ca=v("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),ka=v("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),Sa=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,Oa=/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,Ta="[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(B.source,"]*"),Aa="((?:".concat(Ta,"\\:)?").concat(Ta,")"),ja=new RegExp("^<".concat(Aa)),Ea=/^\s*(\/?)>/,Na=new RegExp("^<\\/".concat(Aa,"[^>]*>")),Pa=/^<!DOCTYPE [^>]+>/i,Da=/^<!\--/,Ma=/^<!\[/,Ia=v("script,style,textarea",!0),La={},Ra={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t","&#39;":"'"},Fa=/&(?:lt|gt|quot|amp|#39);/g,Ha=/&(?:lt|gt|quot|amp|#39|#10|#9);/g,Ba=v("pre,textarea",!0),Ua=function(t,e){return t&&Ba(t)&&"\n"===e[0]};function za(t,e){var n=e?Ha:Fa;return t.replace(n,(function(t){return Ra[t]}))}function Va(t,e){for(var n,r,o=[],i=e.expectHTML,a=e.isUnaryTag||E,s=e.canBeLeftOpenTag||E,c=0,u=function(){if(n=t,r&&Ia(r)){var u=0,d=r.toLowerCase(),p=La[d]||(La[d]=new RegExp("([\\s\\S]*?)(</"+d+"[^>]*>)","i"));w=t.replace(p,(function(t,n,r){return u=r.length,Ia(d)||"noscript"===d||(n=n.replace(/<!\--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Ua(d,n)&&(n=n.slice(1)),e.chars&&e.chars(n),""}));c+=t.length-w.length,t=w,f(d,c-u,c)}else{var v=t.indexOf("<");if(0===v){if(Da.test(t)){var h=t.indexOf("--\x3e");if(h>=0)return e.shouldKeepComment&&e.comment&&e.comment(t.substring(4,h),c,c+h+3),l(h+3),"continue"}if(Ma.test(t)){var m=t.indexOf("]>");if(m>=0)return l(m+2),"continue"}var g=t.match(Pa);if(g)return l(g[0].length),"continue";var y=t.match(Na);if(y){var _=c;return l(y[0].length),f(y[1],_,c),"continue"}var b=function(){var e=t.match(ja);if(e){var n={tagName:e[1],attrs:[],start:c};l(e[0].length);for(var r=void 0,o=void 0;!(r=t.match(Ea))&&(o=t.match(Oa)||t.match(Sa));)o.start=c,l(o[0].length),o.end=c,n.attrs.push(o);if(r)return n.unarySlash=r[1],l(r[0].length),n.end=c,n}}();if(b)return function(t){var n=t.tagName,c=t.unarySlash;i&&("p"===r&&ka(n)&&f(r),s(n)&&r===n&&f(n));for(var u=a(n)||!!c,l=t.attrs.length,d=new Array(l),p=0;p<l;p++){var v=t.attrs[p],h=v[3]||v[4]||v[5]||"",m="a"===n&&"href"===v[1]?e.shouldDecodeNewlinesForHref:e.shouldDecodeNewlines;d[p]={name:v[1],value:za(h,m)}}u||(o.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:d,start:t.start,end:t.end}),r=n);e.start&&e.start(n,d,u,t.start,t.end)}(b),Ua(b.tagName,t)&&l(1),"continue"}var $=void 0,w=void 0,x=void 0;if(v>=0){for(w=t.slice(v);!(Na.test(w)||ja.test(w)||Da.test(w)||Ma.test(w)||(x=w.indexOf("<",1))<0);)v+=x,w=t.slice(v);$=t.substring(0,v)}v<0&&($=t),$&&l($.length),e.chars&&$&&e.chars($,c-$.length,c)}if(t===n)return e.chars&&e.chars(t),"break"};t;){if("break"===u())break}function l(e){c+=e,t=t.substring(e)}function f(t,n,i){var a,s;if(null==n&&(n=c),null==i&&(i=c),t)for(s=t.toLowerCase(),a=o.length-1;a>=0&&o[a].lowerCasedTag!==s;a--);else a=0;if(a>=0){for(var u=o.length-1;u>=a;u--)e.end&&e.end(o[u].tag,n,i);o.length=a,r=a&&o[a-1].tag}else"br"===s?e.start&&e.start(t,[],!0,n,i):"p"===s&&(e.start&&e.start(t,[],!1,n,i),e.end&&e.end(t,n,i))}f()}var Ka,Ja,qa,Wa,Za,Ga,Xa,Ya,Qa=/^@|^v-on:/,ts=/^v-|^@|^:|^#/,es=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,ns=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,rs=/^\(|\)$/g,os=/^\[.*\]$/,is=/:(.*)$/,as=/^:|^\.|^v-bind:/,ss=/\.[^.\]]+(?=[^\]]*$)/g,cs=/^v-slot(:|$)|^#/,us=/[\r\n]/,ls=/[ \f\t\r\n]+/g,fs=b(wa),ds="_empty_";function ps(t,e,n){return{type:1,tag:t,attrsList:e,attrsMap:bs(e),rawAttrsMap:{},parent:n,children:[]}}function vs(t,e){Ka=e.warn||Eo,Ga=e.isPreTag||E,Xa=e.mustUseProp||E,Ya=e.getTagNamespace||E,e.isReservedTag,qa=No(e.modules,"transformNode"),Wa=No(e.modules,"preTransformNode"),Za=No(e.modules,"postTransformNode"),Ja=e.delimiters;var n,r,o=[],i=!1!==e.preserveWhitespace,a=e.whitespace,s=!1,c=!1;function u(t){if(l(t),s||t.processed||(t=hs(t,e)),o.length||t===n||n.if&&(t.elseif||t.else)&&gs(n,{exp:t.elseif,block:t}),r&&!t.forbidden)if(t.elseif||t.else)a=t,u=function(t){for(var e=t.length;e--;){if(1===t[e].type)return t[e];t.pop()}}(r.children),u&&u.if&&gs(u,{exp:a.elseif,block:a});else{if(t.slotScope){var i=t.slotTarget||'"default"';(r.scopedSlots||(r.scopedSlots={}))[i]=t}r.children.push(t),t.parent=r}var a,u;t.children=t.children.filter((function(t){return!t.slotScope})),l(t),t.pre&&(s=!1),Ga(t.tag)&&(c=!1);for(var f=0;f<Za.length;f++)Za[f](t,e)}function l(t){if(!c)for(var e=void 0;(e=t.children[t.children.length-1])&&3===e.type&&" "===e.text;)t.children.pop()}return Va(t,{warn:Ka,expectHTML:e.expectHTML,isUnaryTag:e.isUnaryTag,canBeLeftOpenTag:e.canBeLeftOpenTag,shouldDecodeNewlines:e.shouldDecodeNewlines,shouldDecodeNewlinesForHref:e.shouldDecodeNewlinesForHref,shouldKeepComment:e.comments,outputSourceRange:e.outputSourceRange,start:function(t,i,a,l,f){var d=r&&r.ns||Ya(t);W&&"svg"===d&&(i=function(t){for(var e=[],n=0;n<t.length;n++){var r=t[n];$s.test(r.name)||(r.name=r.name.replace(ws,""),e.push(r))}return e}(i));var p,v=ps(t,i,r);d&&(v.ns=d),"style"!==(p=v).tag&&("script"!==p.tag||p.attrsMap.type&&"text/javascript"!==p.attrsMap.type)||rt()||(v.forbidden=!0);for(var h=0;h<Wa.length;h++)v=Wa[h](v,e)||v;s||(!function(t){null!=Ho(t,"v-pre")&&(t.pre=!0)}(v),v.pre&&(s=!0)),Ga(v.tag)&&(c=!0),s?function(t){var e=t.attrsList,n=e.length;if(n)for(var r=t.attrs=new Array(n),o=0;o<n;o++)r[o]={name:e[o].name,value:JSON.stringify(e[o].value)},null!=e[o].start&&(r[o].start=e[o].start,r[o].end=e[o].end);else t.pre||(t.plain=!0)}(v):v.processed||(ms(v),function(t){var e=Ho(t,"v-if");if(e)t.if=e,gs(t,{exp:e,block:t});else{null!=Ho(t,"v-else")&&(t.else=!0);var n=Ho(t,"v-else-if");n&&(t.elseif=n)}}(v),function(t){null!=Ho(t,"v-once")&&(t.once=!0)}(v)),n||(n=v),a?u(v):(r=v,o.push(v))},end:function(t,e,n){var i=o[o.length-1];o.length-=1,r=o[o.length-1],u(i)},chars:function(t,e,n){if(r&&(!W||"textarea"!==r.tag||r.attrsMap.placeholder!==t)){var o,u=r.children;if(t=c||t.trim()?"script"===(o=r).tag||"style"===o.tag?t:fs(t):u.length?a?"condense"===a&&us.test(t)?"":" ":i?" ":"":""){c||"condense"!==a||(t=t.replace(ls," "));var l=void 0,f=void 0;!s&&" "!==t&&(l=function(t,e){var n=e?ya(e):ma;if(n.test(t)){for(var r,o,i,a=[],s=[],c=n.lastIndex=0;r=n.exec(t);){(o=r.index)>c&&(s.push(i=t.slice(c,o)),a.push(JSON.stringify(i)));var u=Ao(r[1].trim());a.push("_s(".concat(u,")")),s.push({"@binding":u}),c=o+r[0].length}return c<t.length&&(s.push(i=t.slice(c)),a.push(JSON.stringify(i))),{expression:a.join("+"),tokens:s}}}(t,Ja))?f={type:2,expression:l.expression,tokens:l.tokens,text:t}:" "===t&&u.length&&" "===u[u.length-1].text||(f={type:3,text:t}),f&&u.push(f)}}},comment:function(t,e,n){if(r){var o={type:3,text:t,isComment:!0};r.children.push(o)}}}),n}function hs(t,e){var n,r;(r=Fo(n=t,"key"))&&(n.key=r),t.plain=!t.key&&!t.scopedSlots&&!t.attrsList.length,function(t){var e=Fo(t,"ref");e&&(t.ref=e,t.refInFor=function(t){var e=t;for(;e;){if(void 0!==e.for)return!0;e=e.parent}return!1}(t))}(t),function(t){var e;"template"===t.tag?(e=Ho(t,"scope"),t.slotScope=e||Ho(t,"slot-scope")):(e=Ho(t,"slot-scope"))&&(t.slotScope=e);var n=Fo(t,"slot");n&&(t.slotTarget='""'===n?'"default"':n,t.slotTargetDynamic=!(!t.attrsMap[":slot"]&&!t.attrsMap["v-bind:slot"]),"template"===t.tag||t.slotScope||Do(t,"slot",n,function(t,e){return t.rawAttrsMap[":"+e]||t.rawAttrsMap["v-bind:"+e]||t.rawAttrsMap[e]}(t,"slot")));if("template"===t.tag){if(a=Bo(t,cs)){var r=ys(a),o=r.name,i=r.dynamic;t.slotTarget=o,t.slotTargetDynamic=i,t.slotScope=a.value||ds}}else{var a;if(a=Bo(t,cs)){var s=t.scopedSlots||(t.scopedSlots={}),c=ys(a),u=c.name,l=(i=c.dynamic,s[u]=ps("template",[],t));l.slotTarget=u,l.slotTargetDynamic=i,l.children=t.children.filter((function(t){if(!t.slotScope)return t.parent=l,!0})),l.slotScope=a.value||ds,t.children=[],t.plain=!1}}}(t),function(t){"slot"===t.tag&&(t.slotName=Fo(t,"name"))}(t),function(t){var e;(e=Fo(t,"is"))&&(t.component=e);null!=Ho(t,"inline-template")&&(t.inlineTemplate=!0)}(t);for(var o=0;o<qa.length;o++)t=qa[o](t,e)||t;return function(t){var e,n,r,o,i,a,s,c,u=t.attrsList;for(e=0,n=u.length;e<n;e++)if(r=o=u[e].name,i=u[e].value,ts.test(r))if(t.hasBindings=!0,(a=_s(r.replace(ts,"")))&&(r=r.replace(ss,"")),as.test(r))r=r.replace(as,""),i=Ao(i),(c=os.test(r))&&(r=r.slice(1,-1)),a&&(a.prop&&!c&&"innerHtml"===(r=w(r))&&(r="innerHTML"),a.camel&&!c&&(r=w(r)),a.sync&&(s=Vo(i,"$event"),c?Ro(t,'"update:"+('.concat(r,")"),s,null,!1,0,u[e],!0):(Ro(t,"update:".concat(w(r)),s,null,!1,0,u[e]),k(r)!==w(r)&&Ro(t,"update:".concat(k(r)),s,null,!1,0,u[e])))),a&&a.prop||!t.component&&Xa(t.tag,t.attrsMap.type,r)?Po(t,r,i,u[e],c):Do(t,r,i,u[e],c);else if(Qa.test(r))r=r.replace(Qa,""),(c=os.test(r))&&(r=r.slice(1,-1)),Ro(t,r,i,a,!1,0,u[e],c);else{var l=(r=r.replace(ts,"")).match(is),f=l&&l[1];c=!1,f&&(r=r.slice(0,-(f.length+1)),os.test(f)&&(f=f.slice(1,-1),c=!0)),Io(t,r,o,i,f,c,a,u[e])}else Do(t,r,JSON.stringify(i),u[e]),!t.component&&"muted"===r&&Xa(t.tag,t.attrsMap.type,r)&&Po(t,r,"true",u[e])}(t),t}function ms(t){var e;if(e=Ho(t,"v-for")){var n=function(t){var e=t.match(es);if(!e)return;var n={};n.for=e[2].trim();var r=e[1].trim().replace(rs,""),o=r.match(ns);o?(n.alias=r.replace(ns,"").trim(),n.iterator1=o[1].trim(),o[2]&&(n.iterator2=o[2].trim())):n.alias=r;return n}(e);n&&T(t,n)}}function gs(t,e){t.ifConditions||(t.ifConditions=[]),t.ifConditions.push(e)}function ys(t){var e=t.name.replace(cs,"");return e||"#"!==t.name[0]&&(e="default"),os.test(e)?{name:e.slice(1,-1),dynamic:!0}:{name:'"'.concat(e,'"'),dynamic:!1}}function _s(t){var e=t.match(ss);if(e){var n={};return e.forEach((function(t){n[t.slice(1)]=!0})),n}}function bs(t){for(var e={},n=0,r=t.length;n<r;n++)e[t[n].name]=t[n].value;return e}var $s=/^xmlns:NS\d+/,ws=/^NS\d+:/;function xs(t){return ps(t.tag,t.attrsList.slice(),t.parent)}var Cs=[_a,$a,{preTransformNode:function(t,e){if("input"===t.tag){var n=t.attrsMap;if(!n["v-model"])return;var r=void 0;if((n[":type"]||n["v-bind:type"])&&(r=Fo(t,"type")),n.type||r||!n["v-bind"]||(r="(".concat(n["v-bind"],").type")),r){var o=Ho(t,"v-if",!0),i=o?"&&(".concat(o,")"):"",a=null!=Ho(t,"v-else",!0),s=Ho(t,"v-else-if",!0),c=xs(t);ms(c),Mo(c,"type","checkbox"),hs(c,e),c.processed=!0,c.if="(".concat(r,")==='checkbox'")+i,gs(c,{exp:c.if,block:c});var u=xs(t);Ho(u,"v-for",!0),Mo(u,"type","radio"),hs(u,e),gs(c,{exp:"(".concat(r,")==='radio'")+i,block:u});var l=xs(t);return Ho(l,"v-for",!0),Mo(l,":type",r),hs(l,e),gs(c,{exp:o,block:l}),a?c.else=!0:s&&(c.elseif=s),c}}}}];var ks,Ss,Os={model:function(t,e,n){var r=e.value,o=e.modifiers,i=t.tag,a=t.attrsMap.type;if(t.component)return zo(t,r,o),!1;if("select"===i)!function(t,e,n){var r=n&&n.number,o='Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;'+"return ".concat(r?"_n(val)":"val","})"),i="$event.target.multiple ? $$selectedVal : $$selectedVal[0]",a="var $$selectedVal = ".concat(o,";");a="".concat(a," ").concat(Vo(e,i)),Ro(t,"change",a,null,!0)}(t,r,o);else if("input"===i&&"checkbox"===a)!function(t,e,n){var r=n&&n.number,o=Fo(t,"value")||"null",i=Fo(t,"true-value")||"true",a=Fo(t,"false-value")||"false";Po(t,"checked","Array.isArray(".concat(e,")")+"?_i(".concat(e,",").concat(o,")>-1")+("true"===i?":(".concat(e,")"):":_q(".concat(e,",").concat(i,")"))),Ro(t,"change","var $$a=".concat(e,",")+"$$el=$event.target,"+"$$c=$$el.checked?(".concat(i,"):(").concat(a,");")+"if(Array.isArray($$a)){"+"var $$v=".concat(r?"_n("+o+")":o,",")+"$$i=_i($$a,$$v);"+"if($$el.checked){$$i<0&&(".concat(Vo(e,"$$a.concat([$$v])"),")}")+"else{$$i>-1&&(".concat(Vo(e,"$$a.slice(0,$$i).concat($$a.slice($$i+1))"),")}")+"}else{".concat(Vo(e,"$$c"),"}"),null,!0)}(t,r,o);else if("input"===i&&"radio"===a)!function(t,e,n){var r=n&&n.number,o=Fo(t,"value")||"null";o=r?"_n(".concat(o,")"):o,Po(t,"checked","_q(".concat(e,",").concat(o,")")),Ro(t,"change",Vo(e,o),null,!0)}(t,r,o);else if("input"===i||"textarea"===i)!function(t,e,n){var r=t.attrsMap.type,o=n||{},i=o.lazy,a=o.number,s=o.trim,c=!i&&"range"!==r,u=i?"change":"range"===r?Xo:"input",l="$event.target.value";s&&(l="$event.target.value.trim()");a&&(l="_n(".concat(l,")"));var f=Vo(e,l);c&&(f="if($event.target.composing)return;".concat(f));Po(t,"value","(".concat(e,")")),Ro(t,u,f,null,!0),(s||a)&&Ro(t,"blur","$forceUpdate()")}(t,r,o);else if(!H.isReservedTag(i))return zo(t,r,o),!1;return!0},text:function(t,e){e.value&&Po(t,"textContent","_s(".concat(e.value,")"),e)},html:function(t,e){e.value&&Po(t,"innerHTML","_s(".concat(e.value,")"),e)}},Ts={expectHTML:!0,modules:Cs,directives:Os,isPreTag:function(t){return"pre"===t},isUnaryTag:xa,mustUseProp:Dr,canBeLeftOpenTag:Ca,isReservedTag:Zr,getTagNamespace:Gr,staticKeys:function(t){return t.reduce((function(t,e){return t.concat(e.staticKeys||[])}),[]).join(",")}(Cs)},As=b((function(t){return v("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap"+(t?","+t:""))}));function js(t,e){t&&(ks=As(e.staticKeys||""),Ss=e.isReservedTag||E,Es(t),Ns(t,!1))}function Es(t){if(t.static=function(t){if(2===t.type)return!1;if(3===t.type)return!0;return!(!t.pre&&(t.hasBindings||t.if||t.for||h(t.tag)||!Ss(t.tag)||function(t){for(;t.parent;){if("template"!==(t=t.parent).tag)return!1;if(t.for)return!0}return!1}(t)||!Object.keys(t).every(ks)))}(t),1===t.type){if(!Ss(t.tag)&&"slot"!==t.tag&&null==t.attrsMap["inline-template"])return;for(var e=0,n=t.children.length;e<n;e++){var r=t.children[e];Es(r),r.static||(t.static=!1)}if(t.ifConditions)for(e=1,n=t.ifConditions.length;e<n;e++){var o=t.ifConditions[e].block;Es(o),o.static||(t.static=!1)}}}function Ns(t,e){if(1===t.type){if((t.static||t.once)&&(t.staticInFor=e),t.static&&t.children.length&&(1!==t.children.length||3!==t.children[0].type))return void(t.staticRoot=!0);if(t.staticRoot=!1,t.children)for(var n=0,r=t.children.length;n<r;n++)Ns(t.children[n],e||!!t.for);if(t.ifConditions)for(n=1,r=t.ifConditions.length;n<r;n++)Ns(t.ifConditions[n].block,e)}}var Ps=/^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,Ds=/\([^)]*?\);*$/,Ms=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,Is={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},Ls={esc:["Esc","Escape"],tab:"Tab",enter:"Enter",space:[" ","Spacebar"],up:["Up","ArrowUp"],left:["Left","ArrowLeft"],right:["Right","ArrowRight"],down:["Down","ArrowDown"],delete:["Backspace","Delete","Del"]},Rs=function(t){return"if(".concat(t,")return null;")},Fs={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:Rs("$event.target !== $event.currentTarget"),ctrl:Rs("!$event.ctrlKey"),shift:Rs("!$event.shiftKey"),alt:Rs("!$event.altKey"),meta:Rs("!$event.metaKey"),left:Rs("'button' in $event && $event.button !== 0"),middle:Rs("'button' in $event && $event.button !== 1"),right:Rs("'button' in $event && $event.button !== 2")};function Hs(t,e){var n=e?"nativeOn:":"on:",r="",o="";for(var i in t){var a=Bs(t[i]);t[i]&&t[i].dynamic?o+="".concat(i,",").concat(a,","):r+='"'.concat(i,'":').concat(a,",")}return r="{".concat(r.slice(0,-1),"}"),o?n+"_d(".concat(r,",[").concat(o.slice(0,-1),"])"):n+r}function Bs(t){if(!t)return"function(){}";if(Array.isArray(t))return"[".concat(t.map((function(t){return Bs(t)})).join(","),"]");var e=Ms.test(t.value),n=Ps.test(t.value),r=Ms.test(t.value.replace(Ds,""));if(t.modifiers){var o="",i="",a=[],s=function(e){if(Fs[e])i+=Fs[e],Is[e]&&a.push(e);else if("exact"===e){var n=t.modifiers;i+=Rs(["ctrl","shift","alt","meta"].filter((function(t){return!n[t]})).map((function(t){return"$event.".concat(t,"Key")})).join("||"))}else a.push(e)};for(var c in t.modifiers)s(c);a.length&&(o+=function(t){return"if(!$event.type.indexOf('key')&&"+"".concat(t.map(Us).join("&&"),")return null;")}(a)),i&&(o+=i);var u=e?"return ".concat(t.value,".apply(null, arguments)"):n?"return (".concat(t.value,").apply(null, arguments)"):r?"return ".concat(t.value):t.value;return"function($event){".concat(o).concat(u,"}")}return e||n?t.value:"function($event){".concat(r?"return ".concat(t.value):t.value,"}")}function Us(t){var e=parseInt(t,10);if(e)return"$event.keyCode!==".concat(e);var n=Is[t],r=Ls[t];return"_k($event.keyCode,"+"".concat(JSON.stringify(t),",")+"".concat(JSON.stringify(n),",")+"$event.key,"+"".concat(JSON.stringify(r))+")"}var zs={on:function(t,e){t.wrapListeners=function(t){return"_g(".concat(t,",").concat(e.value,")")}},bind:function(t,e){t.wrapData=function(n){return"_b(".concat(n,",'").concat(t.tag,"',").concat(e.value,",").concat(e.modifiers&&e.modifiers.prop?"true":"false").concat(e.modifiers&&e.modifiers.sync?",true":"",")")}},cloak:j},Vs=function(t){this.options=t,this.warn=t.warn||Eo,this.transforms=No(t.modules,"transformCode"),this.dataGenFns=No(t.modules,"genData"),this.directives=T(T({},zs),t.directives);var e=t.isReservedTag||E;this.maybeComponent=function(t){return!!t.component||!e(t.tag)},this.onceId=0,this.staticRenderFns=[],this.pre=!1};function Ks(t,e){var n=new Vs(e),r=t?"script"===t.tag?"null":Js(t,n):'_c("div")';return{render:"with(this){return ".concat(r,"}"),staticRenderFns:n.staticRenderFns}}function Js(t,e){if(t.parent&&(t.pre=t.pre||t.parent.pre),t.staticRoot&&!t.staticProcessed)return qs(t,e);if(t.once&&!t.onceProcessed)return Ws(t,e);if(t.for&&!t.forProcessed)return Xs(t,e);if(t.if&&!t.ifProcessed)return Zs(t,e);if("template"!==t.tag||t.slotTarget||e.pre){if("slot"===t.tag)return function(t,e){var n=t.slotName||'"default"',r=ec(t,e),o="_t(".concat(n).concat(r?",function(){return ".concat(r,"}"):""),i=t.attrs||t.dynamicAttrs?oc((t.attrs||[]).concat(t.dynamicAttrs||[]).map((function(t){return{name:w(t.name),value:t.value,dynamic:t.dynamic}}))):null,a=t.attrsMap["v-bind"];!i&&!a||r||(o+=",null");i&&(o+=",".concat(i));a&&(o+="".concat(i?"":",null",",").concat(a));return o+")"}(t,e);var n=void 0;if(t.component)n=function(t,e,n){var r=e.inlineTemplate?null:ec(e,n,!0);return"_c(".concat(t,",").concat(Ys(e,n)).concat(r?",".concat(r):"",")")}(t.component,t,e);else{var r=void 0,o=e.maybeComponent(t);(!t.plain||t.pre&&o)&&(r=Ys(t,e));var i=void 0,a=e.options.bindings;o&&a&&!1!==a.__isScriptSetup&&(i=function(t,e){var n=w(e),r=x(n),o=function(o){return t[e]===o?e:t[n]===o?n:t[r]===o?r:void 0},i=o("setup-const")||o("setup-reactive-const");if(i)return i;var a=o("setup-let")||o("setup-ref")||o("setup-maybe-ref");if(a)return a}(a,t.tag)),i||(i="'".concat(t.tag,"'"));var s=t.inlineTemplate?null:ec(t,e,!0);n="_c(".concat(i).concat(r?",".concat(r):"").concat(s?",".concat(s):"",")")}for(var c=0;c<e.transforms.length;c++)n=e.transforms[c](t,n);return n}return ec(t,e)||"void 0"}function qs(t,e){t.staticProcessed=!0;var n=e.pre;return t.pre&&(e.pre=t.pre),e.staticRenderFns.push("with(this){return ".concat(Js(t,e),"}")),e.pre=n,"_m(".concat(e.staticRenderFns.length-1).concat(t.staticInFor?",true":"",")")}function Ws(t,e){if(t.onceProcessed=!0,t.if&&!t.ifProcessed)return Zs(t,e);if(t.staticInFor){for(var n="",r=t.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o(".concat(Js(t,e),",").concat(e.onceId++,",").concat(n,")"):Js(t,e)}return qs(t,e)}function Zs(t,e,n,r){return t.ifProcessed=!0,Gs(t.ifConditions.slice(),e,n,r)}function Gs(t,e,n,r){if(!t.length)return r||"_e()";var o=t.shift();return o.exp?"(".concat(o.exp,")?").concat(i(o.block),":").concat(Gs(t,e,n,r)):"".concat(i(o.block));function i(t){return n?n(t,e):t.once?Ws(t,e):Js(t,e)}}function Xs(t,e,n,r){var o=t.for,i=t.alias,a=t.iterator1?",".concat(t.iterator1):"",s=t.iterator2?",".concat(t.iterator2):"";return t.forProcessed=!0,"".concat(r||"_l","((").concat(o,"),")+"function(".concat(i).concat(a).concat(s,"){")+"return ".concat((n||Js)(t,e))+"})"}function Ys(t,e){var n="{",r=function(t,e){var n=t.directives;if(!n)return;var r,o,i,a,s="directives:[",c=!1;for(r=0,o=n.length;r<o;r++){i=n[r],a=!0;var u=e.directives[i.name];u&&(a=!!u(t,i,e.warn)),a&&(c=!0,s+='{name:"'.concat(i.name,'",rawName:"').concat(i.rawName,'"').concat(i.value?",value:(".concat(i.value,"),expression:").concat(JSON.stringify(i.value)):"").concat(i.arg?",arg:".concat(i.isDynamicArg?i.arg:'"'.concat(i.arg,'"')):"").concat(i.modifiers?",modifiers:".concat(JSON.stringify(i.modifiers)):"","},"))}if(c)return s.slice(0,-1)+"]"}(t,e);r&&(n+=r+","),t.key&&(n+="key:".concat(t.key,",")),t.ref&&(n+="ref:".concat(t.ref,",")),t.refInFor&&(n+="refInFor:true,"),t.pre&&(n+="pre:true,"),t.component&&(n+='tag:"'.concat(t.tag,'",'));for(var o=0;o<e.dataGenFns.length;o++)n+=e.dataGenFns[o](t);if(t.attrs&&(n+="attrs:".concat(oc(t.attrs),",")),t.props&&(n+="domProps:".concat(oc(t.props),",")),t.events&&(n+="".concat(Hs(t.events,!1),",")),t.nativeEvents&&(n+="".concat(Hs(t.nativeEvents,!0),",")),t.slotTarget&&!t.slotScope&&(n+="slot:".concat(t.slotTarget,",")),t.scopedSlots&&(n+="".concat(function(t,e,n){var r=t.for||Object.keys(e).some((function(t){var n=e[t];return n.slotTargetDynamic||n.if||n.for||Qs(n)})),o=!!t.if;if(!r)for(var i=t.parent;i;){if(i.slotScope&&i.slotScope!==ds||i.for){r=!0;break}i.if&&(o=!0),i=i.parent}var a=Object.keys(e).map((function(t){return tc(e[t],n)})).join(",");return"scopedSlots:_u([".concat(a,"]").concat(r?",null,true":"").concat(!r&&o?",null,false,".concat(function(t){var e=5381,n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e>>>0}(a)):"",")")}(t,t.scopedSlots,e),",")),t.model&&(n+="model:{value:".concat(t.model.value,",callback:").concat(t.model.callback,",expression:").concat(t.model.expression,"},")),t.inlineTemplate){var i=function(t,e){var n=t.children[0];if(n&&1===n.type){var r=Ks(n,e.options);return"inlineTemplate:{render:function(){".concat(r.render,"},staticRenderFns:[").concat(r.staticRenderFns.map((function(t){return"function(){".concat(t,"}")})).join(","),"]}")}}(t,e);i&&(n+="".concat(i,","))}return n=n.replace(/,$/,"")+"}",t.dynamicAttrs&&(n="_b(".concat(n,',"').concat(t.tag,'",').concat(oc(t.dynamicAttrs),")")),t.wrapData&&(n=t.wrapData(n)),t.wrapListeners&&(n=t.wrapListeners(n)),n}function Qs(t){return 1===t.type&&("slot"===t.tag||t.children.some(Qs))}function tc(t,e){var n=t.attrsMap["slot-scope"];if(t.if&&!t.ifProcessed&&!n)return Zs(t,e,tc,"null");if(t.for&&!t.forProcessed)return Xs(t,e,tc);var r=t.slotScope===ds?"":String(t.slotScope),o="function(".concat(r,"){")+"return ".concat("template"===t.tag?t.if&&n?"(".concat(t.if,")?").concat(ec(t,e)||"undefined",":undefined"):ec(t,e)||"undefined":Js(t,e),"}"),i=r?"":",proxy:true";return"{key:".concat(t.slotTarget||'"default"',",fn:").concat(o).concat(i,"}")}function ec(t,e,n,r,o){var i=t.children;if(i.length){var a=i[0];if(1===i.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag){var s=n?e.maybeComponent(a)?",1":",0":"";return"".concat((r||Js)(a,e)).concat(s)}var c=n?function(t,e){for(var n=0,r=0;r<t.length;r++){var o=t[r];if(1===o.type){if(nc(o)||o.ifConditions&&o.ifConditions.some((function(t){return nc(t.block)}))){n=2;break}(e(o)||o.ifConditions&&o.ifConditions.some((function(t){return e(t.block)})))&&(n=1)}}return n}(i,e.maybeComponent):0,u=o||rc;return"[".concat(i.map((function(t){return u(t,e)})).join(","),"]").concat(c?",".concat(c):"")}}function nc(t){return void 0!==t.for||"template"===t.tag||"slot"===t.tag}function rc(t,e){return 1===t.type?Js(t,e):3===t.type&&t.isComment?function(t){return"_e(".concat(JSON.stringify(t.text),")")}(t):function(t){return"_v(".concat(2===t.type?t.expression:ic(JSON.stringify(t.text)),")")}(t)}function oc(t){for(var e="",n="",r=0;r<t.length;r++){var o=t[r],i=ic(o.value);o.dynamic?n+="".concat(o.name,",").concat(i,","):e+='"'.concat(o.name,'":').concat(i,",")}return e="{".concat(e.slice(0,-1),"}"),n?"_d(".concat(e,",[").concat(n.slice(0,-1),"])"):e}function ic(t){return t.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function ac(t,e){try{return new Function(t)}catch(n){return e.push({err:n,code:t}),j}}function sc(t){var e=Object.create(null);return function(n,r,o){(r=T({},r)).warn,delete r.warn;var i=r.delimiters?String(r.delimiters)+n:n;if(e[i])return e[i];var a=t(n,r),s={},c=[];return s.render=ac(a.render,c),s.staticRenderFns=a.staticRenderFns.map((function(t){return ac(t,c)})),e[i]=s}}new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)");var cc,uc,lc=(cc=function(t,e){var n=vs(t.trim(),e);!1!==e.optimize&&js(n,e);var r=Ks(n,e);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}},function(t){function e(e,n){var r=Object.create(t),o=[],i=[];if(n)for(var a in n.modules&&(r.modules=(t.modules||[]).concat(n.modules)),n.directives&&(r.directives=T(Object.create(t.directives||null),n.directives)),n)"modules"!==a&&"directives"!==a&&(r[a]=n[a]);r.warn=function(t,e,n){(n?i:o).push(t)};var s=cc(e.trim(),r);return s.errors=o,s.tips=i,s}return{compile:e,compileToFunctions:sc(e)}}),fc=lc(Ts).compileToFunctions;function dc(t){return(uc=uc||document.createElement("div")).innerHTML=t?'<a href="\n"/>':'<div a="\n"/>',uc.innerHTML.indexOf("&#10;")>0}var pc=!!J&&dc(!1),vc=!!J&&dc(!0),hc=b((function(t){var e=Qr(t);return e&&e.innerHTML})),mc=xr.prototype.$mount;return xr.prototype.$mount=function(t,e){if((t=t&&Qr(t))===document.body||t===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=hc(r));else{if(!r.nodeType)return this;r=r.innerHTML}else t&&(r=function(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}(t));if(r){var o=fc(r,{outputSourceRange:!1,shouldDecodeNewlines:pc,shouldDecodeNewlinesForHref:vc,delimiters:n.delimiters,comments:n.comments},this),i=o.render,a=o.staticRenderFns;n.render=i,n.staticRenderFns=a}}return mc.call(this,t,e)},xr.compile=fc,T(xr,Rn),xr.effect=function(t,e){var n=new zn(ct,t,j,{sync:!0});e&&(n.update=function(){e((function(){return n.run()}))})},xr}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)

},{"timers":5}],8:[function(require,module,exports){
(function (global,setImmediate){
/*!
 * Vue.js v2.7.10
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
'use strict';

const emptyObject = Object.freeze({});
const isArray = Array.isArray;
// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef(v) {
    return v === undefined || v === null;
}
function isDef(v) {
    return v !== undefined && v !== null;
}
function isTrue(v) {
    return v === true;
}
function isFalse(v) {
    return v === false;
}
/**
 * Check if value is primitive.
 */
function isPrimitive(value) {
    return (typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean');
}
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Quick object check - this is primarily used to tell
 * objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString;
function toRawType(value) {
    return _toString.call(value).slice(8, -1);
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}
function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]';
}
/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
    const n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
}
function isPromise(val) {
    return (isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function');
}
/**
 * Convert a value to a string that is actually rendered.
 */
function toString(val) {
    return val == null
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
            ? JSON.stringify(val, null, 2)
            : String(val);
}
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}
/**
 * Check if a tag is a built-in tag.
 */
const isBuiltInTag = makeMap('slot,component', true);
/**
 * Check if an attribute is a reserved attribute.
 */
const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
/**
 * Remove an item from an array.
 */
function remove$2(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = cached((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
/**
 * Capitalize a string.
 */
const capitalize = cached((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cached((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */
/* istanbul ignore next */
function polyfillBind(fn, ctx) {
    function boundFn(a) {
        const l = arguments.length;
        return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx);
    }
    boundFn._length = fn.length;
    return boundFn;
}
function nativeBind(fn, ctx) {
    return fn.bind(ctx);
}
// @ts-expect-error bind cannot be `undefined`
const bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
    start = start || 0;
    let i = list.length - start;
    const ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}
/**
 * Mix properties into target object.
 */
function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key];
    }
    return to;
}
/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
    const res = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}
/* eslint-disable no-unused-vars */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) { }
/**
 * Always return false.
 */
const no = (a, b, c) => false;
/* eslint-enable no-unused-vars */
/**
 * Return the same value.
 */
const identity = (_) => _;
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
    if (a === b)
        return true;
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a);
            const isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return (a.length === b.length &&
                    a.every((e, i) => {
                        return looseEqual(e, b[i]);
                    }));
            }
            else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            }
            else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                return (keysA.length === keysB.length &&
                    keysA.every(key => {
                        return looseEqual(a[key], b[key]);
                    }));
            }
            else {
                /* istanbul ignore next */
                return false;
            }
        }
        catch (e) {
            /* istanbul ignore next */
            return false;
        }
    }
    else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
    }
    else {
        return false;
    }
}
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val))
            return i;
    }
    return -1;
}
/**
 * Ensure a function is called only once.
 */
function once(fn) {
    let called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    };
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill
function hasChanged(x, y) {
    if (x === y) {
        return x === 0 && 1 / x !== 1 / y;
    }
    else {
        return x === x || y === y;
    }
}

const SSR_ATTR = 'data-server-rendered';
const ASSET_TYPES = ['component', 'directive', 'filter'];
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch',
    'renderTracked',
    'renderTriggered'
];

var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),
    /**
     * Whether to suppress warnings.
     */
    silent: false,
    /**
     * Show production mode tip message on boot?
     */
    productionTip: true,
    /**
     * Whether to enable devtools
     */
    devtools: true,
    /**
     * Whether to record perf
     */
    performance: false,
    /**
     * Error handler for watcher errors
     */
    errorHandler: null,
    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,
    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],
    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),
    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,
    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,
    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,
    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,
    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,
    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,
    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,
    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
};

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
    const c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5f;
}
/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
function parsePath(path) {
    if (bailRE.test(path)) {
        return;
    }
    const segments = path.split('.');
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj)
                return;
            obj = obj[segments[i]];
        }
        return obj;
    };
}

// can we use __proto__?
const hasProto = '__proto__' in {};
// Browser environment sniffing
const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE = UA && /msie|trident/.test(UA);
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isEdge = UA && UA.indexOf('edge/') > 0;
UA && UA.indexOf('android') > 0;
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
UA && /chrome\/\d+/.test(UA) && !isEdge;
UA && /phantomjs/.test(UA);
const isFF = UA && UA.match(/firefox\/(\d+)/);
// Firefox has a "watch" function on Object.prototype...
// @ts-expect-error firebox support
const nativeWatch = {}.watch;
let supportsPassive = false;
if (inBrowser) {
    try {
        const opts = {};
        Object.defineProperty(opts, 'passive', {
            get() {
                /* istanbul ignore next */
                supportsPassive = true;
            }
        }); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
    }
    catch (e) { }
}
// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer;
const isServerRendering = () => {
    if (_isServer === undefined) {
        /* istanbul ignore if */
        if (!inBrowser && typeof global !== 'undefined') {
            // detect presence of vue-server-renderer and avoid
            // Webpack shimming the process
            _isServer =
                global['process'] && global['process'].env.VUE_ENV === 'server';
        }
        else {
            _isServer = false;
        }
    }
    return _isServer;
};
// detect devtools
const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
const hasSymbol = typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys);
let _Set; // $flow-disable-line
/* istanbul ignore if */ if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
}
else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = class Set {
        constructor() {
            this.set = Object.create(null);
        }
        has(key) {
            return this.set[key] === true;
        }
        add(key) {
            this.set[key] = true;
        }
        clear() {
            this.set = Object.create(null);
        }
    };
}

let currentInstance = null;
/**
 * This is exposed for compatibility with v3 (e.g. some functions in VueUse
 * relies on it). Do not use this internally, just use `currentInstance`.
 *
 * @internal this function needs manual type declaration because it relies
 * on previously manually authored types from Vue 2
 */
function getCurrentInstance() {
    return currentInstance && { proxy: currentInstance };
}
/**
 * @internal
 */
function setCurrentInstance(vm = null) {
    if (!vm)
        currentInstance && currentInstance._scope.off();
    currentInstance = vm;
    vm && vm._scope.on();
}

/**
 * @internal
 */
class VNode {
    constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.fnContext = undefined;
        this.fnOptions = undefined;
        this.fnScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    }
    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    get child() {
        return this.componentInstance;
    }
}
const createEmptyVNode = (text = '') => {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
};
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
    const cloned = new VNode(vnode.tag, vnode.data, 
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned;
}

let uid$2 = 0;
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
class Dep {
    constructor() {
        this.id = uid$2++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove$2(this.subs, sub);
    }
    depend(info) {
        if (Dep.target) {
            Dep.target.addDep(this);
            if (info && Dep.target.onTrack) {
                Dep.target.onTrack(Object.assign({ effect: Dep.target }, info));
            }
        }
    }
    notify(info) {
        // stabilize the subscriber list first
        const subs = this.subs.slice();
        if (!config.async) {
            // subs aren't sorted in scheduler if not running async
            // we need to sort them now to make sure they fire in correct
            // order
            subs.sort((a, b) => a.id - b.id);
        }
        for (let i = 0, l = subs.length; i < l; i++) {
            if (info) {
                const sub = subs[i];
                sub.onTrigger &&
                    sub.onTrigger(Object.assign({ effect: subs[i] }, info));
            }
            subs[i].update();
        }
    }
}
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
const targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted)
            ob.observeArray(inserted);
        // notify change
        {
            ob.dep.notify({
                type: "array mutation" /* TriggerOpTypes.ARRAY_MUTATION */,
                target: this,
                key: method
            });
        }
        return result;
    });
});

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
const NO_INIITIAL_VALUE = {};
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
let shouldObserve = true;
function toggleObserving(value) {
    shouldObserve = value;
}
// ssr mock dep
const mockDep = {
    notify: noop,
    depend: noop,
    addSub: noop,
    removeSub: noop
};
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
    constructor(value, shallow = false, mock = false) {
        this.value = value;
        this.shallow = shallow;
        this.mock = mock;
        // this.value = value
        this.dep = mock ? mockDep : new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this);
        if (isArray(value)) {
            if (!mock) {
                if (hasProto) {
                    value.__proto__ = arrayMethods;
                    /* eslint-enable no-proto */
                }
                else {
                    for (let i = 0, l = arrayKeys.length; i < l; i++) {
                        const key = arrayKeys[i];
                        def(value, key, arrayMethods[key]);
                    }
                }
            }
            if (!shallow) {
                this.observeArray(value);
            }
        }
        else {
            /**
             * Walk through all properties and convert them into
             * getter/setters. This method should only be called when
             * value type is Object.
             */
            const keys = Object.keys(value);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                defineReactive(value, key, NO_INIITIAL_VALUE, undefined, shallow, mock);
            }
        }
    }
    /**
     * Observe a list of Array items.
     */
    observeArray(value) {
        for (let i = 0, l = value.length; i < l; i++) {
            observe(value[i], false, this.mock);
        }
    }
}
// helpers
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, shallow, ssrMockReactivity) {
    if (!isObject(value) || isRef(value) || value instanceof VNode) {
        return;
    }
    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    }
    else if (shouldObserve &&
        (ssrMockReactivity || !isServerRendering()) &&
        (isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value.__v_skip /* ReactiveFlags.SKIP */) {
        ob = new Observer(value, shallow, ssrMockReactivity);
    }
    return ob;
}
/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj, key, val, customSetter, shallow, mock) {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    // cater for pre-defined getter/setters
    const getter = property && property.get;
    const setter = property && property.set;
    if ((!getter || setter) &&
        (val === NO_INIITIAL_VALUE || arguments.length === 2)) {
        val = obj[key];
    }
    let childOb = !shallow && observe(val, false, mock);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                {
                    dep.depend({
                        target: obj,
                        type: "get" /* TrackOpTypes.GET */,
                        key
                    });
                }
                if (childOb) {
                    childOb.dep.depend();
                    if (isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return isRef(value) && !shallow ? value.value : value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            if (!hasChanged(value, newVal)) {
                return;
            }
            if (customSetter) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal);
            }
            else if (getter) {
                // #7981: for accessor properties without setter
                return;
            }
            else if (!shallow && isRef(value) && !isRef(newVal)) {
                value.value = newVal;
                return;
            }
            else {
                val = newVal;
            }
            childOb = !shallow && observe(newVal, false, mock);
            {
                dep.notify({
                    type: "set" /* TriggerOpTypes.SET */,
                    target: obj,
                    key,
                    newValue: newVal,
                    oldValue: value
                });
            }
        }
    });
    return dep;
}
function set(target, key, val) {
    if ((isUndef(target) || isPrimitive(target))) {
        warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`);
    }
    if (isReadonly(target)) {
        warn(`Set operation on key "${key}" failed: target is readonly.`);
        return;
    }
    const ob = target.__ob__;
    if (isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        // when mocking for SSR, array methods are not hijacked
        if (ob && !ob.shallow && ob.mock) {
            observe(val, false, true);
        }
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    if (target._isVue || (ob && ob.vmCount)) {
        warn('Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.');
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock);
    {
        ob.dep.notify({
            type: "add" /* TriggerOpTypes.ADD */,
            target: target,
            key,
            newValue: val,
            oldValue: undefined
        });
    }
    return val;
}
function del(target, key) {
    if ((isUndef(target) || isPrimitive(target))) {
        warn(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`);
    }
    if (isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return;
    }
    const ob = target.__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        warn('Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.');
        return;
    }
    if (isReadonly(target)) {
        warn(`Delete operation on key "${key}" failed: target is readonly.`);
        return;
    }
    if (!hasOwn(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    {
        ob.dep.notify({
            type: "delete" /* TriggerOpTypes.DELETE */,
            target: target,
            key
        });
    }
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        if (e && e.__ob__) {
            e.__ob__.dep.depend();
        }
        if (isArray(e)) {
            dependArray(e);
        }
    }
}

function reactive(target) {
    makeReactive(target, false);
    return target;
}
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
function shallowReactive(target) {
    makeReactive(target, true);
    def(target, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    return target;
}
function makeReactive(target, shallow) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (!isReadonly(target)) {
        {
            if (isArray(target)) {
                warn(`Avoid using Array as root value for ${shallow ? `shallowReactive()` : `reactive()`} as it cannot be tracked in watch() or watchEffect(). Use ${shallow ? `shallowRef()` : `ref()`} instead. This is a Vue-2-only limitation.`);
            }
            const existingOb = target && target.__ob__;
            if (existingOb && existingOb.shallow !== shallow) {
                warn(`Target is already a ${existingOb.shallow ? `` : `non-`}shallow reactive object, and cannot be converted to ${shallow ? `` : `non-`}shallow.`);
            }
        }
        const ob = observe(target, shallow, isServerRendering() /* ssr mock reactivity */);
        if (!ob) {
            if (target == null || isPrimitive(target)) {
                warn(`value cannot be made reactive: ${String(target)}`);
            }
            if (isCollectionType(target)) {
                warn(`Vue 2 does not support reactive collection types such as Map or Set.`);
            }
        }
    }
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* ReactiveFlags.RAW */]);
    }
    return !!(value && value.__ob__);
}
function isShallow(value) {
    return !!(value && value.__v_isShallow);
}
function isReadonly(value) {
    return !!(value && value.__v_isReadonly);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    const raw = observed && observed["__v_raw" /* ReactiveFlags.RAW */];
    return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
    def(value, "__v_skip" /* ReactiveFlags.SKIP */, true);
    return value;
}
/**
 * @internal
 */
function isCollectionType(value) {
    const type = toRawType(value);
    return (type === 'Map' || type === 'WeakMap' || type === 'Set' || type === 'WeakSet');
}

/**
 * @internal
 */
const RefFlag = `__v_isRef`;
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
function ref$1(value) {
    return createRef(value, false);
}
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    const ref = {};
    def(ref, RefFlag, true);
    def(ref, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, shallow);
    def(ref, 'dep', defineReactive(ref, 'value', rawValue, null, shallow, isServerRendering()));
    return ref;
}
function triggerRef(ref) {
    if (!ref.dep) {
        warn(`received object is not a triggerable ref.`);
    }
    {
        ref.dep &&
            ref.dep.notify({
                type: "set" /* TriggerOpTypes.SET */,
                target: ref,
                key: 'value'
            });
    }
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    if (isReactive(objectWithRefs)) {
        return objectWithRefs;
    }
    const proxy = {};
    const keys = Object.keys(objectWithRefs);
    for (let i = 0; i < keys.length; i++) {
        proxyWithRefUnwrap(proxy, objectWithRefs, keys[i]);
    }
    return proxy;
}
function proxyWithRefUnwrap(target, source, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            const val = source[key];
            if (isRef(val)) {
                return val.value;
            }
            else {
                const ob = val && val.__ob__;
                if (ob)
                    ob.dep.depend();
                return val;
            }
        },
        set: value => {
            const oldValue = source[key];
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
            }
            else {
                source[key] = value;
            }
        }
    });
}
function customRef(factory) {
    const dep = new Dep();
    const { get, set } = factory(() => {
        {
            dep.depend({
                target: ref,
                type: "get" /* TrackOpTypes.GET */,
                key: 'value'
            });
        }
    }, () => {
        {
            dep.notify({
                target: ref,
                type: "set" /* TriggerOpTypes.SET */,
                key: 'value'
            });
        }
    });
    const ref = {
        get value() {
            return get();
        },
        set value(newVal) {
            set(newVal);
        }
    };
    def(ref, RefFlag, true);
    return ref;
}
function toRefs(object) {
    if (!isReactive(object)) {
        warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
function toRef(object, key, defaultValue) {
    const val = object[key];
    if (isRef(val)) {
        return val;
    }
    const ref = {
        get value() {
            const val = object[key];
            return val === undefined ? defaultValue : val;
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
    def(ref, RefFlag, true);
    return ref;
}

const rawToReadonlyFlag = `__v_rawToReadonly`;
const rawToShallowReadonlyFlag = `__v_rawToShallowReadonly`;
function readonly(target) {
    return createReadonly(target, false);
}
function createReadonly(target, shallow) {
    if (!isPlainObject(target)) {
        {
            if (isArray(target)) {
                warn(`Vue 2 does not support readonly arrays.`);
            }
            else if (isCollectionType(target)) {
                warn(`Vue 2 does not support readonly collection types such as Map or Set.`);
            }
            else {
                warn(`value cannot be made readonly: ${typeof target}`);
            }
        }
        return target;
    }
    // already a readonly object
    if (isReadonly(target)) {
        return target;
    }
    // already has a readonly proxy
    const existingFlag = shallow ? rawToShallowReadonlyFlag : rawToReadonlyFlag;
    const existingProxy = target[existingFlag];
    if (existingProxy) {
        return existingProxy;
    }
    const proxy = Object.create(Object.getPrototypeOf(target));
    def(target, existingFlag, proxy);
    def(proxy, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, true);
    def(proxy, "__v_raw" /* ReactiveFlags.RAW */, target);
    if (isRef(target)) {
        def(proxy, RefFlag, true);
    }
    if (shallow || isShallow(target)) {
        def(proxy, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    }
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i++) {
        defineReadonlyProperty(proxy, target, keys[i], shallow);
    }
    return proxy;
}
function defineReadonlyProperty(proxy, target, key, shallow) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get() {
            const val = target[key];
            return shallow || !isPlainObject(val) ? val : readonly(val);
        },
        set() {
            warn(`Set operation on key "${key}" failed: target is readonly.`);
        }
    });
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
function shallowReadonly(target) {
    return createReadonly(target, true);
}

function computed(getterOrOptions, debugOptions) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => {
                warn('Write operation failed: computed value is readonly');
            }
            ;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    const watcher = isServerRendering()
        ? null
        : new Watcher(currentInstance, getter, noop, { lazy: true });
    if (watcher && debugOptions) {
        watcher.onTrack = debugOptions.onTrack;
        watcher.onTrigger = debugOptions.onTrigger;
    }
    const ref = {
        // some libs rely on the presence effect for checking computed refs
        // from normal refs, but the implementation doesn't matter
        effect: watcher,
        get value() {
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (Dep.target) {
                    if (Dep.target.onTrack) {
                        Dep.target.onTrack({
                            effect: Dep.target,
                            target: ref,
                            type: "get" /* TrackOpTypes.GET */,
                            key: 'value'
                        });
                    }
                    watcher.depend();
                }
                return watcher.value;
            }
            else {
                return getter();
            }
        },
        set value(newVal) {
            setter(newVal);
        }
    };
    def(ref, RefFlag, true);
    def(ref, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, onlyGetter);
    return ref;
}

const WATCHER = `watcher`;
const WATCHER_CB = `${WATCHER} callback`;
const WATCHER_GETTER = `${WATCHER} getter`;
const WATCHER_CLEANUP = `${WATCHER} cleanup`;
// Simple effect.
function watchEffect(effect, options) {
    return doWatch(effect, null, options);
}
function watchPostEffect(effect, options) {
    return doWatch(effect, null, (Object.assign(Object.assign({}, options), { flush: 'post' }) ));
}
function watchSyncEffect(effect, options) {
    return doWatch(effect, null, (Object.assign(Object.assign({}, options), { flush: 'sync' }) ));
}
// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {};
// implementation
function watch(source, cb, options) {
    if (typeof cb !== 'function') {
        warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
            `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
            `supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush = 'pre', onTrack, onTrigger } = emptyObject) {
    if (!cb) {
        if (immediate !== undefined) {
            warn(`watch() "immediate" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
        if (deep !== undefined) {
            warn(`watch() "deep" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
    }
    const warnInvalidSource = (s) => {
        warn(`Invalid watch source: ${s}. A watch source can only be a getter/effect ` +
            `function, a ref, a reactive object, or an array of these types.`);
    };
    const instance = currentInstance;
    const call = (fn, type, args = null) => invokeWithErrorHandling(fn, null, args, instance, type);
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
    }
    else if (isReactive(source)) {
        getter = () => {
            source.__ob__.dep.depend();
            return source;
        };
        deep = true;
    }
    else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some(s => isReactive(s) || isShallow(s));
        getter = () => source.map(s => {
            if (isRef(s)) {
                return s.value;
            }
            else if (isReactive(s)) {
                return traverse(s);
            }
            else if (isFunction(s)) {
                return call(s, WATCHER_GETTER);
            }
            else {
                warnInvalidSource(s);
            }
        });
    }
    else if (isFunction(source)) {
        if (cb) {
            // getter with cb
            getter = () => call(source, WATCHER_GETTER);
        }
        else {
            // no cb -> simple effect
            getter = () => {
                if (instance && instance._isDestroyed) {
                    return;
                }
                if (cleanup) {
                    cleanup();
                }
                return call(source, WATCHER, [onCleanup]);
            };
        }
    }
    else {
        getter = noop;
        warnInvalidSource(source);
    }
    if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
        cleanup = watcher.onStop = () => {
            call(fn, WATCHER_CLEANUP);
        };
    };
    // in SSR there is no need to setup an actual effect, and it should be noop
    // unless it's eager
    if (isServerRendering()) {
        // we will also not call the invalidate callback (+ runner is not set up)
        onCleanup = noop;
        if (!cb) {
            getter();
        }
        else if (immediate) {
            call(cb, WATCHER_CB, [
                getter(),
                isMultiSource ? [] : undefined,
                onCleanup
            ]);
        }
        return noop;
    }
    const watcher = new Watcher(currentInstance, getter, noop, {
        lazy: true
    });
    watcher.noRecurse = !cb;
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    // overwrite default run
    watcher.run = () => {
        if (!watcher.active) {
            return;
        }
        if (cb) {
            // watch(source, cb)
            const newValue = watcher.get();
            if (deep ||
                forceTrigger ||
                (isMultiSource
                    ? newValue.some((v, i) => hasChanged(v, oldValue[i]))
                    : hasChanged(newValue, oldValue))) {
                // cleanup before running cb again
                if (cleanup) {
                    cleanup();
                }
                call(cb, WATCHER_CB, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onCleanup
                ]);
                oldValue = newValue;
            }
        }
        else {
            // watchEffect
            watcher.get();
        }
    };
    if (flush === 'sync') {
        watcher.update = watcher.run;
    }
    else if (flush === 'post') {
        watcher.post = true;
        watcher.update = () => queueWatcher(watcher);
    }
    else {
        // pre
        watcher.update = () => {
            if (instance && instance === currentInstance && !instance._isMounted) {
                // pre-watcher triggered before
                const buffer = instance._preWatchers || (instance._preWatchers = []);
                if (buffer.indexOf(watcher) < 0)
                    buffer.push(watcher);
            }
            else {
                queueWatcher(watcher);
            }
        };
    }
    {
        watcher.onTrack = onTrack;
        watcher.onTrigger = onTrigger;
    }
    // initial run
    if (cb) {
        if (immediate) {
            watcher.run();
        }
        else {
            oldValue = watcher.get();
        }
    }
    else if (flush === 'post' && instance) {
        instance.$once('hook:mounted', () => watcher.get());
    }
    else {
        watcher.get();
    }
    return () => {
        watcher.teardown();
    };
}

let activeEffectScope;
class EffectScope {
    constructor(detached = false) {
        /**
         * @internal
         */
        this.active = true;
        /**
         * @internal
         */
        this.effects = [];
        /**
         * @internal
         */
        this.cleanups = [];
        if (!detached && activeEffectScope) {
            this.parent = activeEffectScope;
            this.index =
                (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
        }
    }
    run(fn) {
        if (this.active) {
            const currentEffectScope = activeEffectScope;
            try {
                activeEffectScope = this;
                return fn();
            }
            finally {
                activeEffectScope = currentEffectScope;
            }
        }
        else {
            warn(`cannot run an inactive effect scope.`);
        }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
        activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
        activeEffectScope = this.parent;
    }
    stop(fromParent) {
        if (this.active) {
            let i, l;
            for (i = 0, l = this.effects.length; i < l; i++) {
                this.effects[i].teardown();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
                this.cleanups[i]();
            }
            if (this.scopes) {
                for (i = 0, l = this.scopes.length; i < l; i++) {
                    this.scopes[i].stop(true);
                }
            }
            // nested scope, dereference from parent to avoid memory leaks
            if (this.parent && !fromParent) {
                // optimized O(1) removal
                const last = this.parent.scopes.pop();
                if (last && last !== this) {
                    this.parent.scopes[this.index] = last;
                    last.index = this.index;
                }
            }
            this.active = false;
        }
    }
}
function effectScope(detached) {
    return new EffectScope(detached);
}
/**
 * @internal
 */
function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
        scope.effects.push(effect);
    }
}
function getCurrentScope() {
    return activeEffectScope;
}
function onScopeDispose(fn) {
    if (activeEffectScope) {
        activeEffectScope.cleanups.push(fn);
    }
    else {
        warn(`onScopeDispose() is called when there is no active effect scope` +
            ` to be associated with.`);
    }
}

function provide(key, value) {
    if (!currentInstance) {
        {
            warn(`provide() can only be used inside setup().`);
        }
    }
    else {
        // TS doesn't allow symbol as index type
        resolveProvided(currentInstance)[key] = value;
    }
}
function resolveProvided(vm) {
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const existing = vm._provided;
    const parentProvides = vm.$parent && vm.$parent._provided;
    if (parentProvides === existing) {
        return (vm._provided = Object.create(parentProvides));
    }
    else {
        return existing;
    }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    const instance = currentInstance;
    if (instance) {
        // #2400
        // to support `app.use` plugins,
        // fallback to appContext's `provides` if the instance is at root
        const provides = instance.$parent && instance.$parent._provided;
        if (provides && key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (arguments.length > 1) {
            return treatDefaultAsFactory && isFunction(defaultValue)
                ? defaultValue.call(instance)
                : defaultValue;
        }
        else {
            warn(`injection "${String(key)}" not found.`);
        }
    }
    else {
        warn(`inject() can only be used inside setup() or functional components.`);
    }
}

const normalizeEvent = cached((name) => {
    const passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    const once = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once ? name.slice(1) : name;
    const capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
        name,
        once,
        capture,
        passive
    };
});
function createFnInvoker(fns, vm) {
    function invoker() {
        const fns = invoker.fns;
        if (isArray(fns)) {
            const cloned = fns.slice();
            for (let i = 0; i < cloned.length; i++) {
                invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
            }
        }
        else {
            // return handler return value for single handlers
            return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`);
        }
    }
    invoker.fns = fns;
    return invoker;
}
function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
    let name, cur, old, event;
    for (name in on) {
        cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name);
        if (isUndef(cur)) {
            warn(`Invalid handler for event "${event.name}": got ` + String(cur), vm);
        }
        else if (isUndef(old)) {
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur, vm);
            }
            if (isTrue(event.once)) {
                cur = on[name] = createOnceHandler(event.name, cur, event.capture);
            }
            add(event.name, cur, event.capture, event.passive, event.params);
        }
        else if (cur !== old) {
            old.fns = cur;
            on[name] = old;
        }
    }
    for (name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name);
            remove(event.name, oldOn[name], event.capture);
        }
    }
}

function mergeVNodeHook(def, hookKey, hook) {
    if (def instanceof VNode) {
        def = def.data.hook || (def.data.hook = {});
    }
    let invoker;
    const oldHook = def[hookKey];
    function wrappedHook() {
        hook.apply(this, arguments);
        // important: remove merged hook to ensure it's called only once
        // and prevent memory leak
        remove$2(invoker.fns, wrappedHook);
    }
    if (isUndef(oldHook)) {
        // no existing hook
        invoker = createFnInvoker([wrappedHook]);
    }
    else {
        /* istanbul ignore if */
        if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
            // already a merged invoker
            invoker = oldHook;
            invoker.fns.push(wrappedHook);
        }
        else {
            // existing plain hook
            invoker = createFnInvoker([oldHook, wrappedHook]);
        }
    }
    invoker.merged = true;
    def[hookKey] = invoker;
}

function extractPropsFromVNodeData(data, Ctor, tag) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    const propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
        return;
    }
    const res = {};
    const { attrs, props } = data;
    if (isDef(attrs) || isDef(props)) {
        for (const key in propOptions) {
            const altKey = hyphenate(key);
            {
                const keyInLowerCase = key.toLowerCase();
                if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
                    tip(`Prop "${keyInLowerCase}" is passed to component ` +
                        `${formatComponentName(
                        // @ts-expect-error tag is string
                        tag || Ctor)}, but the declared prop name is` +
                        ` "${key}". ` +
                        `Note that HTML attributes are case-insensitive and camelCased ` +
                        `props need to use their kebab-case equivalents when using in-DOM ` +
                        `templates. You should probably use "${altKey}" instead of "${key}".`);
                }
            }
            checkProp(res, props, key, altKey, true) ||
                checkProp(res, attrs, key, altKey, false);
        }
    }
    return res;
}
function checkProp(res, hash, key, altKey, preserve) {
    if (isDef(hash)) {
        if (hasOwn(hash, key)) {
            res[key] = hash[key];
            if (!preserve) {
                delete hash[key];
            }
            return true;
        }
        else if (hasOwn(hash, altKey)) {
            res[key] = hash[altKey];
            if (!preserve) {
                delete hash[altKey];
            }
            return true;
        }
    }
    return false;
}

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
    for (let i = 0; i < children.length; i++) {
        if (isArray(children[i])) {
            return Array.prototype.concat.apply([], children);
        }
    }
    return children;
}
// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
    return isPrimitive(children)
        ? [createTextVNode(children)]
        : isArray(children)
            ? normalizeArrayChildren(children)
            : undefined;
}
function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}
function normalizeArrayChildren(children, nestedIndex) {
    const res = [];
    let i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
        c = children[i];
        if (isUndef(c) || typeof c === 'boolean')
            continue;
        lastIndex = res.length - 1;
        last = res[lastIndex];
        //  nested
        if (isArray(c)) {
            if (c.length > 0) {
                c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`);
                // merge adjacent text nodes
                if (isTextNode(c[0]) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + c[0].text);
                    c.shift();
                }
                res.push.apply(res, c);
            }
        }
        else if (isPrimitive(c)) {
            if (isTextNode(last)) {
                // merge adjacent text nodes
                // this is necessary for SSR hydration because text nodes are
                // essentially merged when rendered to HTML strings
                res[lastIndex] = createTextVNode(last.text + c);
            }
            else if (c !== '') {
                // convert primitive to vnode
                res.push(createTextVNode(c));
            }
        }
        else {
            if (isTextNode(c) && isTextNode(last)) {
                // merge adjacent text nodes
                res[lastIndex] = createTextVNode(last.text + c.text);
            }
            else {
                // default key for nested array children (likely generated by v-for)
                if (isTrue(children._isVList) &&
                    isDef(c.tag) &&
                    isUndef(c.key) &&
                    isDef(nestedIndex)) {
                    c.key = `__vlist${nestedIndex}_${i}__`;
                }
                res.push(c);
            }
        }
    }
    return res;
}

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList(val, render) {
    let ret = null, i, l, keys, key;
    if (isArray(val) || typeof val === 'string') {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
            ret[i] = render(val[i], i);
        }
    }
    else if (typeof val === 'number') {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
            ret[i] = render(i + 1, i);
        }
    }
    else if (isObject(val)) {
        if (hasSymbol && val[Symbol.iterator]) {
            ret = [];
            const iterator = val[Symbol.iterator]();
            let result = iterator.next();
            while (!result.done) {
                ret.push(render(result.value, ret.length));
                result = iterator.next();
            }
        }
        else {
            keys = Object.keys(val);
            ret = new Array(keys.length);
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                ret[i] = render(val[key], key, i);
            }
        }
    }
    if (!isDef(ret)) {
        ret = [];
    }
    ret._isVList = true;
    return ret;
}

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallbackRender, props, bindObject) {
    const scopedSlotFn = this.$scopedSlots[name];
    let nodes;
    if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (!isObject(bindObject)) {
                warn('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes =
            scopedSlotFn(props) ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    else {
        nodes =
            this.$slots[name] ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    const target = props && props.slot;
    if (target) {
        return this.$createElement('template', { slot: target }, nodes);
    }
    else {
        return nodes;
    }
}

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}

function isKeyNotMatch(expect, actual) {
    if (isArray(expect)) {
        return expect.indexOf(actual) === -1;
    }
    else {
        return expect !== actual;
    }
}
/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
    const mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
        return isKeyNotMatch(builtInKeyName, eventKeyName);
    }
    else if (mappedKeyCode) {
        return isKeyNotMatch(mappedKeyCode, eventKeyCode);
    }
    else if (eventKeyName) {
        return hyphenate(eventKeyName) !== key;
    }
    return eventKeyCode === undefined;
}

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps(data, tag, value, asProp, isSync) {
    if (value) {
        if (!isObject(value)) {
            warn('v-bind without argument expects an Object or Array value', this);
        }
        else {
            if (isArray(value)) {
                value = toObject(value);
            }
            let hash;
            for (const key in value) {
                if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
                    hash = data;
                }
                else {
                    const type = data.attrs && data.attrs.type;
                    hash =
                        asProp || config.mustUseProp(tag, type, key)
                            ? data.domProps || (data.domProps = {})
                            : data.attrs || (data.attrs = {});
                }
                const camelizedKey = camelize(key);
                const hyphenatedKey = hyphenate(key);
                if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                    hash[key] = value[key];
                    if (isSync) {
                        const on = data.on || (data.on = {});
                        on[`update:${key}`] = function ($event) {
                            value[key] = $event;
                        };
                    }
                }
            }
        }
    }
    return data;
}

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
    const cached = this._staticTrees || (this._staticTrees = []);
    let tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
        return tree;
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, this._c, this // for render fns generated for functional component templates
    );
    markStatic(tree, `__static__${index}`, false);
    return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
    markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true);
    return tree;
}
function markStatic(tree, key, isOnce) {
    if (isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i] && typeof tree[i] !== 'string') {
                markStaticNode(tree[i], `${key}_${i}`, isOnce);
            }
        }
    }
    else {
        markStaticNode(tree, key, isOnce);
    }
}
function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
}

function bindObjectListeners(data, value) {
    if (value) {
        if (!isPlainObject(value)) {
            warn('v-on without argument expects an Object value', this);
        }
        else {
            const on = (data.on = data.on ? extend({}, data.on) : {});
            for (const key in value) {
                const existing = on[key];
                const ours = value[key];
                on[key] = existing ? [].concat(existing, ours) : ours;
            }
        }
    }
    return data;
}

function resolveScopedSlots(fns, res, 
// the following are added in 2.6
hasDynamicKeys, contentHashKey) {
    res = res || { $stable: !hasDynamicKeys };
    for (let i = 0; i < fns.length; i++) {
        const slot = fns[i];
        if (isArray(slot)) {
            resolveScopedSlots(slot, res, hasDynamicKeys);
        }
        else if (slot) {
            // marker for reverse proxying v-slot without scope on this.$slots
            // @ts-expect-error
            if (slot.proxy) {
                // @ts-expect-error
                slot.fn.proxy = true;
            }
            res[slot.key] = slot.fn;
        }
    }
    if (contentHashKey) {
        res.$key = contentHashKey;
    }
    return res;
}

// helper to process dynamic keys for dynamic arguments in v-bind and v-on.
function bindDynamicKeys(baseObj, values) {
    for (let i = 0; i < values.length; i += 2) {
        const key = values[i];
        if (typeof key === 'string' && key) {
            baseObj[values[i]] = values[i + 1];
        }
        else if (key !== '' && key !== null) {
            // null is a special value for explicitly removing a binding
            warn(`Invalid value for dynamic directive argument (expected string or null): ${key}`, this);
        }
    }
    return baseObj;
}
// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier(value, symbol) {
    return typeof value === 'string' ? symbol + value : value;
}

function installRenderHelpers(target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
}

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
    if (!children || !children.length) {
        return {};
    }
    const slots = {};
    for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        const data = child.data;
        // remove slot attribute if the node is resolved as a Vue slot node
        if (data && data.attrs && data.attrs.slot) {
            delete data.attrs.slot;
        }
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.fnContext === context) &&
            data &&
            data.slot != null) {
            const name = data.slot;
            const slot = slots[name] || (slots[name] = []);
            if (child.tag === 'template') {
                slot.push.apply(slot, child.children || []);
            }
            else {
                slot.push(child);
            }
        }
        else {
            (slots.default || (slots.default = [])).push(child);
        }
    }
    // ignore slots that contains only whitespace
    for (const name in slots) {
        if (slots[name].every(isWhitespace)) {
            delete slots[name];
        }
    }
    return slots;
}
function isWhitespace(node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' ';
}

function isAsyncPlaceholder(node) {
    // @ts-expect-error not really boolean type
    return node.isComment && node.asyncFactory;
}

function normalizeScopedSlots(ownerVm, scopedSlots, normalSlots, prevScopedSlots) {
    let res;
    const hasNormalSlots = Object.keys(normalSlots).length > 0;
    const isStable = scopedSlots ? !!scopedSlots.$stable : !hasNormalSlots;
    const key = scopedSlots && scopedSlots.$key;
    if (!scopedSlots) {
        res = {};
    }
    else if (scopedSlots._normalized) {
        // fast path 1: child component re-render only, parent did not change
        return scopedSlots._normalized;
    }
    else if (isStable &&
        prevScopedSlots &&
        prevScopedSlots !== emptyObject &&
        key === prevScopedSlots.$key &&
        !hasNormalSlots &&
        !prevScopedSlots.$hasNormal) {
        // fast path 2: stable scoped slots w/ no normal slots to proxy,
        // only need to normalize once
        return prevScopedSlots;
    }
    else {
        res = {};
        for (const key in scopedSlots) {
            if (scopedSlots[key] && key[0] !== '$') {
                res[key] = normalizeScopedSlot(ownerVm, normalSlots, key, scopedSlots[key]);
            }
        }
    }
    // expose normal slots on scopedSlots
    for (const key in normalSlots) {
        if (!(key in res)) {
            res[key] = proxyNormalSlot(normalSlots, key);
        }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (scopedSlots && Object.isExtensible(scopedSlots)) {
        scopedSlots._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res;
}
function normalizeScopedSlot(vm, normalSlots, key, fn) {
    const normalized = function () {
        const cur = currentInstance;
        setCurrentInstance(vm);
        let res = arguments.length ? fn.apply(null, arguments) : fn({});
        res =
            res && typeof res === 'object' && !isArray(res)
                ? [res] // single vnode
                : normalizeChildren(res);
        const vnode = res && res[0];
        setCurrentInstance(cur);
        return res &&
            (!vnode ||
                (res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode))) // #9658, #10391
            ? undefined
            : res;
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
        Object.defineProperty(normalSlots, key, {
            get: normalized,
            enumerable: true,
            configurable: true
        });
    }
    return normalized;
}
function proxyNormalSlot(slots, key) {
    return () => slots[key];
}

function initSetup(vm) {
    const options = vm.$options;
    const setup = options.setup;
    if (setup) {
        const ctx = (vm._setupContext = createSetupContext(vm));
        setCurrentInstance(vm);
        pushTarget();
        const setupResult = invokeWithErrorHandling(setup, null, [vm._props || shallowReactive({}), ctx], vm, `setup`);
        popTarget();
        setCurrentInstance();
        if (isFunction(setupResult)) {
            // render function
            // @ts-ignore
            options.render = setupResult;
        }
        else if (isObject(setupResult)) {
            // bindings
            if (setupResult instanceof VNode) {
                warn(`setup() should not return VNodes directly - ` +
                    `return a render function instead.`);
            }
            vm._setupState = setupResult;
            // __sfc indicates compiled bindings from <script setup>
            if (!setupResult.__sfc) {
                for (const key in setupResult) {
                    if (!isReserved(key)) {
                        proxyWithRefUnwrap(vm, setupResult, key);
                    }
                    else {
                        warn(`Avoid using variables that start with _ or $ in setup().`);
                    }
                }
            }
            else {
                // exposed for compiled render fn
                const proxy = (vm._setupProxy = {});
                for (const key in setupResult) {
                    if (key !== '__sfc') {
                        proxyWithRefUnwrap(proxy, setupResult, key);
                    }
                }
            }
        }
        else if (setupResult !== undefined) {
            warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
        }
    }
}
function createSetupContext(vm) {
    let exposeCalled = false;
    return {
        get attrs() {
            if (!vm._attrsProxy) {
                const proxy = (vm._attrsProxy = {});
                def(proxy, '_v_attr_proxy', true);
                syncSetupProxy(proxy, vm.$attrs, emptyObject, vm, '$attrs');
            }
            return vm._attrsProxy;
        },
        get listeners() {
            if (!vm._listenersProxy) {
                const proxy = (vm._listenersProxy = {});
                syncSetupProxy(proxy, vm.$listeners, emptyObject, vm, '$listeners');
            }
            return vm._listenersProxy;
        },
        get slots() {
            return initSlotsProxy(vm);
        },
        emit: bind(vm.$emit, vm),
        expose(exposed) {
            {
                if (exposeCalled) {
                    warn(`expose() should be called only once per setup().`, vm);
                }
                exposeCalled = true;
            }
            if (exposed) {
                Object.keys(exposed).forEach(key => proxyWithRefUnwrap(vm, exposed, key));
            }
        }
    };
}
function syncSetupProxy(to, from, prev, instance, type) {
    let changed = false;
    for (const key in from) {
        if (!(key in to)) {
            changed = true;
            defineProxyAttr(to, key, instance, type);
        }
        else if (from[key] !== prev[key]) {
            changed = true;
        }
    }
    for (const key in to) {
        if (!(key in from)) {
            changed = true;
            delete to[key];
        }
    }
    return changed;
}
function defineProxyAttr(proxy, key, instance, type) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get() {
            return instance[type][key];
        }
    });
}
function initSlotsProxy(vm) {
    if (!vm._slotsProxy) {
        syncSetupSlots((vm._slotsProxy = {}), vm.$scopedSlots);
    }
    return vm._slotsProxy;
}
function syncSetupSlots(to, from) {
    for (const key in from) {
        to[key] = from[key];
    }
    for (const key in to) {
        if (!(key in from)) {
            delete to[key];
        }
    }
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useSlots() {
    return getContext().slots;
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useAttrs() {
    return getContext().attrs;
}
/**
 * Vue 2 only
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useListeners() {
    return getContext().listeners;
}
function getContext() {
    if (!currentInstance) {
        warn(`useContext() called without active instance.`);
    }
    const vm = currentInstance;
    return vm._setupContext || (vm._setupContext = createSetupContext(vm));
}
/**
 * Runtime helper for merging default declarations. Imported by compiled code
 * only.
 * @internal
 */
function mergeDefaults(raw, defaults) {
    const props = isArray(raw)
        ? raw.reduce((normalized, p) => ((normalized[p] = {}), normalized), {})
        : raw;
    for (const key in defaults) {
        const opt = props[key];
        if (opt) {
            if (isArray(opt) || isFunction(opt)) {
                props[key] = { type: opt, default: defaults[key] };
            }
            else {
                opt.default = defaults[key];
            }
        }
        else if (opt === null) {
            props[key] = { default: defaults[key] };
        }
        else {
            warn(`props default key "${key}" has no corresponding declaration.`);
        }
    }
    return props;
}

function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    const options = vm.$options;
    const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
    const renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = parentVnode
        ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots)
        : emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    // @ts-expect-error
    vm._c = (a, b, c, d) => createElement$1(vm, a, b, c, d, false);
    // normalization is always applied for the public version, used in
    // user-written render functions.
    // @ts-expect-error
    vm.$createElement = (a, b, c, d) => createElement$1(vm, a, b, c, d, true);
    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    const parentData = parentVnode && parentVnode.data;
    /* istanbul ignore else */
    {
        defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, () => {
            !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm);
        }, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
            !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm);
        }, true);
    }
}
let currentRenderingInstance = null;
function renderMixin(Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);
    Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this);
    };
    Vue.prototype._render = function () {
        const vm = this;
        const { render, _parentVnode } = vm.$options;
        if (_parentVnode && vm._isMounted) {
            vm.$scopedSlots = normalizeScopedSlots(vm.$parent, _parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
            if (vm._slotsProxy) {
                syncSetupSlots(vm._slotsProxy, vm.$scopedSlots);
            }
        }
        // set parent vnode. this allows render functions to have access
        // to the data on the placeholder node.
        vm.$vnode = _parentVnode;
        // render self
        let vnode;
        try {
            // There's no need to maintain a stack because all render fns are called
            // separately from one another. Nested component's render fns are called
            // when parent component is patched.
            setCurrentInstance(vm);
            currentRenderingInstance = vm;
            vnode = render.call(vm._renderProxy, vm.$createElement);
        }
        catch (e) {
            handleError(e, vm, `render`);
            // return error render result,
            // or previous vnode to prevent render error causing blank component
            /* istanbul ignore else */
            if (vm.$options.renderError) {
                try {
                    vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                }
                catch (e) {
                    handleError(e, vm, `renderError`);
                    vnode = vm._vnode;
                }
            }
            else {
                vnode = vm._vnode;
            }
        }
        finally {
            currentRenderingInstance = null;
            setCurrentInstance();
        }
        // if the returned array contains only a single node, allow it
        if (isArray(vnode) && vnode.length === 1) {
            vnode = vnode[0];
        }
        // return empty vnode in case the render function errored out
        if (!(vnode instanceof VNode)) {
            if (isArray(vnode)) {
                warn('Multiple root nodes returned from render function. Render function ' +
                    'should return a single root node.', vm);
            }
            vnode = createEmptyVNode();
        }
        // set parent
        vnode.parent = _parentVnode;
        return vnode;
    };
}

function ensureCtor(comp, base) {
    if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
        comp = comp.default;
    }
    return isObject(comp) ? base.extend(comp) : comp;
}
function createAsyncPlaceholder(factory, data, context, children, tag) {
    const node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data, context, children, tag };
    return node;
}
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
    }
    if (isDef(factory.resolved)) {
        return factory.resolved;
    }
    const owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        // already pending
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
    }
    if (owner && !isDef(factory.owners)) {
        const owners = (factory.owners = [owner]);
        let sync = true;
        let timerLoading = null;
        let timerTimeout = null;
        owner.$on('hook:destroyed', () => remove$2(owners, owner));
        const forceRender = (renderCompleted) => {
            for (let i = 0, l = owners.length; i < l; i++) {
                owners[i].$forceUpdate();
            }
            if (renderCompleted) {
                owners.length = 0;
                if (timerLoading !== null) {
                    clearTimeout(timerLoading);
                    timerLoading = null;
                }
                if (timerTimeout !== null) {
                    clearTimeout(timerTimeout);
                    timerTimeout = null;
                }
            }
        };
        const resolve = once((res) => {
            // cache resolved
            factory.resolved = ensureCtor(res, baseCtor);
            // invoke callbacks only if this is not a synchronous resolve
            // (async resolves are shimmed as synchronous during SSR)
            if (!sync) {
                forceRender(true);
            }
            else {
                owners.length = 0;
            }
        });
        const reject = once(reason => {
            warn(`Failed to resolve async component: ${String(factory)}` +
                    (reason ? `\nReason: ${reason}` : ''));
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender(true);
            }
        });
        const res = factory(resolve, reject);
        if (isObject(res)) {
            if (isPromise(res)) {
                // () => Promise
                if (isUndef(factory.resolved)) {
                    res.then(resolve, reject);
                }
            }
            else if (isPromise(res.component)) {
                res.component.then(resolve, reject);
                if (isDef(res.error)) {
                    factory.errorComp = ensureCtor(res.error, baseCtor);
                }
                if (isDef(res.loading)) {
                    factory.loadingComp = ensureCtor(res.loading, baseCtor);
                    if (res.delay === 0) {
                        factory.loading = true;
                    }
                    else {
                        // @ts-expect-error NodeJS timeout type
                        timerLoading = setTimeout(() => {
                            timerLoading = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender(false);
                            }
                        }, res.delay || 200);
                    }
                }
                if (isDef(res.timeout)) {
                    // @ts-expect-error NodeJS timeout type
                    timerTimeout = setTimeout(() => {
                        timerTimeout = null;
                        if (isUndef(factory.resolved)) {
                            reject(`timeout (${res.timeout}ms)` );
                        }
                    }, res.timeout);
                }
            }
        }
        sync = false;
        // return in case resolved synchronously
        return factory.loading ? factory.loadingComp : factory.resolved;
    }
}

function getFirstComponentChild(children) {
    if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const c = children[i];
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                return c;
            }
        }
    }
}

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {
    if (isArray(data) || isPrimitive(data)) {
        normalizationType = children;
        children = data;
        data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType);
}
function _createElement(context, tag, data, children, normalizationType) {
    if (isDef(data) && isDef(data.__ob__)) {
        warn(`Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` + 'Always create fresh vnode data objects in each render!', context);
        return createEmptyVNode();
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
        tag = data.is;
    }
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode();
    }
    // warn against non-primitive key
    if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
        warn('Avoid using non-primitive value as key, ' +
            'use string/number value instead.', context);
    }
    // support single function children as default scoped slot
    if (isArray(children) && isFunction(children[0])) {
        data = data || {};
        data.scopedSlots = { default: children[0] };
        children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children);
    }
    else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
    }
    let vnode, ns;
    if (typeof tag === 'string') {
        let Ctor;
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
        if (config.isReservedTag(tag)) {
            // platform built-in elements
            if (isDef(data) &&
                isDef(data.nativeOn) &&
                data.tag !== 'component') {
                warn(`The .native modifier for v-on is only valid on components but it was used on <${tag}>.`, context);
            }
            vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
        }
        else if ((!data || !data.pre) &&
            isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
            // component
            vnode = createComponent(Ctor, data, context, children, tag);
        }
        else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            vnode = new VNode(tag, data, children, undefined, undefined, context);
        }
    }
    else {
        // direct component options / constructor
        vnode = createComponent(tag, data, context, children);
    }
    if (isArray(vnode)) {
        return vnode;
    }
    else if (isDef(vnode)) {
        if (isDef(ns))
            applyNS(vnode, ns);
        if (isDef(data))
            registerDeepBindings(data);
        return vnode;
    }
    else {
        return createEmptyVNode();
    }
}
function applyNS(vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
        // use default namespace inside foreignObject
        ns = undefined;
        force = true;
    }
    if (isDef(vnode.children)) {
        for (let i = 0, l = vnode.children.length; i < l; i++) {
            const child = vnode.children[i];
            if (isDef(child.tag) &&
                (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
                applyNS(child, ns, force);
            }
        }
    }
}
// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
    if (isObject(data.style)) {
        traverse(data.style);
    }
    if (isObject(data.class)) {
        traverse(data.class);
    }
}

/**
 * @internal this function needs manual public type declaration because it relies
 * on previously manually authored types from Vue 2
 */
function h(type, props, children) {
    if (!currentInstance) {
        warn(`globally imported h() can only be invoked when there is an active ` +
                `component instance, e.g. synchronously in a component's render or setup function.`);
    }
    return createElement$1(currentInstance, type, props, children, 2, true);
}

function handleError(err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
        if (vm) {
            let cur = vm;
            while ((cur = cur.$parent)) {
                const hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (let i = 0; i < hooks.length; i++) {
                        try {
                            const capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture)
                                return;
                        }
                        catch (e) {
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        globalHandleError(err, vm, info);
    }
    finally {
        popTarget();
    }
}
function invokeWithErrorHandling(handler, context, args, vm, info) {
    let res;
    try {
        res = args ? handler.apply(context, args) : handler.call(context);
        if (res && !res._isVue && isPromise(res) && !res._handled) {
            res.catch(e => handleError(e, vm, info + ` (Promise/async)`));
            res._handled = true;
        }
    }
    catch (e) {
        handleError(e, vm, info);
    }
    return res;
}
function globalHandleError(err, vm, info) {
    if (config.errorHandler) {
        try {
            return config.errorHandler.call(null, err, vm, info);
        }
        catch (e) {
            // if the user intentionally throws the original error in the handler,
            // do not log it twice
            if (e !== err) {
                logError(e, null, 'config.errorHandler');
            }
        }
    }
    logError(err, vm, info);
}
function logError(err, vm, info) {
    {
        warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
        console.error(err);
    }
    else {
        throw err;
    }
}

/* globals MutationObserver */
let isUsingMicroTask = false;
const callbacks = [];
let pending = false;
function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
let timerFunc;
// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        // In problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS)
            setTimeout(noop);
    };
    isUsingMicroTask = true;
}
else if (!isIE &&
    typeof MutationObserver !== 'undefined' &&
    (isNative(MutationObserver) ||
        // PhantomJS and iOS 7.x
        MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
    isUsingMicroTask = true;
}
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = () => {
        setImmediate(flushCallbacks);
    };
}
else {
    // Fallback to setTimeout.
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}
/**
 * @internal
 */
function nextTick(cb, ctx) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            }
            catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        }
        else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
}

function useCssModule(name = '$style') {
    /* istanbul ignore else */
    {
        if (!currentInstance) {
            warn(`useCssModule must be called inside setup()`);
            return emptyObject;
        }
        const mod = currentInstance[name];
        if (!mod) {
            warn(`Current instance does not have CSS module named "${name}".`);
            return emptyObject;
        }
        return mod;
    }
}

/**
 * Runtime helper for SFC's CSS variable injection feature.
 * @private
 */
function useCssVars(getter) {
    if (!inBrowser && !false)
        return;
    const instance = currentInstance;
    if (!instance) {
        warn(`useCssVars is called without current active component instance.`);
        return;
    }
    watchPostEffect(() => {
        const el = instance.$el;
        const vars = getter(instance, instance._setupProxy);
        if (el && el.nodeType === 1) {
            const style = el.style;
            for (const key in vars) {
                style.setProperty(`--${key}`, vars[key]);
            }
        }
    });
}

/**
 * v3-compatible async component API.
 * @internal the type is manually declared in <root>/types/v3-define-async-component.d.ts
 * because it relies on existing manual types
 */
function defineAsyncComponent(source) {
    if (isFunction(source)) {
        source = { loader: source };
    }
    const { loader, loadingComponent, errorComponent, delay = 200, timeout, // undefined = never times out
    suspensible = false, // in Vue 3 default is true
    onError: userOnError } = source;
    if (suspensible) {
        warn(`The suspensiblbe option for async components is not supported in Vue2. It is ignored.`);
    }
    let pendingRequest = null;
    let retries = 0;
    const retry = () => {
        retries++;
        pendingRequest = null;
        return load();
    };
    const load = () => {
        let thisRequest;
        return (pendingRequest ||
            (thisRequest = pendingRequest =
                loader()
                    .catch(err => {
                    err = err instanceof Error ? err : new Error(String(err));
                    if (userOnError) {
                        return new Promise((resolve, reject) => {
                            const userRetry = () => resolve(retry());
                            const userFail = () => reject(err);
                            userOnError(err, userRetry, userFail, retries + 1);
                        });
                    }
                    else {
                        throw err;
                    }
                })
                    .then((comp) => {
                    if (thisRequest !== pendingRequest && pendingRequest) {
                        return pendingRequest;
                    }
                    if (!comp) {
                        warn(`Async component loader resolved to undefined. ` +
                            `If you are using retry(), make sure to return its return value.`);
                    }
                    // interop module default
                    if (comp &&
                        (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
                        comp = comp.default;
                    }
                    if (comp && !isObject(comp) && !isFunction(comp)) {
                        throw new Error(`Invalid async component load result: ${comp}`);
                    }
                    return comp;
                })));
    };
    return () => {
        const component = load();
        return {
            component,
            delay,
            timeout,
            error: errorComponent,
            loading: loadingComponent
        };
    };
}

function createLifeCycle(hookName) {
    return (fn, target = currentInstance) => {
        if (!target) {
            warn(`${formatName(hookName)} is called when there is no active component instance to be ` +
                    `associated with. ` +
                    `Lifecycle injection APIs can only be used during execution of setup().`);
            return;
        }
        return injectHook(target, hookName, fn);
    };
}
function formatName(name) {
    if (name === 'beforeDestroy') {
        name = 'beforeUnmount';
    }
    else if (name === 'destroyed') {
        name = 'unmounted';
    }
    return `on${name[0].toUpperCase() + name.slice(1)}`;
}
function injectHook(instance, hookName, fn) {
    const options = instance.$options;
    options[hookName] = mergeLifecycleHook(options[hookName], fn);
}
const onBeforeMount = createLifeCycle('beforeMount');
const onMounted = createLifeCycle('mounted');
const onBeforeUpdate = createLifeCycle('beforeUpdate');
const onUpdated = createLifeCycle('updated');
const onBeforeUnmount = createLifeCycle('beforeDestroy');
const onUnmounted = createLifeCycle('destroyed');
const onActivated = createLifeCycle('activated');
const onDeactivated = createLifeCycle('deactivated');
const onServerPrefetch = createLifeCycle('serverPrefetch');
const onRenderTracked = createLifeCycle('renderTracked');
const onRenderTriggered = createLifeCycle('renderTriggered');
const injectErrorCapturedHook = createLifeCycle('errorCaptured');
function onErrorCaptured(hook, target = currentInstance) {
    injectErrorCapturedHook(hook, target);
}

/**
 * Note: also update dist/vue.runtime.mjs when adding new exports to this file.
 */
const version = '2.7.10';
/**
 * @internal type is manually declared in <root>/types/v3-define-component.d.ts
 */
function defineComponent(options) {
    return options;
}

var vca = /*#__PURE__*/Object.freeze({
  __proto__: null,
  version: version,
  defineComponent: defineComponent,
  ref: ref$1,
  shallowRef: shallowRef,
  isRef: isRef,
  toRef: toRef,
  toRefs: toRefs,
  unref: unref,
  proxyRefs: proxyRefs,
  customRef: customRef,
  triggerRef: triggerRef,
  reactive: reactive,
  isReactive: isReactive,
  isReadonly: isReadonly,
  isShallow: isShallow,
  isProxy: isProxy,
  shallowReactive: shallowReactive,
  markRaw: markRaw,
  toRaw: toRaw,
  readonly: readonly,
  shallowReadonly: shallowReadonly,
  computed: computed,
  watch: watch,
  watchEffect: watchEffect,
  watchPostEffect: watchPostEffect,
  watchSyncEffect: watchSyncEffect,
  EffectScope: EffectScope,
  effectScope: effectScope,
  onScopeDispose: onScopeDispose,
  getCurrentScope: getCurrentScope,
  provide: provide,
  inject: inject,
  h: h,
  getCurrentInstance: getCurrentInstance,
  useSlots: useSlots,
  useAttrs: useAttrs,
  useListeners: useListeners,
  mergeDefaults: mergeDefaults,
  nextTick: nextTick,
  set: set,
  del: del,
  useCssModule: useCssModule,
  useCssVars: useCssVars,
  defineAsyncComponent: defineAsyncComponent,
  onBeforeMount: onBeforeMount,
  onMounted: onMounted,
  onBeforeUpdate: onBeforeUpdate,
  onUpdated: onUpdated,
  onBeforeUnmount: onBeforeUnmount,
  onUnmounted: onUnmounted,
  onActivated: onActivated,
  onDeactivated: onDeactivated,
  onServerPrefetch: onServerPrefetch,
  onRenderTracked: onRenderTracked,
  onRenderTriggered: onRenderTriggered,
  onErrorCaptured: onErrorCaptured
});

const seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
    return val;
}
function _traverse(val, seen) {
    let i, keys;
    const isA = isArray(val);
    if ((!isA && !isObject(val)) ||
        Object.isFrozen(val) ||
        val instanceof VNode) {
        return;
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while (i--)
            _traverse(val[i], seen);
    }
    else if (isRef(val)) {
        _traverse(val.value, seen);
    }
    else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
            _traverse(val[keys[i]], seen);
    }
}

let uid$1 = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * @internal
 */
class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        recordEffectScope(this, 
        // if the active effect scope is manually created (not a component scope),
        // prioritize it
        activeEffectScope && !activeEffectScope._vm
            ? activeEffectScope
            : vm
                ? vm._scope
                : undefined);
        if ((this.vm = vm) && isRenderWatcher) {
            vm._watcher = this;
        }
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
            {
                this.onTrack = options.onTrack;
                this.onTrigger = options.onTrigger;
            }
        }
        else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid$1; // uid for batching
        this.active = true;
        this.post = false;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.expression = expOrFn.toString() ;
        // parse expression for getter
        if (isFunction(expOrFn)) {
            this.getter = expOrFn;
        }
        else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
                warn(`Failed watching path: "${expOrFn}" ` +
                        'Watcher only accepts simple dot-delimited paths. ' +
                        'For full control, use a function instead.', vm);
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        pushTarget(this);
        let value;
        const vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        }
        catch (e) {
            if (this.user) {
                handleError(e, vm, `getter for watcher "${this.expression}"`);
            }
            else {
                throw e;
            }
        }
        finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }
    /**
     * Add a dependency to this directive.
     */
    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true;
        }
        else if (this.sync) {
            this.run();
        }
        else {
            queueWatcher(this);
        }
    }
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get();
            if (value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep) {
                // set new value
                const oldValue = this.value;
                this.value = value;
                if (this.user) {
                    const info = `callback for watcher "${this.expression}"`;
                    invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info);
                }
                else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }
    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown() {
        if (this.vm && !this.vm._isBeingDestroyed) {
            remove$2(this.vm._scope.effects, this);
        }
        if (this.active) {
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
            if (this.onStop) {
                this.onStop();
            }
        }
    }
}

let mark;
let measure;
{
    const perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (perf &&
        // @ts-ignore
        perf.mark &&
        // @ts-ignore
        perf.measure &&
        // @ts-ignore
        perf.clearMarks &&
        // @ts-ignore
        perf.clearMeasures) {
        mark = tag => perf.mark(tag);
        measure = (name, startTag, endTag) => {
            perf.measure(name, startTag, endTag);
            perf.clearMarks(startTag);
            perf.clearMarks(endTag);
            // perf.clearMeasures(name)
        };
    }
}

function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    const listeners = vm.$options._parentListeners;
    if (listeners) {
        updateComponentListeners(vm, listeners);
    }
}
let target$1;
function add$1(event, fn) {
    target$1.$on(event, fn);
}
function remove$1(event, fn) {
    target$1.$off(event, fn);
}
function createOnceHandler$1(event, fn) {
    const _target = target$1;
    return function onceHandler() {
        const res = fn.apply(null, arguments);
        if (res !== null) {
            _target.$off(event, onceHandler);
        }
    };
}
function updateComponentListeners(vm, listeners, oldListeners) {
    target$1 = vm;
    updateListeners(listeners, oldListeners || {}, add$1, remove$1, createOnceHandler$1, vm);
    target$1 = undefined;
}
function eventsMixin(Vue) {
    const hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
        const vm = this;
        if (isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn);
            }
        }
        else {
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
        }
        return vm;
    };
    Vue.prototype.$once = function (event, fn) {
        const vm = this;
        function on() {
            vm.$off(event, on);
            fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm;
    };
    Vue.prototype.$off = function (event, fn) {
        const vm = this;
        // all
        if (!arguments.length) {
            vm._events = Object.create(null);
            return vm;
        }
        // array of events
        if (isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$off(event[i], fn);
            }
            return vm;
        }
        // specific event
        const cbs = vm._events[event];
        if (!cbs) {
            return vm;
        }
        if (!fn) {
            vm._events[event] = null;
            return vm;
        }
        // specific handler
        let cb;
        let i = cbs.length;
        while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
            }
        }
        return vm;
    };
    Vue.prototype.$emit = function (event) {
        const vm = this;
        {
            const lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(`Event "${lowerCaseEvent}" is emitted in component ` +
                    `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
                    `Note that HTML attributes are case-insensitive and you cannot use ` +
                    `v-on to listen to camelCase events when using in-DOM templates. ` +
                    `You should probably use "${hyphenate(event)}" instead of "${event}".`);
            }
        }
        let cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            const args = toArray(arguments, 1);
            const info = `event handler for "${event}"`;
            for (let i = 0, l = cbs.length; i < l; i++) {
                invokeWithErrorHandling(cbs[i], vm, args, vm, info);
            }
        }
        return vm;
    };
}

let activeInstance = null;
let isUpdatingChildComponent = false;
function setActiveInstance(vm) {
    const prevActiveInstance = activeInstance;
    activeInstance = vm;
    return () => {
        activeInstance = prevActiveInstance;
    };
}
function initLifecycle(vm) {
    const options = vm.$options;
    // locate first non-abstract parent
    let parent = options.parent;
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;
    vm.$children = [];
    vm.$refs = {};
    vm._provided = parent ? parent._provided : Object.create(null);
    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        const vm = this;
        const prevEl = vm.$el;
        const prevVnode = vm._vnode;
        const restoreActiveInstance = setActiveInstance(vm);
        vm._vnode = vnode;
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
        }
        else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode);
        }
        restoreActiveInstance();
        // update __vue__ reference
        if (prevEl) {
            prevEl.__vue__ = null;
        }
        if (vm.$el) {
            vm.$el.__vue__ = vm;
        }
        // if parent is an HOC, update its $el as well
        let wrapper = vm;
        while (wrapper &&
            wrapper.$vnode &&
            wrapper.$parent &&
            wrapper.$vnode === wrapper.$parent._vnode) {
            wrapper.$parent.$el = wrapper.$el;
            wrapper = wrapper.$parent;
        }
        // updated hook is called by the scheduler to ensure that children are
        // updated in a parent's updated hook.
    };
    Vue.prototype.$forceUpdate = function () {
        const vm = this;
        if (vm._watcher) {
            vm._watcher.update();
        }
    };
    Vue.prototype.$destroy = function () {
        const vm = this;
        if (vm._isBeingDestroyed) {
            return;
        }
        callHook$1(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        // remove self from parent
        const parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove$2(parent.$children, vm);
        }
        // teardown scope. this includes both the render watcher and other
        // watchers created
        vm._scope.stop();
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);
        // fire destroyed hook
        callHook$1(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
            vm.$vnode.parent = null;
        }
    };
}
function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
        // @ts-expect-error invalid type
        vm.$options.render = createEmptyVNode;
        {
            /* istanbul ignore if */
            if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                vm.$options.el ||
                el) {
                warn('You are using the runtime-only build of Vue where the template ' +
                    'compiler is not available. Either pre-compile the templates into ' +
                    'render functions, or use the compiler-included build.', vm);
            }
            else {
                warn('Failed to mount component: template or render function not defined.', vm);
            }
        }
    }
    callHook$1(vm, 'beforeMount');
    let updateComponent;
    /* istanbul ignore if */
    if (config.performance && mark) {
        updateComponent = () => {
            const name = vm._name;
            const id = vm._uid;
            const startTag = `vue-perf-start:${id}`;
            const endTag = `vue-perf-end:${id}`;
            mark(startTag);
            const vnode = vm._render();
            mark(endTag);
            measure(`vue ${name} render`, startTag, endTag);
            mark(startTag);
            vm._update(vnode, hydrating);
            mark(endTag);
            measure(`vue ${name} patch`, startTag, endTag);
        };
    }
    else {
        updateComponent = () => {
            vm._update(vm._render(), hydrating);
        };
    }
    const watcherOptions = {
        before() {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook$1(vm, 'beforeUpdate');
            }
        }
    };
    {
        watcherOptions.onTrack = e => callHook$1(vm, 'renderTracked', [e]);
        watcherOptions.onTrigger = e => callHook$1(vm, 'renderTriggered', [e]);
    }
    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, watcherOptions, true /* isRenderWatcher */);
    hydrating = false;
    // flush buffer for flush: "pre" watchers queued in setup()
    const preWatchers = vm._preWatchers;
    if (preWatchers) {
        for (let i = 0; i < preWatchers.length; i++) {
            preWatchers[i].run();
        }
    }
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook$1(vm, 'mounted');
    }
    return vm;
}
function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    {
        isUpdatingChildComponent = true;
    }
    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.
    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    const newScopedSlots = parentVnode.data.scopedSlots;
    const oldScopedSlots = vm.$scopedSlots;
    const hasDynamicScopedSlot = !!((newScopedSlots && !newScopedSlots.$stable) ||
        (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
        (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
        (!newScopedSlots && vm.$scopedSlots.$key));
    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    let needsForceUpdate = !!(renderChildren || // has new static slots
        vm.$options._renderChildren || // has old static slots
        hasDynamicScopedSlot);
    const prevVNode = vm.$vnode;
    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render
    if (vm._vnode) {
        // update child tree's parent
        vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;
    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    const attrs = parentVnode.data.attrs || emptyObject;
    if (vm._attrsProxy) {
        // force update if attrs are accessed and has changed since it may be
        // passed to a child component.
        if (syncSetupProxy(vm._attrsProxy, attrs, (prevVNode.data && prevVNode.data.attrs) || emptyObject, vm, '$attrs')) {
            needsForceUpdate = true;
        }
    }
    vm.$attrs = attrs;
    // update listeners
    listeners = listeners || emptyObject;
    const prevListeners = vm.$options._parentListeners;
    if (vm._listenersProxy) {
        syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, '$listeners');
    }
    vm.$listeners = vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, prevListeners);
    // update props
    if (propsData && vm.$options.props) {
        toggleObserving(false);
        const props = vm._props;
        const propKeys = vm.$options._propKeys || [];
        for (let i = 0; i < propKeys.length; i++) {
            const key = propKeys[i];
            const propOptions = vm.$options.props; // wtf flow?
            props[key] = validateProp(key, propOptions, propsData, vm);
        }
        toggleObserving(true);
        // keep a copy of raw propsData
        vm.$options.propsData = propsData;
    }
    // resolve slots + force update if has children
    if (needsForceUpdate) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
    }
    {
        isUpdatingChildComponent = false;
    }
}
function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
        if (vm._inactive)
            return true;
    }
    return false;
}
function activateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = false;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    else if (vm._directInactive) {
        return;
    }
    if (vm._inactive || vm._inactive === null) {
        vm._inactive = false;
        for (let i = 0; i < vm.$children.length; i++) {
            activateChildComponent(vm.$children[i]);
        }
        callHook$1(vm, 'activated');
    }
}
function deactivateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    if (!vm._inactive) {
        vm._inactive = true;
        for (let i = 0; i < vm.$children.length; i++) {
            deactivateChildComponent(vm.$children[i]);
        }
        callHook$1(vm, 'deactivated');
    }
}
function callHook$1(vm, hook, args, setContext = true) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    const prev = currentInstance;
    setContext && setCurrentInstance(vm);
    const handlers = vm.$options[hook];
    const info = `${hook} hook`;
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
    }
    setContext && setCurrentInstance(prev);
    popTarget();
}

const MAX_UPDATE_COUNT = 100;
const queue = [];
const activatedChildren = [];
let has = {};
let circular = {};
let waiting = false;
let flushing = false;
let index = 0;
/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
        circular = {};
    }
    waiting = flushing = false;
}
// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
let currentFlushTimestamp = 0;
// Async edge case fix requires storing an event listener's attach timestamp.
let getNow = Date.now;
// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
    const performance = window.performance;
    if (performance &&
        typeof performance.now === 'function' &&
        getNow() > document.createEvent('Event').timeStamp) {
        // if the event timestamp, although evaluated AFTER the Date.now(), is
        // smaller than it, it means the event is using a hi-res timestamp,
        // and we need to use the hi-res version for event listener timestamps as
        // well.
        getNow = () => performance.now();
    }
}
const sortCompareFn = (a, b) => {
    if (a.post) {
        if (!b.post)
            return 1;
    }
    else if (b.post) {
        return -1;
    }
    return a.id - b.id;
};
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher, id;
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(sortCompareFn);
    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
        // in dev build, check and stop circular updates.
        if (has[id] != null) {
            circular[id] = (circular[id] || 0) + 1;
            if (circular[id] > MAX_UPDATE_COUNT) {
                warn('You may have an infinite update loop ' +
                    (watcher.user
                        ? `in watcher with expression "${watcher.expression}"`
                        : `in a component render function.`), watcher.vm);
                break;
            }
        }
    }
    // keep copies of post queues before resetting state
    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();
    resetSchedulerState();
    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);
    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
        devtools.emit('flush');
    }
}
function callUpdatedHooks(queue) {
    let i = queue.length;
    while (i--) {
        const watcher = queue[i];
        const vm = watcher.vm;
        if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook$1(vm, 'updated');
        }
    }
}
/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent(vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
}
function callActivatedHooks(queue) {
    for (let i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */);
    }
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] != null) {
        return;
    }
    if (watcher === Dep.target && watcher.noRecurse) {
        return;
    }
    has[id] = true;
    if (!flushing) {
        queue.push(watcher);
    }
    else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        let i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
            i--;
        }
        queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
        waiting = true;
        if (!config.async) {
            flushSchedulerQueue();
            return;
        }
        nextTick(flushSchedulerQueue);
    }
}

function initProvide(vm) {
    const provideOption = vm.$options.provide;
    if (provideOption) {
        const provided = isFunction(provideOption)
            ? provideOption.call(vm)
            : provideOption;
        if (!isObject(provided)) {
            return;
        }
        const source = resolveProvided(vm);
        // IE9 doesn't support Object.getOwnPropertyDescriptors so we have to
        // iterate the keys ourselves.
        const keys = hasSymbol ? Reflect.ownKeys(provided) : Object.keys(provided);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            Object.defineProperty(source, key, Object.getOwnPropertyDescriptor(provided, key));
        }
    }
}
function initInjections(vm) {
    const result = resolveInject(vm.$options.inject, vm);
    if (result) {
        toggleObserving(false);
        Object.keys(result).forEach(key => {
            /* istanbul ignore else */
            {
                defineReactive(vm, key, result[key], () => {
                    warn(`Avoid mutating an injected value directly since the changes will be ` +
                        `overwritten whenever the provided component re-renders. ` +
                        `injection being mutated: "${key}"`, vm);
                });
            }
        });
        toggleObserving(true);
    }
}
function resolveInject(inject, vm) {
    if (inject) {
        // inject is :any because flow is not smart enough to figure out cached
        const result = Object.create(null);
        const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // #6574 in case the inject object is observed...
            if (key === '__ob__')
                continue;
            const provideKey = inject[key].from;
            if (provideKey in vm._provided) {
                result[key] = vm._provided[provideKey];
            }
            else if ('default' in inject[key]) {
                const provideDefault = inject[key].default;
                result[key] = isFunction(provideDefault)
                    ? provideDefault.call(vm)
                    : provideDefault;
            }
            else {
                warn(`Injection "${key}" not found`, vm);
            }
        }
        return result;
    }
}

function FunctionalRenderContext(data, props, children, parent, Ctor) {
    const options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    let contextVm;
    if (hasOwn(parent, '_uid')) {
        contextVm = Object.create(parent);
        contextVm._original = parent;
    }
    else {
        // the context vm passed in is a functional context as well.
        // in this case we want to make sure we are able to get a hold to the
        // real context instance.
        contextVm = parent;
        // @ts-ignore
        parent = parent._original;
    }
    const isCompiled = isTrue(options._compiled);
    const needNormalization = !isCompiled;
    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = () => {
        if (!this.$slots) {
            normalizeScopedSlots(parent, data.scopedSlots, (this.$slots = resolveSlots(children, parent)));
        }
        return this.$slots;
    };
    Object.defineProperty(this, 'scopedSlots', {
        enumerable: true,
        get() {
            return normalizeScopedSlots(parent, data.scopedSlots, this.slots());
        }
    });
    // support for compiled functional template
    if (isCompiled) {
        // exposing $options for renderStatic()
        this.$options = options;
        // pre-resolve slots for renderSlot()
        this.$slots = this.slots();
        this.$scopedSlots = normalizeScopedSlots(parent, data.scopedSlots, this.$slots);
    }
    if (options._scopeId) {
        this._c = (a, b, c, d) => {
            const vnode = createElement$1(contextVm, a, b, c, d, needNormalization);
            if (vnode && !isArray(vnode)) {
                vnode.fnScopeId = options._scopeId;
                vnode.fnContext = parent;
            }
            return vnode;
        };
    }
    else {
        this._c = (a, b, c, d) => createElement$1(contextVm, a, b, c, d, needNormalization);
    }
}
installRenderHelpers(FunctionalRenderContext.prototype);
function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
    const options = Ctor.options;
    const props = {};
    const propOptions = options.props;
    if (isDef(propOptions)) {
        for (const key in propOptions) {
            props[key] = validateProp(key, propOptions, propsData || emptyObject);
        }
    }
    else {
        if (isDef(data.attrs))
            mergeProps(props, data.attrs);
        if (isDef(data.props))
            mergeProps(props, data.props);
    }
    const renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
    const vnode = options.render.call(null, renderContext._c, renderContext);
    if (vnode instanceof VNode) {
        return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
    }
    else if (isArray(vnode)) {
        const vnodes = normalizeChildren(vnode) || [];
        const res = new Array(vnodes.length);
        for (let i = 0; i < vnodes.length; i++) {
            res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
        }
        return res;
    }
}
function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    const clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
        (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext =
            renderContext;
    }
    if (data.slot) {
        (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone;
}
function mergeProps(to, from) {
    for (const key in from) {
        to[camelize(key)] = from[key];
    }
}

function getComponentName(options) {
    return options.name || options.__name || options._componentTag;
}
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
    init(vnode, hydrating) {
        if (vnode.componentInstance &&
            !vnode.componentInstance._isDestroyed &&
            vnode.data.keepAlive) {
            // kept-alive components, treat as a patch
            const mountedNode = vnode; // work around flow
            componentVNodeHooks.prepatch(mountedNode, mountedNode);
        }
        else {
            const child = (vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance));
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        }
    },
    prepatch(oldVnode, vnode) {
        const options = vnode.componentOptions;
        const child = (vnode.componentInstance = oldVnode.componentInstance);
        updateChildComponent(child, options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
        );
    },
    insert(vnode) {
        const { context, componentInstance } = vnode;
        if (!componentInstance._isMounted) {
            componentInstance._isMounted = true;
            callHook$1(componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
            if (context._isMounted) {
                // vue-router#1212
                // During updates, a kept-alive component's child components may
                // change, so directly walking the tree here may call activated hooks
                // on incorrect children. Instead we push them into a queue which will
                // be processed after the whole patch process ended.
                queueActivatedComponent(componentInstance);
            }
            else {
                activateChildComponent(componentInstance, true /* direct */);
            }
        }
    },
    destroy(vnode) {
        const { componentInstance } = vnode;
        if (!componentInstance._isDestroyed) {
            if (!vnode.data.keepAlive) {
                componentInstance.$destroy();
            }
            else {
                deactivateChildComponent(componentInstance, true /* direct */);
            }
        }
    }
};
const hooksToMerge = Object.keys(componentVNodeHooks);
function createComponent(Ctor, data, context, children, tag) {
    if (isUndef(Ctor)) {
        return;
    }
    const baseCtor = context.$options._base;
    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
    }
    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
        {
            warn(`Invalid Component definition: ${String(Ctor)}`, context);
        }
        return;
    }
    // async component
    let asyncFactory;
    // @ts-expect-error
    if (isUndef(Ctor.cid)) {
        asyncFactory = Ctor;
        Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
        if (Ctor === undefined) {
            // return a placeholder node for async component, which is rendered
            // as a comment node but preserves all the raw information for the node.
            // the information will be used for async server-rendering and hydration.
            return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
        }
    }
    data = data || {};
    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);
    // transform component v-model data into props & events
    if (isDef(data.model)) {
        // @ts-expect-error
        transformModel(Ctor.options, data);
    }
    // extract props
    // @ts-expect-error
    const propsData = extractPropsFromVNodeData(data, Ctor, tag);
    // functional component
    // @ts-expect-error
    if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data, context, children);
    }
    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    const listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;
    // @ts-expect-error
    if (isTrue(Ctor.options.abstract)) {
        // abstract components do not keep anything
        // other than props & listeners & slot
        // work around flow
        const slot = data.slot;
        data = {};
        if (slot) {
            data.slot = slot;
        }
    }
    // install component management hooks onto the placeholder node
    installComponentHooks(data);
    // return a placeholder vnode
    // @ts-expect-error
    const name = getComponentName(Ctor.options) || tag;
    const vnode = new VNode(
    // @ts-expect-error
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`, data, undefined, undefined, undefined, context, 
    // @ts-expect-error
    { Ctor, propsData, listeners, tag, children }, asyncFactory);
    return vnode;
}
function createComponentInstanceForVnode(
// we know it's MountedComponentVNode but flow doesn't
vnode, 
// activeInstance in lifecycle state
parent) {
    const options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent
    };
    // check inline-template render functions
    const inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options);
}
function installComponentHooks(data) {
    const hooks = data.hook || (data.hook = {});
    for (let i = 0; i < hooksToMerge.length; i++) {
        const key = hooksToMerge[i];
        const existing = hooks[key];
        const toMerge = componentVNodeHooks[key];
        // @ts-expect-error
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
        }
    }
}
function mergeHook(f1, f2) {
    const merged = (a, b) => {
        // flow complains about extra args which is why we use any
        f1(a, b);
        f2(a, b);
    };
    merged._merged = true;
    return merged;
}
// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
    const prop = (options.model && options.model.prop) || 'value';
    const event = (options.model && options.model.event) || 'input';
    (data.attrs || (data.attrs = {}))[prop] = data.model.value;
    const on = data.on || (data.on = {});
    const existing = on[event];
    const callback = data.model.callback;
    if (isDef(existing)) {
        if (isArray(existing)
            ? existing.indexOf(callback) === -1
            : existing !== callback) {
            on[event] = [callback].concat(existing);
        }
    }
    else {
        on[event] = callback;
    }
}

let warn = noop;
let tip = noop;
let generateComponentTrace; // work around flow check
let formatComponentName;
{
    const hasConsole = typeof console !== 'undefined';
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
    warn = (msg, vm = currentInstance) => {
        const trace = vm ? generateComponentTrace(vm) : '';
        if (config.warnHandler) {
            config.warnHandler.call(null, msg, vm, trace);
        }
        else if (hasConsole && !config.silent) {
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };
    tip = (msg, vm) => {
        if (hasConsole && !config.silent) {
            console.warn(`[Vue tip]: ${msg}` + (vm ? generateComponentTrace(vm) : ''));
        }
    };
    formatComponentName = (vm, includeFile) => {
        if (vm.$root === vm) {
            return '<Root>';
        }
        const options = isFunction(vm) && vm.cid != null
            ? vm.options
            : vm._isVue
                ? vm.$options || vm.constructor.options
                : vm;
        let name = getComponentName(options);
        const file = options.__file;
        if (!name && file) {
            const match = file.match(/([^/\\]+)\.vue$/);
            name = match && match[1];
        }
        return ((name ? `<${classify(name)}>` : `<Anonymous>`) +
            (file && includeFile !== false ? ` at ${file}` : ''));
    };
    const repeat = (str, n) => {
        let res = '';
        while (n) {
            if (n % 2 === 1)
                res += str;
            if (n > 1)
                str += str;
            n >>= 1;
        }
        return res;
    };
    generateComponentTrace = (vm) => {
        if (vm._isVue && vm.$parent) {
            const tree = [];
            let currentRecursiveSequence = 0;
            while (vm) {
                if (tree.length > 0) {
                    const last = tree[tree.length - 1];
                    if (last.constructor === vm.constructor) {
                        currentRecursiveSequence++;
                        vm = vm.$parent;
                        continue;
                    }
                    else if (currentRecursiveSequence > 0) {
                        tree[tree.length - 1] = [last, currentRecursiveSequence];
                        currentRecursiveSequence = 0;
                    }
                }
                tree.push(vm);
                vm = vm.$parent;
            }
            return ('\n\nfound in\n\n' +
                tree
                    .map((vm, i) => `${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${isArray(vm)
                    ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
                    : formatComponentName(vm)}`)
                    .join('\n'));
        }
        else {
            return `\n\n(found in ${formatComponentName(vm)})`;
        }
    };
}

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies;
/**
 * Options with restrictions
 */
{
    strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
            warn(`option "${key}" can only be used during instance ` +
                'creation with the `new` keyword.');
        }
        return defaultStrat(parent, child);
    };
}
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
    if (!from)
        return to;
    let key, toVal, fromVal;
    const keys = hasSymbol
        ? Reflect.ownKeys(from)
        : Object.keys(from);
    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__')
            continue;
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            set(to, key, fromVal);
        }
        else if (toVal !== fromVal &&
            isPlainObject(toVal) &&
            isPlainObject(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}
/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal;
        }
        if (!parentVal) {
            return childVal;
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(isFunction(childVal) ? childVal.call(this, this) : childVal, isFunction(parentVal) ? parentVal.call(this, this) : parentVal);
        };
    }
    else {
        return function mergedInstanceDataFn() {
            // instance merge
            const instanceData = isFunction(childVal)
                ? childVal.call(vm, vm)
                : childVal;
            const defaultData = isFunction(parentVal)
                ? parentVal.call(vm, vm)
                : parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            }
            else {
                return defaultData;
            }
        };
    }
}
strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            warn('The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.', vm);
            return parentVal;
        }
        return mergeDataOrFn(parentVal, childVal);
    }
    return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */
function mergeLifecycleHook(parentVal, childVal) {
    const res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
    const res = [];
    for (let i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeLifecycleHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
    const res = Object.create(parentVal || null);
    if (childVal) {
        assertObjectType(key, childVal, vm);
        return extend(res, childVal);
    }
    else {
        return res;
    }
}
ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
    // work around Firefox's Object.prototype.watch...
    //@ts-expect-error work around
    if (parentVal === nativeWatch)
        parentVal = undefined;
    //@ts-expect-error work around
    if (childVal === nativeWatch)
        childVal = undefined;
    /* istanbul ignore if */
    if (!childVal)
        return Object.create(parentVal || null);
    {
        assertObjectType(key, childVal, vm);
    }
    if (!parentVal)
        return childVal;
    const ret = {};
    extend(ret, parentVal);
    for (const key in childVal) {
        let parent = ret[key];
        const child = childVal[key];
        if (parent && !isArray(parent)) {
            parent = [parent];
        }
        ret[key] = parent ? parent.concat(child) : isArray(child) ? child : [child];
    }
    return ret;
};
/**
 * Other object hashes.
 */
strats.props =
    strats.methods =
        strats.inject =
            strats.computed =
                function (parentVal, childVal, vm, key) {
                    if (childVal && true) {
                        assertObjectType(key, childVal, vm);
                    }
                    if (!parentVal)
                        return childVal;
                    const ret = Object.create(null);
                    extend(ret, parentVal);
                    if (childVal)
                        extend(ret, childVal);
                    return ret;
                };
strats.provide = mergeDataOrFn;
/**
 * Default strategy.
 */
const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */
function checkComponents(options) {
    for (const key in options.components) {
        validateComponentName(key);
    }
}
function validateComponentName(name) {
    if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
        warn('Invalid component name: "' +
            name +
            '". Component names ' +
            'should conform to valid custom element name in html5 specification.');
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
        warn('Do not use built-in or reserved HTML elements as component ' +
            'id: ' +
            name);
    }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
    const props = options.props;
    if (!props)
        return;
    const res = {};
    let i, val, name;
    if (isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === 'string') {
                name = camelize(val);
                res[name] = { type: null };
            }
            else {
                warn('props must be strings when using array syntax.');
            }
        }
    }
    else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : { type: val };
        }
    }
    else {
        warn(`Invalid value for option "props": expected an Array or an Object, ` +
            `but got ${toRawType(props)}.`, vm);
    }
    options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
    const inject = options.inject;
    if (!inject)
        return;
    const normalized = (options.inject = {});
    if (isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] };
        }
    }
    else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key];
            normalized[key] = isPlainObject(val)
                ? extend({ from: key }, val)
                : { from: val };
        }
    }
    else {
        warn(`Invalid value for option "inject": expected an Array or an Object, ` +
            `but got ${toRawType(inject)}.`, vm);
    }
}
/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives$1(options) {
    const dirs = options.directives;
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key];
            if (isFunction(def)) {
                dirs[key] = { bind: def, update: def };
            }
        }
    }
}
function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) {
        warn(`Invalid value for option "${name}": expected an Object, ` +
            `but got ${toRawType(value)}.`, vm);
    }
}
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
    {
        checkComponents(child);
    }
    if (isFunction(child)) {
        // @ts-expect-error
        child = child.options;
    }
    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives$1(child);
    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }
        if (child.mixins) {
            for (let i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
    }
    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
        return;
    }
    const assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id))
        return assets[id];
    const camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId))
        return assets[camelizedId];
    const PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId))
        return assets[PascalCaseId];
    // fallback to prototype chain
    const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (warnMissing && !res) {
        warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id);
    }
    return res;
}

function validateProp(key, propOptions, propsData, vm) {
    const prop = propOptions[key];
    const absent = !hasOwn(propsData, key);
    let value = propsData[key];
    // boolean casting
    const booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
            value = false;
        }
        else if (value === '' || value === hyphenate(key)) {
            // only cast empty string / same name to boolean if
            // boolean has higher priority
            const stringIndex = getTypeIndex(String, prop.type);
            if (stringIndex < 0 || booleanIndex < stringIndex) {
                value = true;
            }
        }
    }
    // check default value
    if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key);
        // since the default value is a fresh copy,
        // make sure to observe it.
        const prevShouldObserve = shouldObserve;
        toggleObserving(true);
        observe(value);
        toggleObserving(prevShouldObserve);
    }
    {
        assertProp(prop, key, value, vm, absent);
    }
    return value;
}
/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
        return undefined;
    }
    const def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
        warn('Invalid default value for prop "' +
            key +
            '": ' +
            'Props with type Object/Array must use a factory function ' +
            'to return the default value.', vm);
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm &&
        vm.$options.propsData &&
        vm.$options.propsData[key] === undefined &&
        vm._props[key] !== undefined) {
        return vm._props[key];
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return isFunction(def) && getType(prop.type) !== 'Function'
        ? def.call(vm)
        : def;
}
/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
        warn('Missing required prop: "' + name + '"', vm);
        return;
    }
    if (value == null && !prop.required) {
        return;
    }
    let type = prop.type;
    let valid = !type || type === true;
    const expectedTypes = [];
    if (type) {
        if (!isArray(type)) {
            type = [type];
        }
        for (let i = 0; i < type.length && !valid; i++) {
            const assertedType = assertType(value, type[i], vm);
            expectedTypes.push(assertedType.expectedType || '');
            valid = assertedType.valid;
        }
    }
    const haveExpectedTypes = expectedTypes.some(t => t);
    if (!valid && haveExpectedTypes) {
        warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
        return;
    }
    const validator = prop.validator;
    if (validator) {
        if (!validator(value)) {
            warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
        }
    }
}
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
function assertType(value, type, vm) {
    let valid;
    const expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
        const t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === 'object') {
            valid = value instanceof type;
        }
    }
    else if (expectedType === 'Object') {
        valid = isPlainObject(value);
    }
    else if (expectedType === 'Array') {
        valid = isArray(value);
    }
    else {
        try {
            valid = value instanceof type;
        }
        catch (e) {
            warn('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
            valid = false;
        }
    }
    return {
        valid,
        expectedType
    };
}
const functionTypeCheckRE = /^\s*function (\w+)/;
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
    const match = fn && fn.toString().match(functionTypeCheckRE);
    return match ? match[1] : '';
}
function isSameType(a, b) {
    return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
    if (!isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    for (let i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
            return i;
        }
    }
    return -1;
}
function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}".` +
        ` Expected ${expectedTypes.map(capitalize).join(', ')}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        isExplicable(typeof value) &&
        !isBoolean(expectedType, receivedType)) {
        message += ` with value ${styleValue(value, expectedType)}`;
    }
    message += `, got ${receivedType} `;
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
        message += `with value ${styleValue(value, receivedType)}.`;
    }
    return message;
}
function styleValue(value, type) {
    if (type === 'String') {
        return `"${value}"`;
    }
    else if (type === 'Number') {
        return `${Number(value)}`;
    }
    else {
        return `${value}`;
    }
}
const EXPLICABLE_TYPES = ['string', 'number', 'boolean'];
function isExplicable(value) {
    return EXPLICABLE_TYPES.some(elem => value.toLowerCase() === elem);
}
function isBoolean(...args) {
    return args.some(elem => elem.toLowerCase() === 'boolean');
}

/* not type checking this file because flow doesn't play well with Proxy */
let initProxy;
{
    const allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
        'require' // for Webpack/Browserify
    );
    const warnNonPresent = (target, key) => {
        warn(`Property or method "${key}" is not defined on the instance but ` +
            'referenced during render. Make sure that this property is reactive, ' +
            'either in the data option, or for class-based components, by ' +
            'initializing the property. ' +
            'See: https://v2.vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
    };
    const warnReservedPrefix = (target, key) => {
        warn(`Property "${key}" must be accessed with "$data.${key}" because ` +
            'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
            'prevent conflicts with Vue internals. ' +
            'See: https://v2.vuejs.org/v2/api/#data', target);
    };
    const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
    if (hasProxy) {
        const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
            set(target, key, value) {
                if (isBuiltInModifier(key)) {
                    warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`);
                    return false;
                }
                else {
                    target[key] = value;
                    return true;
                }
            }
        });
    }
    const hasHandler = {
        has(target, key) {
            const has = key in target;
            const isAllowed = allowedGlobals(key) ||
                (typeof key === 'string' &&
                    key.charAt(0) === '_' &&
                    !(key in target.$data));
            if (!has && !isAllowed) {
                if (key in target.$data)
                    warnReservedPrefix(target, key);
                else
                    warnNonPresent(target, key);
            }
            return has || !isAllowed;
        }
    };
    const getHandler = {
        get(target, key) {
            if (typeof key === 'string' && !(key in target)) {
                if (key in target.$data)
                    warnReservedPrefix(target, key);
                else
                    warnNonPresent(target, key);
            }
            return target[key];
        }
    };
    initProxy = function initProxy(vm) {
        if (hasProxy) {
            // determine which proxy handler to use
            const options = vm.$options;
            const handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
            vm._renderProxy = new Proxy(vm, handlers);
        }
        else {
            vm._renderProxy = vm;
        }
    };
}

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function initState(vm) {
    const opts = vm.$options;
    if (opts.props)
        initProps$1(vm, opts.props);
    // Composition API
    initSetup(vm);
    if (opts.methods)
        initMethods(vm, opts.methods);
    if (opts.data) {
        initData(vm);
    }
    else {
        const ob = observe((vm._data = {}));
        ob && ob.vmCount++;
    }
    if (opts.computed)
        initComputed$1(vm, opts.computed);
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}
function initProps$1(vm, propsOptions) {
    const propsData = vm.$options.propsData || {};
    const props = (vm._props = shallowReactive({}));
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = (vm.$options._propKeys = []);
    const isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false);
    }
    for (const key in propsOptions) {
        keys.push(key);
        const value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        {
            const hyphenatedKey = hyphenate(key);
            if (isReservedAttribute(hyphenatedKey) ||
                config.isReservedAttr(hyphenatedKey)) {
                warn(`"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`, vm);
            }
            defineReactive(props, key, value, () => {
                if (!isRoot && !isUpdatingChildComponent) {
                    warn(`Avoid mutating a prop directly since the value will be ` +
                        `overwritten whenever the parent component re-renders. ` +
                        `Instead, use a data or computed property based on the prop's ` +
                        `value. Prop being mutated: "${key}"`, vm);
                }
            });
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, `_props`, key);
        }
    }
    toggleObserving(true);
}
function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? getData(data, vm) : data || {};
    if (!isPlainObject(data)) {
        data = {};
        warn('data functions should return an object:\n' +
                'https://v2.vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
    }
    // proxy data on instance
    const keys = Object.keys(data);
    const props = vm.$options.props;
    const methods = vm.$options.methods;
    let i = keys.length;
    while (i--) {
        const key = keys[i];
        {
            if (methods && hasOwn(methods, key)) {
                warn(`Method "${key}" has already been defined as a data property.`, vm);
            }
        }
        if (props && hasOwn(props, key)) {
            warn(`The data property "${key}" is already declared as a prop. ` +
                    `Use prop default value instead.`, vm);
        }
        else if (!isReserved(key)) {
            proxy(vm, `_data`, key);
        }
    }
    // observe data
    const ob = observe(data);
    ob && ob.vmCount++;
}
function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
        return data.call(vm, vm);
    }
    catch (e) {
        handleError(e, vm, `data()`);
        return {};
    }
    finally {
        popTarget();
    }
}
const computedWatcherOptions = { lazy: true };
function initComputed$1(vm, computed) {
    // $flow-disable-line
    const watchers = (vm._computedWatchers = Object.create(null));
    // computed properties are just getters during SSR
    const isSSR = isServerRendering();
    for (const key in computed) {
        const userDef = computed[key];
        const getter = isFunction(userDef) ? userDef : userDef.get;
        if (getter == null) {
            warn(`Getter is missing for computed property "${key}".`, vm);
        }
        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
        }
        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        }
        else {
            if (key in vm.$data) {
                warn(`The computed property "${key}" is already defined in data.`, vm);
            }
            else if (vm.$options.props && key in vm.$options.props) {
                warn(`The computed property "${key}" is already defined as a prop.`, vm);
            }
            else if (vm.$options.methods && key in vm.$options.methods) {
                warn(`The computed property "${key}" is already defined as a method.`, vm);
            }
        }
    }
}
function defineComputed(target, key, userDef) {
    const shouldCache = !isServerRendering();
    if (isFunction(userDef)) {
        sharedPropertyDefinition.get = shouldCache
            ? createComputedGetter(key)
            : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
    }
    else {
        sharedPropertyDefinition.get = userDef.get
            ? shouldCache && userDef.cache !== false
                ? createComputedGetter(key)
                : createGetterInvoker(userDef.get)
            : noop;
        sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
            warn(`Computed property "${key}" was assigned to but it has no setter.`, this);
        };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                if (Dep.target.onTrack) {
                    Dep.target.onTrack({
                        effect: Dep.target,
                        target: this,
                        type: "get" /* TrackOpTypes.GET */,
                        key
                    });
                }
                watcher.depend();
            }
            return watcher.value;
        }
    };
}
function createGetterInvoker(fn) {
    return function computedGetter() {
        return fn.call(this, this);
    };
}
function initMethods(vm, methods) {
    const props = vm.$options.props;
    for (const key in methods) {
        {
            if (typeof methods[key] !== 'function') {
                warn(`Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
                    `Did you reference the function correctly?`, vm);
            }
            if (props && hasOwn(props, key)) {
                warn(`Method "${key}" has already been defined as a prop.`, vm);
            }
            if (key in vm && isReserved(key)) {
                warn(`Method "${key}" conflicts with an existing Vue instance method. ` +
                    `Avoid defining component methods that start with _ or $.`);
            }
        }
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
}
function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key];
        if (isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        }
        else {
            createWatcher(vm, key, handler);
        }
    }
}
function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}
function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    const dataDef = {};
    dataDef.get = function () {
        return this._data;
    };
    const propsDef = {};
    propsDef.get = function () {
        return this._props;
    };
    {
        dataDef.set = function () {
            warn('Avoid replacing instance root $data. ' +
                'Use nested data properties instead.', this);
        };
        propsDef.set = function () {
            warn(`$props is readonly.`, this);
        };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);
    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this;
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options);
        }
        options = options || {};
        options.user = true;
        const watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
            const info = `callback for immediate watcher "${watcher.expression}"`;
            pushTarget();
            invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
            popTarget();
        }
        return function unwatchFn() {
            watcher.teardown();
        };
    };
}

let uid = 0;
function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        // a uid
        vm._uid = uid++;
        let startTag, endTag;
        /* istanbul ignore if */
        if (config.performance && mark) {
            startTag = `vue-perf-start:${vm._uid}`;
            endTag = `vue-perf-end:${vm._uid}`;
            mark(startTag);
        }
        // a flag to mark this as a Vue instance without having to do instanceof
        // check
        vm._isVue = true;
        // avoid instances from being observed
        vm.__v_skip = true;
        // effect scope
        vm._scope = new EffectScope(true /* detached */);
        vm._scope._vm = true;
        // merge options
        if (options && options._isComponent) {
            // optimize internal component instantiation
            // since dynamic options merging is pretty slow, and none of the
            // internal component options needs special treatment.
            initInternalComponent(vm, options);
        }
        else {
            vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
        }
        /* istanbul ignore else */
        {
            initProxy(vm);
        }
        // expose real self
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook$1(vm, 'beforeCreate', undefined, false /* setContext */);
        initInjections(vm); // resolve injections before data/props
        initState(vm);
        initProvide(vm); // resolve provide after data/props
        callHook$1(vm, 'created');
        /* istanbul ignore if */
        if (config.performance && mark) {
            vm._name = formatComponentName(vm, false);
            mark(endTag);
            measure(`vue ${vm._name} init`, startTag, endTag);
        }
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
}
function initInternalComponent(vm, options) {
    const opts = (vm.$options = Object.create(vm.constructor.options));
    // doing this because it's faster than dynamic enumeration.
    const parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    const vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;
    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
    }
}
function resolveConstructorOptions(Ctor) {
    let options = Ctor.options;
    if (Ctor.super) {
        const superOptions = resolveConstructorOptions(Ctor.super);
        const cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
            // super option changed,
            // need to resolve new options.
            Ctor.superOptions = superOptions;
            // check if there are any late-modified/attached options (#4976)
            const modifiedOptions = resolveModifiedOptions(Ctor);
            // update base extend options
            if (modifiedOptions) {
                extend(Ctor.extendOptions, modifiedOptions);
            }
            options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
            if (options.name) {
                options.components[options.name] = Ctor;
            }
        }
    }
    return options;
}
function resolveModifiedOptions(Ctor) {
    let modified;
    const latest = Ctor.options;
    const sealed = Ctor.sealedOptions;
    for (const key in latest) {
        if (latest[key] !== sealed[key]) {
            if (!modified)
                modified = {};
            modified[key] = latest[key];
        }
    }
    return modified;
}

function Vue(options) {
    if (!(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}
//@ts-expect-error Vue has function type
initMixin$1(Vue);
//@ts-expect-error Vue has function type
stateMixin(Vue);
//@ts-expect-error Vue has function type
eventsMixin(Vue);
//@ts-expect-error Vue has function type
lifecycleMixin(Vue);
//@ts-expect-error Vue has function type
renderMixin(Vue);

function initUse(Vue) {
    Vue.use = function (plugin) {
        const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }
        // additional parameters
        const args = toArray(arguments, 1);
        args.unshift(this);
        if (isFunction(plugin.install)) {
            plugin.install.apply(plugin, args);
        }
        else if (isFunction(plugin)) {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
    };
}

function initMixin(Vue) {
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}

function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    let cid = 1;
    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        const Super = this;
        const SuperId = Super.cid;
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId];
        }
        const name = getComponentName(extendOptions) || getComponentName(Super.options);
        if (name) {
            validateComponentName(name);
        }
        const Sub = function VueComponent(options) {
            this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub['super'] = Super;
        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
            initProps(Sub);
        }
        if (Sub.options.computed) {
            initComputed(Sub);
        }
        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend;
        Sub.mixin = Super.mixin;
        Sub.use = Super.use;
        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type];
        });
        // enable recursive self-lookup
        if (name) {
            Sub.options.components[name] = Sub;
        }
        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        Sub.sealedOptions = extend({}, Sub.options);
        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub;
    };
}
function initProps(Comp) {
    const props = Comp.options.props;
    for (const key in props) {
        proxy(Comp.prototype, `_props`, key);
    }
}
function initComputed(Comp) {
    const computed = Comp.options.computed;
    for (const key in computed) {
        defineComputed(Comp.prototype, key, computed[key]);
    }
}

function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(type => {
        // @ts-expect-error function is not exact same type
        Vue[type] = function (id, definition) {
            if (!definition) {
                return this.options[type + 's'][id];
            }
            else {
                /* istanbul ignore if */
                if (type === 'component') {
                    validateComponentName(id);
                }
                if (type === 'component' && isPlainObject(definition)) {
                    // @ts-expect-error
                    definition.name = definition.name || id;
                    definition = this.options._base.extend(definition);
                }
                if (type === 'directive' && isFunction(definition)) {
                    definition = { bind: definition, update: definition };
                }
                this.options[type + 's'][id] = definition;
                return definition;
            }
        };
    });
}

function _getComponentName(opts) {
    return opts && (getComponentName(opts.Ctor.options) || opts.tag);
}
function matches(pattern, name) {
    if (isArray(pattern)) {
        return pattern.indexOf(name) > -1;
    }
    else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (isRegExp(pattern)) {
        return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
}
function pruneCache(keepAliveInstance, filter) {
    const { cache, keys, _vnode } = keepAliveInstance;
    for (const key in cache) {
        const entry = cache[key];
        if (entry) {
            const name = entry.name;
            if (name && !filter(name)) {
                pruneCacheEntry(cache, key, keys, _vnode);
            }
        }
    }
}
function pruneCacheEntry(cache, key, keys, current) {
    const entry = cache[key];
    if (entry && (!current || entry.tag !== current.tag)) {
        // @ts-expect-error can be undefined
        entry.componentInstance.$destroy();
    }
    cache[key] = null;
    remove$2(keys, key);
}
const patternTypes = [String, RegExp, Array];
// TODO defineComponent
var KeepAlive = {
    name: 'keep-alive',
    abstract: true,
    props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [String, Number]
    },
    methods: {
        cacheVNode() {
            const { cache, keys, vnodeToCache, keyToCache } = this;
            if (vnodeToCache) {
                const { tag, componentInstance, componentOptions } = vnodeToCache;
                cache[keyToCache] = {
                    name: _getComponentName(componentOptions),
                    tag,
                    componentInstance
                };
                keys.push(keyToCache);
                // prune oldest entry
                if (this.max && keys.length > parseInt(this.max)) {
                    pruneCacheEntry(cache, keys[0], keys, this._vnode);
                }
                this.vnodeToCache = null;
            }
        }
    },
    created() {
        this.cache = Object.create(null);
        this.keys = [];
    },
    destroyed() {
        for (const key in this.cache) {
            pruneCacheEntry(this.cache, key, this.keys);
        }
    },
    mounted() {
        this.cacheVNode();
        this.$watch('include', val => {
            pruneCache(this, name => matches(val, name));
        });
        this.$watch('exclude', val => {
            pruneCache(this, name => !matches(val, name));
        });
    },
    updated() {
        this.cacheVNode();
    },
    render() {
        const slot = this.$slots.default;
        const vnode = getFirstComponentChild(slot);
        const componentOptions = vnode && vnode.componentOptions;
        if (componentOptions) {
            // check pattern
            const name = _getComponentName(componentOptions);
            const { include, exclude } = this;
            if (
            // not included
            (include && (!name || !matches(include, name))) ||
                // excluded
                (exclude && name && matches(exclude, name))) {
                return vnode;
            }
            const { cache, keys } = this;
            const key = vnode.key == null
                ? // same constructor may get registered as different local components
                    // so cid alone is not enough (#3269)
                    componentOptions.Ctor.cid +
                        (componentOptions.tag ? `::${componentOptions.tag}` : '')
                : vnode.key;
            if (cache[key]) {
                vnode.componentInstance = cache[key].componentInstance;
                // make current key freshest
                remove$2(keys, key);
                keys.push(key);
            }
            else {
                // delay setting the cache until update
                this.vnodeToCache = vnode;
                this.keyToCache = key;
            }
            // @ts-expect-error can vnode.data can be undefined
            vnode.data.keepAlive = true;
        }
        return vnode || (slot && slot[0]);
    }
};

var builtInComponents = {
    KeepAlive
};

function initGlobalAPI(Vue) {
    // config
    const configDef = {};
    configDef.get = () => config;
    {
        configDef.set = () => {
            warn('Do not replace the Vue.config object, set individual fields instead.');
        };
    }
    Object.defineProperty(Vue, 'config', configDef);
    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn,
        extend,
        mergeOptions,
        defineReactive
    };
    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;
    // 2.6 explicit observable API
    Vue.observable = (obj) => {
        observe(obj);
        return obj;
    };
    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null);
    });
    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;
    extend(Vue.options.components, builtInComponents);
    initUse(Vue);
    initMixin(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
    get() {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext;
    }
});
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
});
Vue.version = version;

// these are reserved for web because they are directly compiled away
// during template compilation
const isReservedAttr = makeMap('style,class');
// attributes that should be using props for binding
const acceptValue = makeMap('input,textarea,option,select,progress');
const mustUseProp = (tag, type, attr) => {
    return ((attr === 'value' && acceptValue(tag) && type !== 'button') ||
        (attr === 'selected' && tag === 'option') ||
        (attr === 'checked' && tag === 'input') ||
        (attr === 'muted' && tag === 'video'));
};
const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
const convertEnumeratedValue = (key, value) => {
    return isFalsyAttrValue(value) || value === 'false'
        ? 'false'
        : // allow arbitrary string value for contenteditable
            key === 'contenteditable' && isValidContentEditableValue(value)
                ? value
                : 'true';
};
const isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,' +
    'truespeed,typemustmatch,visible');
const xlinkNS = 'http://www.w3.org/1999/xlink';
const isXlink = (name) => {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};
const getXlinkProp = (name) => {
    return isXlink(name) ? name.slice(6, name.length) : '';
};
const isFalsyAttrValue = (val) => {
    return val == null || val === false;
};

function genClassForVnode(vnode) {
    let data = vnode.data;
    let parentNode = vnode;
    let childNode = vnode;
    while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode;
        if (childNode && childNode.data) {
            data = mergeClassData(childNode.data, data);
        }
    }
    // @ts-expect-error parentNode.parent not VNodeWithData
    while (isDef((parentNode = parentNode.parent))) {
        if (parentNode && parentNode.data) {
            data = mergeClassData(data, parentNode.data);
        }
    }
    return renderClass(data.staticClass, data.class);
}
function mergeClassData(child, parent) {
    return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class) ? [child.class, parent.class] : parent.class
    };
}
function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass));
    }
    /* istanbul ignore next */
    return '';
}
function concat(a, b) {
    return a ? (b ? a + ' ' + b : a) : b || '';
}
function stringifyClass(value) {
    if (Array.isArray(value)) {
        return stringifyArray(value);
    }
    if (isObject(value)) {
        return stringifyObject(value);
    }
    if (typeof value === 'string') {
        return value;
    }
    /* istanbul ignore next */
    return '';
}
function stringifyArray(value) {
    let res = '';
    let stringified;
    for (let i = 0, l = value.length; i < l; i++) {
        if (isDef((stringified = stringifyClass(value[i]))) && stringified !== '') {
            if (res)
                res += ' ';
            res += stringified;
        }
    }
    return res;
}
function stringifyObject(value) {
    let res = '';
    for (const key in value) {
        if (value[key]) {
            if (res)
                res += ' ';
            res += key;
        }
    }
    return res;
}

const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
};
const isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot');
// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
const isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
const isReservedTag = (tag) => {
    return isHTMLTag(tag) || isSVG(tag);
};
function getTagNamespace(tag) {
    if (isSVG(tag)) {
        return 'svg';
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
        return 'math';
    }
}
const unknownElementCache = Object.create(null);
function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
        return true;
    }
    if (isReservedTag(tag)) {
        return false;
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
        return unknownElementCache[tag];
    }
    const el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
        // http://stackoverflow.com/a/28210364/1070244
        return (unknownElementCache[tag] =
            el.constructor === window.HTMLUnknownElement ||
                el.constructor === window.HTMLElement);
    }
    else {
        return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()));
    }
}
const isTextInputType = makeMap('text,number,password,search,email,tel,url');

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
    if (typeof el === 'string') {
        const selected = document.querySelector(el);
        if (!selected) {
            warn('Cannot find element: ' + el);
            return document.createElement('div');
        }
        return selected;
    }
    else {
        return el;
    }
}

function createElement(tagName, vnode) {
    const elm = document.createElement(tagName);
    if (tagName !== 'select') {
        return elm;
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data &&
        vnode.data.attrs &&
        vnode.data.attrs.multiple !== undefined) {
        elm.setAttribute('multiple', 'multiple');
    }
    return elm;
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(node) {
    return node.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

var ref = {
    create(_, vnode) {
        registerRef(vnode);
    },
    update(oldVnode, vnode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
            registerRef(oldVnode, true);
            registerRef(vnode);
        }
    },
    destroy(vnode) {
        registerRef(vnode, true);
    }
};
function registerRef(vnode, isRemoval) {
    const ref = vnode.data.ref;
    if (!isDef(ref))
        return;
    const vm = vnode.context;
    const refValue = vnode.componentInstance || vnode.elm;
    const value = isRemoval ? null : refValue;
    const $refsValue = isRemoval ? undefined : refValue;
    if (isFunction(ref)) {
        invokeWithErrorHandling(ref, vm, [value], vm, `template ref function`);
        return;
    }
    const isFor = vnode.data.refInFor;
    const _isString = typeof ref === 'string' || typeof ref === 'number';
    const _isRef = isRef(ref);
    const refs = vm.$refs;
    if (_isString || _isRef) {
        if (isFor) {
            const existing = _isString ? refs[ref] : ref.value;
            if (isRemoval) {
                isArray(existing) && remove$2(existing, refValue);
            }
            else {
                if (!isArray(existing)) {
                    if (_isString) {
                        refs[ref] = [refValue];
                        setSetupRef(vm, ref, refs[ref]);
                    }
                    else {
                        ref.value = [refValue];
                    }
                }
                else if (!existing.includes(refValue)) {
                    existing.push(refValue);
                }
            }
        }
        else if (_isString) {
            if (isRemoval && refs[ref] !== refValue) {
                return;
            }
            refs[ref] = $refsValue;
            setSetupRef(vm, ref, value);
        }
        else if (_isRef) {
            if (isRemoval && ref.value !== refValue) {
                return;
            }
            ref.value = value;
        }
        else {
            warn(`Invalid template ref type: ${typeof ref}`);
        }
    }
}
function setSetupRef({ _setupState }, key, val) {
    if (_setupState && hasOwn(_setupState, key)) {
        if (isRef(_setupState[key])) {
            _setupState[key].value = val;
        }
        else {
            _setupState[key] = val;
        }
    }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */
const emptyNode = new VNode('', {}, []);
const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
function sameVnode(a, b) {
    return (a.key === b.key &&
        a.asyncFactory === b.asyncFactory &&
        ((a.tag === b.tag &&
            a.isComment === b.isComment &&
            isDef(a.data) === isDef(b.data) &&
            sameInputType(a, b)) ||
            (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error))));
}
function sameInputType(a, b) {
    if (a.tag !== 'input')
        return true;
    let i;
    const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
    const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
    return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, key;
    const map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key))
            map[key] = i;
    }
    return map;
}
function createPatchFunction(backend) {
    let i, j;
    const cbs = {};
    const { modules, nodeOps } = backend;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }
    function emptyNodeAt(elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        function remove() {
            if (--remove.listeners === 0) {
                removeNode(childElm);
            }
        }
        remove.listeners = listeners;
        return remove;
    }
    function removeNode(el) {
        const parent = nodeOps.parentNode(el);
        // element may have already been removed due to v-html / v-text
        if (isDef(parent)) {
            nodeOps.removeChild(parent, el);
        }
    }
    function isUnknownElement(vnode, inVPre) {
        return (!inVPre &&
            !vnode.ns &&
            !(config.ignoredElements.length &&
                config.ignoredElements.some(ignore => {
                    return isRegExp(ignore)
                        ? ignore.test(vnode.tag)
                        : ignore === vnode.tag;
                })) &&
            config.isUnknownElement(vnode.tag));
    }
    let creatingElmInVPre = 0;
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            vnode = ownerArray[index] = cloneVNode(vnode);
        }
        vnode.isRootInsert = !nested; // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }
        const data = vnode.data;
        const children = vnode.children;
        const tag = vnode.tag;
        if (isDef(tag)) {
            {
                if (data && data.pre) {
                    creatingElmInVPre++;
                }
                if (isUnknownElement(vnode, creatingElmInVPre)) {
                    warn('Unknown custom element: <' +
                        tag +
                        '> - did you ' +
                        'register the component correctly? For recursive components, ' +
                        'make sure to provide the "name" option.', vnode.context);
                }
            }
            vnode.elm = vnode.ns
                ? nodeOps.createElementNS(vnode.ns, tag)
                : nodeOps.createElement(tag, vnode);
            setScope(vnode);
            createChildren(vnode, children, insertedVnodeQueue);
            if (isDef(data)) {
                invokeCreateHooks(vnode, insertedVnodeQueue);
            }
            insert(parentElm, vnode.elm, refElm);
            if (data && data.pre) {
                creatingElmInVPre--;
            }
        }
        else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps.createComment(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
        else {
            vnode.elm = nodeOps.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }
    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i = vnode.data;
        if (isDef(i)) {
            const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
            if (isDef((i = i.hook)) && isDef((i = i.init))) {
                i(vnode, false /* hydrating */);
            }
            // after calling the init hook, if the vnode is a child component
            // it should've created a child instance and mounted it. the child
            // component also has set the placeholder vnode's elm.
            // in that case we can just return the element and be done.
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                insert(parentElm, vnode.elm, refElm);
                if (isTrue(isReactivated)) {
                    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                }
                return true;
            }
        }
    }
    function initComponent(vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
            insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            vnode.data.pendingInsert = null;
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            setScope(vnode);
        }
        else {
            // empty component root.
            // skip all element-related modules except for ref (#3455)
            registerRef(vnode);
            // make sure to invoke the insert hook
            insertedVnodeQueue.push(vnode);
        }
    }
    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i;
        // hack for #4339: a reactivated component with inner transition
        // does not trigger because the inner node's created hooks are not called
        // again. It's not ideal to involve module-specific logic in here but
        // there doesn't seem to be a better way to do it.
        let innerNode = vnode;
        while (innerNode.componentInstance) {
            innerNode = innerNode.componentInstance._vnode;
            if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                for (i = 0; i < cbs.activate.length; ++i) {
                    cbs.activate[i](emptyNode, innerNode);
                }
                insertedVnodeQueue.push(innerNode);
                break;
            }
        }
        // unlike a newly created component,
        // a reactivated keep-alive component doesn't insert itself
        insert(parentElm, vnode.elm, refElm);
    }
    function insert(parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {
                if (nodeOps.parentNode(ref) === parent) {
                    nodeOps.insertBefore(parent, elm, ref);
                }
            }
            else {
                nodeOps.appendChild(parent, elm);
            }
        }
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (isArray(children)) {
            {
                checkDuplicateKeys(children);
            }
            for (let i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
            }
        }
        else if (isPrimitive(vnode.text)) {
            nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
        }
    }
    function isPatchable(vnode) {
        while (vnode.componentInstance) {
            vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (let i = 0; i < cbs.create.length; ++i) {
            cbs.create[i](emptyNode, vnode);
        }
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
            if (isDef(i.create))
                i.create(emptyNode, vnode);
            if (isDef(i.insert))
                insertedVnodeQueue.push(vnode);
        }
    }
    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
        let i;
        if (isDef((i = vnode.fnScopeId))) {
            nodeOps.setStyleScope(vnode.elm, i);
        }
        else {
            let ancestor = vnode;
            while (ancestor) {
                if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                    nodeOps.setStyleScope(vnode.elm, i);
                }
                ancestor = ancestor.parent;
            }
        }
        // for slot content they should also get the scopeId from the host instance.
        if (isDef((i = activeInstance)) &&
            i !== vnode.context &&
            i !== vnode.fnContext &&
            isDef((i = i.$options._scopeId))) {
            nodeOps.setStyleScope(vnode.elm, i);
        }
    }
    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
        }
    }
    function invokeDestroyHook(vnode) {
        let i, j;
        const data = vnode.data;
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.destroy)))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
        }
        if (isDef((i = vnode.children))) {
            for (j = 0; j < vnode.children.length; ++j) {
                invokeDestroyHook(vnode.children[j]);
            }
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    removeAndInvokeRemoveHook(ch);
                    invokeDestroyHook(ch);
                }
                else {
                    // Text node
                    removeNode(ch.elm);
                }
            }
        }
    }
    function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
            let i;
            const listeners = cbs.remove.length + 1;
            if (isDef(rm)) {
                // we have a recursively passed down rm callback
                // increase the listeners count
                rm.listeners += listeners;
            }
            else {
                // directly removing
                rm = createRmCb(vnode.elm, listeners);
            }
            // recursively invoke hooks on child component root node
            if (isDef((i = vnode.componentInstance)) &&
                isDef((i = i._vnode)) &&
                isDef(i.data)) {
                removeAndInvokeRemoveHook(i, rm);
            }
            for (i = 0; i < cbs.remove.length; ++i) {
                cbs.remove[i](vnode, rm);
            }
            if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                i(vnode, rm);
            }
            else {
                rm();
            }
        }
        else {
            removeNode(vnode.elm);
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx, idxInOld, vnodeToMove, refElm;
        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        const canMove = !removeOnly;
        {
            checkDuplicateKeys(newCh);
        }
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
            }
            else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                canMove &&
                    nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                canMove &&
                    nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (isUndef(oldKeyToIdx))
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                idxInOld = isDef(newStartVnode.key)
                    ? oldKeyToIdx[newStartVnode.key]
                    : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                if (isUndef(idxInOld)) {
                    // New element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                }
                else {
                    vnodeToMove = oldCh[idxInOld];
                    if (sameVnode(vnodeToMove, newStartVnode)) {
                        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                        oldCh[idxInOld] = undefined;
                        canMove &&
                            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                    }
                    else {
                        // same key but different element. treat as new element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (oldStartIdx > oldEndIdx) {
            refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function checkDuplicateKeys(children) {
        const seenKeys = {};
        for (let i = 0; i < children.length; i++) {
            const vnode = children[i];
            const key = vnode.key;
            if (isDef(key)) {
                if (seenKeys[key]) {
                    warn(`Duplicate keys detected: '${key}'. This may cause an update error.`, vnode.context);
                }
                else {
                    seenKeys[key] = true;
                }
            }
        }
    }
    function findIdxInOld(node, oldCh, start, end) {
        for (let i = start; i < end; i++) {
            const c = oldCh[i];
            if (isDef(c) && sameVnode(node, c))
                return i;
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
        if (oldVnode === vnode) {
            return;
        }
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // clone reused vnode
            vnode = ownerArray[index] = cloneVNode(vnode);
        }
        const elm = (vnode.elm = oldVnode.elm);
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
            if (isDef(vnode.asyncFactory.resolved)) {
                hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
            }
            else {
                vnode.isAsyncPlaceholder = true;
            }
            return;
        }
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (isTrue(vnode.isStatic) &&
            isTrue(oldVnode.isStatic) &&
            vnode.key === oldVnode.key &&
            (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
            vnode.componentInstance = oldVnode.componentInstance;
            return;
        }
        let i;
        const data = vnode.data;
        if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
            i(oldVnode, vnode);
        }
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (isDef(data) && isPatchable(vnode)) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            if (isDef((i = data.hook)) && isDef((i = i.update)))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
            }
            else if (isDef(ch)) {
                {
                    checkDuplicateKeys(ch);
                }
                if (isDef(oldVnode.text))
                    nodeOps.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                nodeOps.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, vnode.text);
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
                i(oldVnode, vnode);
        }
    }
    function invokeInsertHook(vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
            vnode.parent.data.pendingInsert = queue;
        }
        else {
            for (let i = 0; i < queue.length; ++i) {
                queue[i].data.hook.insert(queue[i]);
            }
        }
    }
    let hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
        let i;
        const { tag, data, children } = vnode;
        inVPre = inVPre || (data && data.pre);
        vnode.elm = elm;
        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
            vnode.isAsyncPlaceholder = true;
            return true;
        }
        // assert node match
        {
            if (!assertNodeMatch(elm, vnode, inVPre)) {
                return false;
            }
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.init)))
                i(vnode, true /* hydrating */);
            if (isDef((i = vnode.componentInstance))) {
                // child component. it should have hydrated its own tree.
                initComponent(vnode, insertedVnodeQueue);
                return true;
            }
        }
        if (isDef(tag)) {
            if (isDef(children)) {
                // empty element, allow client to pick up and populate children
                if (!elm.hasChildNodes()) {
                    createChildren(vnode, children, insertedVnodeQueue);
                }
                else {
                    // v-html and domProps: innerHTML
                    if (isDef((i = data)) &&
                        isDef((i = i.domProps)) &&
                        isDef((i = i.innerHTML))) {
                        if (i !== elm.innerHTML) {
                            /* istanbul ignore if */
                            if (typeof console !== 'undefined' &&
                                !hydrationBailed) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm);
                                console.warn('server innerHTML: ', i);
                                console.warn('client innerHTML: ', elm.innerHTML);
                            }
                            return false;
                        }
                    }
                    else {
                        // iterate and compare children lists
                        let childrenMatch = true;
                        let childNode = elm.firstChild;
                        for (let i = 0; i < children.length; i++) {
                            if (!childNode ||
                                !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
                                childrenMatch = false;
                                break;
                            }
                            childNode = childNode.nextSibling;
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            /* istanbul ignore if */
                            if (typeof console !== 'undefined' &&
                                !hydrationBailed) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm);
                                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                            }
                            return false;
                        }
                    }
                }
            }
            if (isDef(data)) {
                let fullInvoke = false;
                for (const key in data) {
                    if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                    }
                }
                if (!fullInvoke && data['class']) {
                    // ensure collecting deps for deep class bindings for future updates
                    traverse(data['class']);
                }
            }
        }
        else if (elm.data !== vnode.text) {
            elm.data = vnode.text;
        }
        return true;
    }
    function assertNodeMatch(node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
            return (vnode.tag.indexOf('vue-component') === 0 ||
                (!isUnknownElement(vnode, inVPre) &&
                    vnode.tag.toLowerCase() ===
                        (node.tagName && node.tagName.toLowerCase())));
        }
        else {
            return node.nodeType === (vnode.isComment ? 8 : 3);
        }
    }
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
            if (isDef(oldVnode))
                invokeDestroyHook(oldVnode);
            return;
        }
        let isInitialPatch = false;
        const insertedVnodeQueue = [];
        if (isUndef(oldVnode)) {
            // empty mount (likely as component), create new root element
            isInitialPatch = true;
            createElm(vnode, insertedVnodeQueue);
        }
        else {
            const isRealElement = isDef(oldVnode.nodeType);
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // patch existing root node
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
            }
            else {
                if (isRealElement) {
                    // mounting to a real element
                    // check if this is server-rendered content and if we can perform
                    // a successful hydration.
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                    }
                    if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                            invokeInsertHook(vnode, insertedVnodeQueue, true);
                            return oldVnode;
                        }
                        else {
                            warn('The client-side rendered virtual DOM tree is not matching ' +
                                'server-rendered content. This is likely caused by incorrect ' +
                                'HTML markup, for example nesting block-level elements inside ' +
                                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                'full client-side render.');
                        }
                    }
                    // either not server-rendered, or hydration failed.
                    // create an empty node and replace it
                    oldVnode = emptyNodeAt(oldVnode);
                }
                // replacing existing element
                const oldElm = oldVnode.elm;
                const parentElm = nodeOps.parentNode(oldElm);
                // create new node
                createElm(vnode, insertedVnodeQueue, 
                // extremely rare edge case: do not insert if old element is in a
                // leaving transition. Only happens when combining transition +
                // keep-alive + HOCs. (#4590)
                oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm));
                // update parent placeholder node element, recursively
                if (isDef(vnode.parent)) {
                    let ancestor = vnode.parent;
                    const patchable = isPatchable(vnode);
                    while (ancestor) {
                        for (let i = 0; i < cbs.destroy.length; ++i) {
                            cbs.destroy[i](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                            for (let i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, ancestor);
                            }
                            // #6513
                            // invoke insert hooks that may have been merged by create hooks.
                            // e.g. for directives that uses the "inserted" hook.
                            const insert = ancestor.data.hook.insert;
                            if (insert.merged) {
                                // start at index 1 to avoid re-invoking component mounted hook
                                for (let i = 1; i < insert.fns.length; i++) {
                                    insert.fns[i]();
                                }
                            }
                        }
                        else {
                            registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                    }
                }
                // destroy old node
                if (isDef(parentElm)) {
                    removeVnodes([oldVnode], 0, 0);
                }
                else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode);
                }
            }
        }
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
    };
}

var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
        // @ts-expect-error emptyNode is not VNodeWithData
        updateDirectives(vnode, emptyNode);
    }
};
function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode);
    }
}
function _update(oldVnode, vnode) {
    const isCreate = oldVnode === emptyNode;
    const isDestroy = vnode === emptyNode;
    const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
    const newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
    const dirsWithInsert = [];
    const dirsWithPostpatch = [];
    let key, oldDir, dir;
    for (key in newDirs) {
        oldDir = oldDirs[key];
        dir = newDirs[key];
        if (!oldDir) {
            // new directive, bind
            callHook(dir, 'bind', vnode, oldVnode);
            if (dir.def && dir.def.inserted) {
                dirsWithInsert.push(dir);
            }
        }
        else {
            // existing directive, update
            dir.oldValue = oldDir.value;
            dir.oldArg = oldDir.arg;
            callHook(dir, 'update', vnode, oldVnode);
            if (dir.def && dir.def.componentUpdated) {
                dirsWithPostpatch.push(dir);
            }
        }
    }
    if (dirsWithInsert.length) {
        const callInsert = () => {
            for (let i = 0; i < dirsWithInsert.length; i++) {
                callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode);
            }
        };
        if (isCreate) {
            mergeVNodeHook(vnode, 'insert', callInsert);
        }
        else {
            callInsert();
        }
    }
    if (dirsWithPostpatch.length) {
        mergeVNodeHook(vnode, 'postpatch', () => {
            for (let i = 0; i < dirsWithPostpatch.length; i++) {
                callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
            }
        });
    }
    if (!isCreate) {
        for (key in oldDirs) {
            if (!newDirs[key]) {
                // no longer present, unbind
                callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
            }
        }
    }
}
const emptyModifiers = Object.create(null);
function normalizeDirectives(dirs, vm) {
    const res = Object.create(null);
    if (!dirs) {
        // $flow-disable-line
        return res;
    }
    let i, dir;
    for (i = 0; i < dirs.length; i++) {
        dir = dirs[i];
        if (!dir.modifiers) {
            // $flow-disable-line
            dir.modifiers = emptyModifiers;
        }
        res[getRawDirName(dir)] = dir;
        if (vm._setupState && vm._setupState.__sfc) {
            const setupDef = dir.def || resolveAsset(vm, '_setupState', 'v-' + dir.name);
            if (typeof setupDef === 'function') {
                dir.def = {
                    bind: setupDef,
                    update: setupDef,
                };
            }
            else {
                dir.def = setupDef;
            }
        }
        dir.def = dir.def || resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res;
}
function getRawDirName(dir) {
    return (dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join('.')}`);
}
function callHook(dir, hook, vnode, oldVnode, isDestroy) {
    const fn = dir.def && dir.def[hook];
    if (fn) {
        try {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        }
        catch (e) {
            handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`);
        }
    }
}

var baseModules = [ref, directives];

function updateAttrs(oldVnode, vnode) {
    const opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
        return;
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return;
    }
    let key, cur, old;
    const elm = vnode.elm;
    const oldAttrs = oldVnode.data.attrs || {};
    let attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__) || isTrue(attrs._v_attr_proxy)) {
        attrs = vnode.data.attrs = extend({}, attrs);
    }
    for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
            setAttr(elm, key, cur, vnode.data.pre);
        }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
        setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
        if (isUndef(attrs[key])) {
            if (isXlink(key)) {
                elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
            }
            else if (!isEnumeratedAttr(key)) {
                elm.removeAttribute(key);
            }
        }
    }
}
function setAttr(el, key, value, isInPre) {
    if (isInPre || el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value);
    }
    else if (isBooleanAttr(key)) {
        // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        if (isFalsyAttrValue(value)) {
            el.removeAttribute(key);
        }
        else {
            // technically allowfullscreen is a boolean attribute for <iframe>,
            // but Flash expects a value of "true" when used on <embed> tag
            value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
            el.setAttribute(key, value);
        }
    }
    else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, convertEnumeratedValue(key, value));
    }
    else if (isXlink(key)) {
        if (isFalsyAttrValue(value)) {
            el.removeAttributeNS(xlinkNS, getXlinkProp(key));
        }
        else {
            el.setAttributeNS(xlinkNS, key, value);
        }
    }
    else {
        baseSetAttr(el, key, value);
    }
}
function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
    }
    else {
        // #7138: IE10 & 11 fires input event when setting placeholder on
        // <textarea>... block the first input event and remove the blocker
        // immediately.
        /* istanbul ignore if */
        if (isIE &&
            !isIE9 &&
            el.tagName === 'TEXTAREA' &&
            key === 'placeholder' &&
            value !== '' &&
            !el.__ieph) {
            const blocker = e => {
                e.stopImmediatePropagation();
                el.removeEventListener('input', blocker);
            };
            el.addEventListener('input', blocker);
            // $flow-disable-line
            el.__ieph = true; /* IE placeholder patched */
        }
        el.setAttribute(key, value);
    }
}
var attrs = {
    create: updateAttrs,
    update: updateAttrs
};

function updateClass(oldVnode, vnode) {
    const el = vnode.elm;
    const data = vnode.data;
    const oldData = oldVnode.data;
    if (isUndef(data.staticClass) &&
        isUndef(data.class) &&
        (isUndef(oldData) ||
            (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
        return;
    }
    let cls = genClassForVnode(vnode);
    // handle transition classes
    const transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
    }
    // set the class
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
    }
}
var klass = {
    create: updateClass,
    update: updateClass
};

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
const RANGE_TOKEN = '__r';
const CHECKBOX_RADIO_TOKEN = '__c';

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents(on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
        // IE input[type=range] only supports `change` event
        const event = isIE ? 'change' : 'input';
        on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
        delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
        on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
        delete on[CHECKBOX_RADIO_TOKEN];
    }
}
let target;
function createOnceHandler(event, handler, capture) {
    const _target = target; // save current target element in closure
    return function onceHandler() {
        const res = handler.apply(null, arguments);
        if (res !== null) {
            remove(event, onceHandler, capture, _target);
        }
    };
}
// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
const useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
function add(name, handler, capture, passive) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
        const attachedTimestamp = currentFlushTimestamp;
        const original = handler;
        //@ts-expect-error
        handler = original._wrapper = function (e) {
            if (
            // no bubbling, should always fire.
            // this is just a safety net in case event.timeStamp is unreliable in
            // certain weird environments...
            e.target === e.currentTarget ||
                // event is fired after handler attachment
                e.timeStamp >= attachedTimestamp ||
                // bail for environments that have buggy event.timeStamp implementations
                // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                // #9681 QtWebEngine event.timeStamp is negative value
                e.timeStamp <= 0 ||
                // #9448 bail if event is fired in another document in a multi-page
                // electron/nw.js app, since event.timeStamp will be using a different
                // starting reference
                e.target.ownerDocument !== document) {
                return original.apply(this, arguments);
            }
        };
    }
    target.addEventListener(name, handler, supportsPassive ? { capture, passive } : capture);
}
function remove(name, handler, capture, _target) {
    (_target || target).removeEventListener(name, 
    //@ts-expect-error
    handler._wrapper || handler, capture);
}
function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return;
    }
    const on = vnode.data.on || {};
    const oldOn = oldVnode.data.on || {};
    // vnode is empty when removing all listeners,
    // and use old vnode dom element
    target = vnode.elm || oldVnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
    target = undefined;
}
var events = {
    create: updateDOMListeners,
    update: updateDOMListeners,
    // @ts-expect-error emptyNode has actually data
    destroy: (vnode) => updateDOMListeners(vnode, emptyNode)
};

let svgContainer;
function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return;
    }
    let key, cur;
    const elm = vnode.elm;
    const oldProps = oldVnode.data.domProps || {};
    let props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__) || isTrue(props._v_attr_proxy)) {
        props = vnode.data.domProps = extend({}, props);
    }
    for (key in oldProps) {
        if (!(key in props)) {
            elm[key] = '';
        }
    }
    for (key in props) {
        cur = props[key];
        // ignore children if the node has textContent or innerHTML,
        // as these will throw away existing DOM nodes and cause removal errors
        // on subsequent patches (#3360)
        if (key === 'textContent' || key === 'innerHTML') {
            if (vnode.children)
                vnode.children.length = 0;
            if (cur === oldProps[key])
                continue;
            // #6601 work around Chrome version <= 55 bug where single textNode
            // replaced by innerHTML/textContent retains its parentNode property
            if (elm.childNodes.length === 1) {
                elm.removeChild(elm.childNodes[0]);
            }
        }
        if (key === 'value' && elm.tagName !== 'PROGRESS') {
            // store value as _value as well since
            // non-string values will be stringified
            elm._value = cur;
            // avoid resetting cursor position when value is the same
            const strCur = isUndef(cur) ? '' : String(cur);
            if (shouldUpdateValue(elm, strCur)) {
                elm.value = strCur;
            }
        }
        else if (key === 'innerHTML' &&
            isSVG(elm.tagName) &&
            isUndef(elm.innerHTML)) {
            // IE doesn't support innerHTML for SVG elements
            svgContainer = svgContainer || document.createElement('div');
            svgContainer.innerHTML = `<svg>${cur}</svg>`;
            const svg = svgContainer.firstChild;
            while (elm.firstChild) {
                elm.removeChild(elm.firstChild);
            }
            while (svg.firstChild) {
                elm.appendChild(svg.firstChild);
            }
        }
        else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecessary `checked` update.
        cur !== oldProps[key]) {
            // some property updates can throw
            // e.g. `value` on <progress> w/ non-finite value
            try {
                elm[key] = cur;
            }
            catch (e) { }
        }
    }
}
function shouldUpdateValue(elm, checkVal) {
    return (
    //@ts-expect-error
    !elm.composing &&
        (elm.tagName === 'OPTION' ||
            isNotInFocusAndDirty(elm, checkVal) ||
            isDirtyWithModifiers(elm, checkVal)));
}
function isNotInFocusAndDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    let notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try {
        notInFocus = document.activeElement !== elm;
    }
    catch (e) { }
    return notInFocus && elm.value !== checkVal;
}
function isDirtyWithModifiers(elm, newVal) {
    const value = elm.value;
    const modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
        if (modifiers.number) {
            return toNumber(value) !== toNumber(newVal);
        }
        if (modifiers.trim) {
            return value.trim() !== newVal.trim();
        }
    }
    return value !== newVal;
}
var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
};

const parseStyleText = cached(function (cssText) {
    const res = {};
    const listDelimiter = /;(?![^(]*\))/g;
    const propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
        if (item) {
            const tmp = item.split(propertyDelimiter);
            tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return res;
});
// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
    const style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle ? extend(data.staticStyle, style) : style;
}
// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
        return toObject(bindingStyle);
    }
    if (typeof bindingStyle === 'string') {
        return parseStyleText(bindingStyle);
    }
    return bindingStyle;
}
/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
    const res = {};
    let styleData;
    if (checkChild) {
        let childNode = vnode;
        while (childNode.componentInstance) {
            childNode = childNode.componentInstance._vnode;
            if (childNode &&
                childNode.data &&
                (styleData = normalizeStyleData(childNode.data))) {
                extend(res, styleData);
            }
        }
    }
    if ((styleData = normalizeStyleData(vnode.data))) {
        extend(res, styleData);
    }
    let parentNode = vnode;
    // @ts-expect-error parentNode.parent not VNodeWithData
    while ((parentNode = parentNode.parent)) {
        if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
            extend(res, styleData);
        }
    }
    return res;
}

const cssVarRE = /^--/;
const importantRE = /\s*!important$/;
const setProp = (el, name, val) => {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
        el.style.setProperty(name, val);
    }
    else if (importantRE.test(val)) {
        el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    }
    else {
        const normalizedName = normalize(name);
        if (Array.isArray(val)) {
            // Support values array created by autoprefixer, e.g.
            // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
            // Set them one by one, and the browser will only set those it can recognize
            for (let i = 0, len = val.length; i < len; i++) {
                el.style[normalizedName] = val[i];
            }
        }
        else {
            el.style[normalizedName] = val;
        }
    }
};
const vendorNames = ['Webkit', 'Moz', 'ms'];
let emptyStyle;
const normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && prop in emptyStyle) {
        return prop;
    }
    const capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (let i = 0; i < vendorNames.length; i++) {
        const name = vendorNames[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
});
function updateStyle(oldVnode, vnode) {
    const data = vnode.data;
    const oldData = oldVnode.data;
    if (isUndef(data.staticStyle) &&
        isUndef(data.style) &&
        isUndef(oldData.staticStyle) &&
        isUndef(oldData.style)) {
        return;
    }
    let cur, name;
    const el = vnode.elm;
    const oldStaticStyle = oldData.staticStyle;
    const oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    const oldStyle = oldStaticStyle || oldStyleBinding;
    const style = normalizeStyleBinding(vnode.data.style) || {};
    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
    const newStyle = getStyle(vnode, true);
    for (name in oldStyle) {
        if (isUndef(newStyle[name])) {
            setProp(el, name, '');
        }
    }
    for (name in newStyle) {
        cur = newStyle[name];
        if (cur !== oldStyle[name]) {
            // ie9 setting to null has no effect, must use empty string
            setProp(el, name, cur == null ? '' : cur);
        }
    }
}
var style = {
    create: updateStyle,
    update: updateStyle
};

const whitespaceRE = /\s+/;
/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    /* istanbul ignore else */
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach(c => el.classList.add(c));
        }
        else {
            el.classList.add(cls);
        }
    }
    else {
        const cur = ` ${el.getAttribute('class') || ''} `;
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            el.setAttribute('class', (cur + cls).trim());
        }
    }
}
/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    /* istanbul ignore else */
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach(c => el.classList.remove(c));
        }
        else {
            el.classList.remove(cls);
        }
        if (!el.classList.length) {
            el.removeAttribute('class');
        }
    }
    else {
        let cur = ` ${el.getAttribute('class') || ''} `;
        const tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        if (cur) {
            el.setAttribute('class', cur);
        }
        else {
            el.removeAttribute('class');
        }
    }
}

function resolveTransition(def) {
    if (!def) {
        return;
    }
    /* istanbul ignore else */
    if (typeof def === 'object') {
        const res = {};
        if (def.css !== false) {
            extend(res, autoCssTransition(def.name || 'v'));
        }
        extend(res, def);
        return res;
    }
    else if (typeof def === 'string') {
        return autoCssTransition(def);
    }
}
const autoCssTransition = cached(name => {
    return {
        enterClass: `${name}-enter`,
        enterToClass: `${name}-enter-to`,
        enterActiveClass: `${name}-enter-active`,
        leaveClass: `${name}-leave`,
        leaveToClass: `${name}-leave-to`,
        leaveActiveClass: `${name}-leave-active`
    };
});
const hasTransition = inBrowser && !isIE9;
const TRANSITION = 'transition';
const ANIMATION = 'animation';
// Transition property/event sniffing
let transitionProp = 'transition';
let transitionEndEvent = 'transitionend';
let animationProp = 'animation';
let animationEndEvent = 'animationend';
if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
        window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
        window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
    }
}
// binding to window is necessary to make hot reload work in IE in strict mode
const raf = inBrowser
    ? window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout
    : /* istanbul ignore next */ /* istanbul ignore next */ fn => fn();
function nextFrame(fn) {
    raf(() => {
        // @ts-expect-error
        raf(fn);
    });
}
function addTransitionClass(el, cls) {
    const transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
        transitionClasses.push(cls);
        addClass(el, cls);
    }
}
function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
        remove$2(el._transitionClasses, cls);
    }
    removeClass(el, cls);
}
function whenTransitionEnds(el, expectedType, cb) {
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type)
        return cb();
    const event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    let ended = 0;
    const end = () => {
        el.removeEventListener(event, onEnd);
        cb();
    };
    const onEnd = e => {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };
    setTimeout(() => {
        if (ended < propCount) {
            end();
        }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
}
const transformRE = /\b(transform|all)(,|$)/;
function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    const transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    const transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    const animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type;
    let timeout = 0;
    let propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type =
            timeout > 0
                ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                : null;
        propCount = type
            ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
            : 0;
    }
    const hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
        type,
        timeout,
        propCount,
        hasTransform
    };
}
function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max.apply(null, durations.map((d, i) => {
        return toMs(d) + toMs(delays[i]);
    }));
}
// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function enter(vnode, toggleDisplay) {
    const el = vnode.elm;
    // call leave callback now
    if (isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
    }
    const data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
        return;
    }
    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
        return;
    }
    const { css, type, enterClass, enterToClass, enterActiveClass, appearClass, appearToClass, appearActiveClass, beforeEnter, enter, afterEnter, enterCancelled, beforeAppear, appear, afterAppear, appearCancelled, duration } = data;
    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    let context = activeInstance;
    let transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
        context = transitionNode.context;
        transitionNode = transitionNode.parent;
    }
    const isAppear = !context._isMounted || !vnode.isRootInsert;
    if (isAppear && !appear && appear !== '') {
        return;
    }
    const startClass = isAppear && appearClass ? appearClass : enterClass;
    const activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    const toClass = isAppear && appearToClass ? appearToClass : enterToClass;
    const beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    const enterHook = isAppear ? (isFunction(appear) ? appear : enter) : enter;
    const afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    const enterCancelledHook = isAppear
        ? appearCancelled || enterCancelled
        : enterCancelled;
    const explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
    if (explicitEnterDuration != null) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
    }
    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(enterHook);
    const cb = (el._enterCb = once(() => {
        if (expectsCSS) {
            removeTransitionClass(el, toClass);
            removeTransitionClass(el, activeClass);
        }
        // @ts-expect-error
        if (cb.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, startClass);
            }
            enterCancelledHook && enterCancelledHook(el);
        }
        else {
            afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
    }));
    if (!vnode.data.show) {
        // remove pending leave element on enter by injecting an insert hook
        mergeVNodeHook(vnode, 'insert', () => {
            const parent = el.parentNode;
            const pendingNode = parent && parent._pending && parent._pending[vnode.key];
            if (pendingNode &&
                pendingNode.tag === vnode.tag &&
                pendingNode.elm._leaveCb) {
                pendingNode.elm._leaveCb();
            }
            enterHook && enterHook(el, cb);
        });
    }
    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
        addTransitionClass(el, startClass);
        addTransitionClass(el, activeClass);
        nextFrame(() => {
            removeTransitionClass(el, startClass);
            // @ts-expect-error
            if (!cb.cancelled) {
                addTransitionClass(el, toClass);
                if (!userWantsControl) {
                    if (isValidDuration(explicitEnterDuration)) {
                        setTimeout(cb, explicitEnterDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, cb);
                    }
                }
            }
        });
    }
    if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb);
    }
    if (!expectsCSS && !userWantsControl) {
        cb();
    }
}
function leave(vnode, rm) {
    const el = vnode.elm;
    // call enter callback now
    if (isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
    }
    const data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
        return rm();
    }
    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
        return;
    }
    const { css, type, leaveClass, leaveToClass, leaveActiveClass, beforeLeave, leave, afterLeave, leaveCancelled, delayLeave, duration } = data;
    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(leave);
    const explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
    if (isDef(explicitLeaveDuration)) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
    }
    const cb = (el._leaveCb = once(() => {
        if (el.parentNode && el.parentNode._pending) {
            el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
            removeTransitionClass(el, leaveToClass);
            removeTransitionClass(el, leaveActiveClass);
        }
        // @ts-expect-error
        if (cb.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, leaveClass);
            }
            leaveCancelled && leaveCancelled(el);
        }
        else {
            rm();
            afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
    }));
    if (delayLeave) {
        delayLeave(performLeave);
    }
    else {
        performLeave();
    }
    function performLeave() {
        // the delayed leave may have already been cancelled
        // @ts-expect-error
        if (cb.cancelled) {
            return;
        }
        // record leaving element
        if (!vnode.data.show && el.parentNode) {
            (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] =
                vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
            addTransitionClass(el, leaveClass);
            addTransitionClass(el, leaveActiveClass);
            nextFrame(() => {
                removeTransitionClass(el, leaveClass);
                // @ts-expect-error
                if (!cb.cancelled) {
                    addTransitionClass(el, leaveToClass);
                    if (!userWantsControl) {
                        if (isValidDuration(explicitLeaveDuration)) {
                            setTimeout(cb, explicitLeaveDuration);
                        }
                        else {
                            whenTransitionEnds(el, type, cb);
                        }
                    }
                }
            });
        }
        leave && leave(el, cb);
        if (!expectsCSS && !userWantsControl) {
            cb();
        }
    }
}
// only used in dev mode
function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
        warn(`<transition> explicit ${name} duration is not a valid number - ` +
            `got ${JSON.stringify(val)}.`, vnode.context);
    }
    else if (isNaN(val)) {
        warn(`<transition> explicit ${name} duration is NaN - ` +
            'the duration expression might be incorrect.', vnode.context);
    }
}
function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
}
/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
        return false;
    }
    // @ts-expect-error
    const invokerFns = fn.fns;
    if (isDef(invokerFns)) {
        // invoker
        return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    }
    else {
        // @ts-expect-error
        return (fn._length || fn.length) > 1;
    }
}
function _enter(_, vnode) {
    if (vnode.data.show !== true) {
        enter(vnode);
    }
}
var transition = inBrowser
    ? {
        create: _enter,
        activate: _enter,
        remove(vnode, rm) {
            /* istanbul ignore else */
            if (vnode.data.show !== true) {
                // @ts-expect-error
                leave(vnode, rm);
            }
            else {
                rm();
            }
        }
    }
    : {};

var platformModules = [attrs, klass, events, domProps, style, transition];

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);
const patch = createPatchFunction({ nodeOps, modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */
/* istanbul ignore if */
if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', () => {
        const el = document.activeElement;
        // @ts-expect-error
        if (el && el.vmodel) {
            trigger(el, 'input');
        }
    });
}
const directive = {
    inserted(el, binding, vnode, oldVnode) {
        if (vnode.tag === 'select') {
            // #6903
            if (oldVnode.elm && !oldVnode.elm._vOptions) {
                mergeVNodeHook(vnode, 'postpatch', () => {
                    directive.componentUpdated(el, binding, vnode);
                });
            }
            else {
                setSelected(el, binding, vnode.context);
            }
            el._vOptions = [].map.call(el.options, getValue);
        }
        else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
            el._vModifiers = binding.modifiers;
            if (!binding.modifiers.lazy) {
                el.addEventListener('compositionstart', onCompositionStart);
                el.addEventListener('compositionend', onCompositionEnd);
                // Safari < 10.2 & UIWebView doesn't fire compositionend when
                // switching focus before confirming composition choice
                // this also fixes the issue where some browsers e.g. iOS Chrome
                // fires "change" instead of "input" on autocomplete.
                el.addEventListener('change', onCompositionEnd);
                /* istanbul ignore if */
                if (isIE9) {
                    el.vmodel = true;
                }
            }
        }
    },
    componentUpdated(el, binding, vnode) {
        if (vnode.tag === 'select') {
            setSelected(el, binding, vnode.context);
            // in case the options rendered by v-for have changed,
            // it's possible that the value is out-of-sync with the rendered options.
            // detect such cases and filter out values that no longer has a matching
            // option in the DOM.
            const prevOptions = el._vOptions;
            const curOptions = (el._vOptions = [].map.call(el.options, getValue));
            if (curOptions.some((o, i) => !looseEqual(o, prevOptions[i]))) {
                // trigger change event if
                // no matching option found for at least one value
                const needReset = el.multiple
                    ? binding.value.some(v => hasNoMatchingOption(v, curOptions))
                    : binding.value !== binding.oldValue &&
                        hasNoMatchingOption(binding.value, curOptions);
                if (needReset) {
                    trigger(el, 'change');
                }
            }
        }
    }
};
function setSelected(el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
        setTimeout(() => {
            actuallySetSelected(el, binding, vm);
        }, 0);
    }
}
function actuallySetSelected(el, binding, vm) {
    const value = binding.value;
    const isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
        warn(`<select multiple v-model="${binding.expression}"> ` +
                `expects an Array value for its binding, but got ${Object.prototype.toString
                    .call(value)
                    .slice(8, -1)}`, vm);
        return;
    }
    let selected, option;
    for (let i = 0, l = el.options.length; i < l; i++) {
        option = el.options[i];
        if (isMultiple) {
            selected = looseIndexOf(value, getValue(option)) > -1;
            if (option.selected !== selected) {
                option.selected = selected;
            }
        }
        else {
            if (looseEqual(getValue(option), value)) {
                if (el.selectedIndex !== i) {
                    el.selectedIndex = i;
                }
                return;
            }
        }
    }
    if (!isMultiple) {
        el.selectedIndex = -1;
    }
}
function hasNoMatchingOption(value, options) {
    return options.every(o => !looseEqual(o, value));
}
function getValue(option) {
    return '_value' in option ? option._value : option.value;
}
function onCompositionStart(e) {
    e.target.composing = true;
}
function onCompositionEnd(e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing)
        return;
    e.target.composing = false;
    trigger(e.target, 'input');
}
function trigger(el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
    // @ts-expect-error
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
        ? locateNode(vnode.componentInstance._vnode)
        : vnode;
}
var show = {
    bind(el, { value }, vnode) {
        vnode = locateNode(vnode);
        const transition = vnode.data && vnode.data.transition;
        const originalDisplay = (el.__vOriginalDisplay =
            el.style.display === 'none' ? '' : el.style.display);
        if (value && transition) {
            vnode.data.show = true;
            enter(vnode, () => {
                el.style.display = originalDisplay;
            });
        }
        else {
            el.style.display = value ? originalDisplay : 'none';
        }
    },
    update(el, { value, oldValue }, vnode) {
        /* istanbul ignore if */
        if (!value === !oldValue)
            return;
        vnode = locateNode(vnode);
        const transition = vnode.data && vnode.data.transition;
        if (transition) {
            vnode.data.show = true;
            if (value) {
                enter(vnode, () => {
                    el.style.display = el.__vOriginalDisplay;
                });
            }
            else {
                leave(vnode, () => {
                    el.style.display = 'none';
                });
            }
        }
        else {
            el.style.display = value ? el.__vOriginalDisplay : 'none';
        }
    },
    unbind(el, binding, vnode, oldVnode, isDestroy) {
        if (!isDestroy) {
            el.style.display = el.__vOriginalDisplay;
        }
    }
};

var platformDirectives = {
    model: directive,
    show
};

// Provides transition support for a single element/component.
const transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
};
// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
    const compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children));
    }
    else {
        return vnode;
    }
}
function extractTransitionData(comp) {
    const data = {};
    const options = comp.$options;
    // props
    for (const key in options.propsData) {
        data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    const listeners = options._parentListeners;
    for (const key in listeners) {
        data[camelize(key)] = listeners[key];
    }
    return data;
}
function placeholder(h, rawChild) {
    // @ts-expect-error
    if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
            props: rawChild.componentOptions.propsData
        });
    }
}
function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
        if (vnode.data.transition) {
            return true;
        }
    }
}
function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
}
const isNotTextNode = (c) => c.tag || isAsyncPlaceholder(c);
const isVShowDirective = d => d.name === 'show';
var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render(h) {
        let children = this.$slots.default;
        if (!children) {
            return;
        }
        // filter out text nodes (possible whitespaces)
        children = children.filter(isNotTextNode);
        /* istanbul ignore if */
        if (!children.length) {
            return;
        }
        // warn multiple elements
        if (children.length > 1) {
            warn('<transition> can only be used on a single element. Use ' +
                '<transition-group> for lists.', this.$parent);
        }
        const mode = this.mode;
        // warn invalid mode
        if (mode && mode !== 'in-out' && mode !== 'out-in') {
            warn('invalid <transition> mode: ' + mode, this.$parent);
        }
        const rawChild = children[0];
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        if (hasParentTransition(this.$vnode)) {
            return rawChild;
        }
        // apply transition data to child
        // use getRealChild() to ignore abstract components e.g. keep-alive
        const child = getRealChild(rawChild);
        /* istanbul ignore if */
        if (!child) {
            return rawChild;
        }
        if (this._leaving) {
            return placeholder(h, rawChild);
        }
        // ensure a key that is unique to the vnode type and to this transition
        // component instance. This key will be used to remove pending leaving nodes
        // during entering.
        const id = `__transition-${this._uid}-`;
        child.key =
            child.key == null
                ? child.isComment
                    ? id + 'comment'
                    : id + child.tag
                : isPrimitive(child.key)
                    ? String(child.key).indexOf(id) === 0
                        ? child.key
                        : id + child.key
                    : child.key;
        const data = ((child.data || (child.data = {})).transition =
            extractTransitionData(this));
        const oldRawChild = this._vnode;
        const oldChild = getRealChild(oldRawChild);
        // mark v-show
        // so that the transition module can hand over the control to the directive
        if (child.data.directives && child.data.directives.some(isVShowDirective)) {
            child.data.show = true;
        }
        if (oldChild &&
            oldChild.data &&
            !isSameChild(child, oldChild) &&
            !isAsyncPlaceholder(oldChild) &&
            // #6687 component root is a comment node
            !(oldChild.componentInstance &&
                oldChild.componentInstance._vnode.isComment)) {
            // replace old child transition data with fresh one
            // important for dynamic transitions!
            const oldData = (oldChild.data.transition = extend({}, data));
            // handle transition mode
            if (mode === 'out-in') {
                // return placeholder node and queue update when leave finishes
                this._leaving = true;
                mergeVNodeHook(oldData, 'afterLeave', () => {
                    this._leaving = false;
                    this.$forceUpdate();
                });
                return placeholder(h, rawChild);
            }
            else if (mode === 'in-out') {
                if (isAsyncPlaceholder(child)) {
                    return oldRawChild;
                }
                let delayedLeave;
                const performLeave = () => {
                    delayedLeave();
                };
                mergeVNodeHook(data, 'afterEnter', performLeave);
                mergeVNodeHook(data, 'enterCancelled', performLeave);
                mergeVNodeHook(oldData, 'delayLeave', leave => {
                    delayedLeave = leave;
                });
            }
        }
        return rawChild;
    }
};

// Provides transition support for list items.
const props = extend({
    tag: String,
    moveClass: String
}, transitionProps);
delete props.mode;
var TransitionGroup = {
    props,
    beforeMount() {
        const update = this._update;
        this._update = (vnode, hydrating) => {
            const restoreActiveInstance = setActiveInstance(this);
            // force removing pass
            this.__patch__(this._vnode, this.kept, false, // hydrating
            true // removeOnly (!important, avoids unnecessary moves)
            );
            this._vnode = this.kept;
            restoreActiveInstance();
            update.call(this, vnode, hydrating);
        };
    },
    render(h) {
        const tag = this.tag || this.$vnode.data.tag || 'span';
        const map = Object.create(null);
        const prevChildren = (this.prevChildren = this.children);
        const rawChildren = this.$slots.default || [];
        const children = (this.children = []);
        const transitionData = extractTransitionData(this);
        for (let i = 0; i < rawChildren.length; i++) {
            const c = rawChildren[i];
            if (c.tag) {
                if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                    children.push(c);
                    map[c.key] = c;
                    (c.data || (c.data = {})).transition = transitionData;
                }
                else {
                    const opts = c.componentOptions;
                    const name = opts
                        ? getComponentName(opts.Ctor.options) || opts.tag || ''
                        : c.tag;
                    warn(`<transition-group> children must be keyed: <${name}>`);
                }
            }
        }
        if (prevChildren) {
            const kept = [];
            const removed = [];
            for (let i = 0; i < prevChildren.length; i++) {
                const c = prevChildren[i];
                c.data.transition = transitionData;
                // @ts-expect-error .getBoundingClientRect is not typed in Node
                c.data.pos = c.elm.getBoundingClientRect();
                if (map[c.key]) {
                    kept.push(c);
                }
                else {
                    removed.push(c);
                }
            }
            this.kept = h(tag, null, kept);
            this.removed = removed;
        }
        return h(tag, null, children);
    },
    updated() {
        const children = this.prevChildren;
        const moveClass = this.moveClass || (this.name || 'v') + '-move';
        if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
            return;
        }
        // we divide the work into three loops to avoid mixing DOM reads and writes
        // in each iteration - which helps prevent layout thrashing.
        children.forEach(callPendingCbs);
        children.forEach(recordPosition);
        children.forEach(applyTranslation);
        // force reflow to put everything in position
        // assign to this to avoid being removed in tree-shaking
        // $flow-disable-line
        this._reflow = document.body.offsetHeight;
        children.forEach((c) => {
            if (c.data.moved) {
                const el = c.elm;
                const s = el.style;
                addTransitionClass(el, moveClass);
                s.transform = s.WebkitTransform = s.transitionDuration = '';
                el.addEventListener(transitionEndEvent, (el._moveCb = function cb(e) {
                    if (e && e.target !== el) {
                        return;
                    }
                    if (!e || /transform$/.test(e.propertyName)) {
                        el.removeEventListener(transitionEndEvent, cb);
                        el._moveCb = null;
                        removeTransitionClass(el, moveClass);
                    }
                }));
            }
        });
    },
    methods: {
        hasMove(el, moveClass) {
            /* istanbul ignore if */
            if (!hasTransition) {
                return false;
            }
            /* istanbul ignore if */
            if (this._hasMove) {
                return this._hasMove;
            }
            // Detect whether an element with the move class applied has
            // CSS transitions. Since the element may be inside an entering
            // transition at this very moment, we make a clone of it and remove
            // all other transition classes applied to ensure only the move class
            // is applied.
            const clone = el.cloneNode();
            if (el._transitionClasses) {
                el._transitionClasses.forEach((cls) => {
                    removeClass(clone, cls);
                });
            }
            addClass(clone, moveClass);
            clone.style.display = 'none';
            this.$el.appendChild(clone);
            const info = getTransitionInfo(clone);
            this.$el.removeChild(clone);
            return (this._hasMove = info.hasTransform);
        }
    }
};
function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
        c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
        c.elm._enterCb();
    }
}
function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
}
function applyTranslation(c) {
    const oldPos = c.data.pos;
    const newPos = c.data.newPos;
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
        c.data.moved = true;
        const s = c.elm.style;
        s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = '0s';
    }
}

var platformComponents = {
    Transition,
    TransitionGroup
};

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;
// public mount method
Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
};
// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
    setTimeout(() => {
        if (config.devtools) {
            if (devtools) {
                devtools.emit('init', Vue);
            }
            else {
                // @ts-expect-error
                console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' +
                    'https://github.com/vuejs/vue-devtools');
            }
        }
        if (config.productionTip !== false &&
            typeof console !== 'undefined') {
            // @ts-expect-error
            console[console.info ? 'info' : 'log'](`You are running Vue in development mode.\n` +
                `Make sure to turn on production mode when deploying for production.\n` +
                `See more tips at https://vuejs.org/guide/deployment.html`);
        }
    }, 0);
}

extend(Vue, vca);

module.exports = Vue;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)

},{"timers":5}],9:[function(require,module,exports){
(function (process){
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./vue.runtime.common.prod.js')
} else {
  module.exports = require('./vue.runtime.common.dev.js')
}

}).call(this,require('_process'))

},{"./vue.runtime.common.dev.js":8,"./vue.runtime.common.prod.js":10,"_process":4}],10:[function(require,module,exports){
(function (global,setImmediate){
/*!
 * Vue.js v2.7.10
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
/*!
 * Vue.js v2.7.10
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
"use strict";const t=Object.freeze({}),e=Array.isArray;function n(t){return null==t}function o(t){return null!=t}function r(t){return!0===t}function s(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function i(t){return"function"==typeof t}function c(t){return null!==t&&"object"==typeof t}const a=Object.prototype.toString;function l(t){return"[object Object]"===a.call(t)}function u(t){const e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function f(t){return o(t)&&"function"==typeof t.then&&"function"==typeof t.catch}function d(t){return null==t?"":Array.isArray(t)||l(t)&&t.toString===a?JSON.stringify(t,null,2):String(t)}function p(t){const e=parseFloat(t);return isNaN(e)?t:e}function h(t,e){const n=Object.create(null),o=t.split(",");for(let t=0;t<o.length;t++)n[o[t]]=!0;return e?t=>n[t.toLowerCase()]:t=>n[t]}const m=h("key,ref,slot,slot-scope,is");function _(t,e){if(t.length){const n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}const v=Object.prototype.hasOwnProperty;function y(t,e){return v.call(t,e)}function g(t){const e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}const b=/-(\w)/g,$=g((t=>t.replace(b,((t,e)=>e?e.toUpperCase():"")))),w=g((t=>t.charAt(0).toUpperCase()+t.slice(1))),C=/\B([A-Z])/g,x=g((t=>t.replace(C,"-$1").toLowerCase()));const k=Function.prototype.bind?function(t,e){return t.bind(e)}:function(t,e){function n(n){const o=arguments.length;return o?o>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n};function O(t,e){e=e||0;let n=t.length-e;const o=new Array(n);for(;n--;)o[n]=t[n+e];return o}function S(t,e){for(const n in e)t[n]=e[n];return t}function A(t){const e={};for(let n=0;n<t.length;n++)t[n]&&S(e,t[n]);return e}function T(t,e,n){}const j=(t,e,n)=>!1,E=t=>t;function P(t,e){if(t===e)return!0;const n=c(t),o=c(e);if(!n||!o)return!n&&!o&&String(t)===String(e);try{const n=Array.isArray(t),o=Array.isArray(e);if(n&&o)return t.length===e.length&&t.every(((t,n)=>P(t,e[n])));if(t instanceof Date&&e instanceof Date)return t.getTime()===e.getTime();if(n||o)return!1;{const n=Object.keys(t),o=Object.keys(e);return n.length===o.length&&n.every((n=>P(t[n],e[n])))}}catch(t){return!1}}function I(t,e){for(let n=0;n<t.length;n++)if(P(t[n],e))return n;return-1}function D(t){let e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}function N(t,e){return t===e?0===t&&1/t!=1/e:t==t||e==e}const M=["component","directive","filter"],R=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch","renderTracked","renderTriggered"];var L={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:j,isReservedAttr:j,isUnknownElement:j,getTagNamespace:T,parsePlatformTagName:E,mustUseProp:j,async:!0,_lifecycleHooks:R};function F(t){const e=(t+"").charCodeAt(0);return 36===e||95===e}function U(t,e,n,o){Object.defineProperty(t,e,{value:n,enumerable:!!o,writable:!0,configurable:!0})}const B=new RegExp(`[^${/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/.source}.$_\\d]`);const V="__proto__"in{},z="undefined"!=typeof window,H=z&&window.navigator.userAgent.toLowerCase(),W=H&&/msie|trident/.test(H),K=H&&H.indexOf("msie 9.0")>0,q=H&&H.indexOf("edge/")>0;H&&H.indexOf("android");const G=H&&/iphone|ipad|ipod|ios/.test(H);H&&/chrome\/\d+/.test(H),H&&/phantomjs/.test(H);const Z=H&&H.match(/firefox\/(\d+)/),J={}.watch;let X,Q=!1;if(z)try{const t={};Object.defineProperty(t,"passive",{get(){Q=!0}}),window.addEventListener("test-passive",null,t)}catch(t){}const Y=()=>(void 0===X&&(X=!z&&"undefined"!=typeof global&&(global.process&&"server"===global.process.env.VUE_ENV)),X),tt=z&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function et(t){return"function"==typeof t&&/native code/.test(t.toString())}const nt="undefined"!=typeof Symbol&&et(Symbol)&&"undefined"!=typeof Reflect&&et(Reflect.ownKeys);let ot;ot="undefined"!=typeof Set&&et(Set)?Set:class{constructor(){this.set=Object.create(null)}has(t){return!0===this.set[t]}add(t){this.set[t]=!0}clear(){this.set=Object.create(null)}};let rt=null;function st(t=null){t||rt&&rt._scope.off(),rt=t,t&&t._scope.on()}class it{constructor(t,e,n,o,r,s,i,c){this.tag=t,this.data=e,this.children=n,this.text=o,this.elm=r,this.ns=void 0,this.context=s,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=i,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=c,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1}get child(){return this.componentInstance}}const ct=(t="")=>{const e=new it;return e.text=t,e.isComment=!0,e};function at(t){return new it(void 0,void 0,void 0,String(t))}function lt(t){const e=new it(t.tag,t.data,t.children&&t.children.slice(),t.text,t.elm,t.context,t.componentOptions,t.asyncFactory);return e.ns=t.ns,e.isStatic=t.isStatic,e.key=t.key,e.isComment=t.isComment,e.fnContext=t.fnContext,e.fnOptions=t.fnOptions,e.fnScopeId=t.fnScopeId,e.asyncMeta=t.asyncMeta,e.isCloned=!0,e}let ut=0;class ft{constructor(){this.id=ut++,this.subs=[]}addSub(t){this.subs.push(t)}removeSub(t){_(this.subs,t)}depend(t){ft.target&&ft.target.addDep(this)}notify(t){const e=this.subs.slice();for(let t=0,n=e.length;t<n;t++)e[t].update()}}ft.target=null;const dt=[];function pt(t){dt.push(t),ft.target=t}function ht(){dt.pop(),ft.target=dt[dt.length-1]}const mt=Array.prototype,_t=Object.create(mt);["push","pop","shift","unshift","splice","sort","reverse"].forEach((function(t){const e=mt[t];U(_t,t,(function(...n){const o=e.apply(this,n),r=this.__ob__;let s;switch(t){case"push":case"unshift":s=n;break;case"splice":s=n.slice(2)}return s&&r.observeArray(s),r.dep.notify(),o}))}));const vt=Object.getOwnPropertyNames(_t),yt={};let gt=!0;function bt(t){gt=t}const $t={notify:T,depend:T,addSub:T,removeSub:T};class wt{constructor(t,n=!1,o=!1){if(this.value=t,this.shallow=n,this.mock=o,this.dep=o?$t:new ft,this.vmCount=0,U(t,"__ob__",this),e(t)){if(!o)if(V)t.__proto__=_t;else for(let e=0,n=vt.length;e<n;e++){const n=vt[e];U(t,n,_t[n])}n||this.observeArray(t)}else{const e=Object.keys(t);for(let r=0;r<e.length;r++){xt(t,e[r],yt,void 0,n,o)}}}observeArray(t){for(let e=0,n=t.length;e<n;e++)Ct(t[e],!1,this.mock)}}function Ct(t,n,o){if(!c(t)||It(t)||t instanceof it)return;let r;return y(t,"__ob__")&&t.__ob__ instanceof wt?r=t.__ob__:!gt||!o&&Y()||!e(t)&&!l(t)||!Object.isExtensible(t)||t.__v_skip||(r=new wt(t,n,o)),r}function xt(t,n,o,r,s,i){const c=new ft,a=Object.getOwnPropertyDescriptor(t,n);if(a&&!1===a.configurable)return;const l=a&&a.get,u=a&&a.set;l&&!u||o!==yt&&2!==arguments.length||(o=t[n]);let f=!s&&Ct(o,!1,i);return Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:function(){const n=l?l.call(t):o;return ft.target&&(c.depend(),f&&(f.dep.depend(),e(n)&&St(n))),It(n)&&!s?n.value:n},set:function(e){const n=l?l.call(t):o;if(N(n,e)){if(u)u.call(t,e);else{if(l)return;if(!s&&It(n)&&!It(e))return void(n.value=e);o=e}f=!s&&Ct(e,!1,i),c.notify()}}}),c}function kt(t,n,o){if(Pt(t))return;const r=t.__ob__;return e(t)&&u(n)?(t.length=Math.max(t.length,n),t.splice(n,1,o),r&&!r.shallow&&r.mock&&Ct(o,!1,!0),o):n in t&&!(n in Object.prototype)?(t[n]=o,o):t._isVue||r&&r.vmCount?o:r?(xt(r.value,n,o,void 0,r.shallow,r.mock),r.dep.notify(),o):(t[n]=o,o)}function Ot(t,n){if(e(t)&&u(n))return void t.splice(n,1);const o=t.__ob__;t._isVue||o&&o.vmCount||Pt(t)||y(t,n)&&(delete t[n],o&&o.dep.notify())}function St(t){for(let n,o=0,r=t.length;o<r;o++)n=t[o],n&&n.__ob__&&n.__ob__.dep.depend(),e(n)&&St(n)}function At(t){return Tt(t,!0),U(t,"__v_isShallow",!0),t}function Tt(t,e){Pt(t)||Ct(t,e,Y())}function jt(t){return Pt(t)?jt(t.__v_raw):!(!t||!t.__ob__)}function Et(t){return!(!t||!t.__v_isShallow)}function Pt(t){return!(!t||!t.__v_isReadonly)}function It(t){return!(!t||!0!==t.__v_isRef)}function Dt(t,e){if(It(t))return t;const n={};return U(n,"__v_isRef",!0),U(n,"__v_isShallow",e),U(n,"dep",xt(n,"value",t,null,e,Y())),n}function Nt(t,e,n){Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>{const t=e[n];if(It(t))return t.value;{const e=t&&t.__ob__;return e&&e.dep.depend(),t}},set:t=>{const o=e[n];It(o)&&!It(t)?o.value=t:e[n]=t}})}function Mt(t,e,n){const o=t[e];if(It(o))return o;const r={get value(){const o=t[e];return void 0===o?n:o},set value(n){t[e]=n}};return U(r,"__v_isRef",!0),r}function Rt(t){return Lt(t,!1)}function Lt(t,e){if(!l(t))return t;if(Pt(t))return t;const n=e?"__v_rawToShallowReadonly":"__v_rawToReadonly",o=t[n];if(o)return o;const r=Object.create(Object.getPrototypeOf(t));U(t,n,r),U(r,"__v_isReadonly",!0),U(r,"__v_raw",t),It(t)&&U(r,"__v_isRef",!0),(e||Et(t))&&U(r,"__v_isShallow",!0);const s=Object.keys(t);for(let n=0;n<s.length;n++)Ft(r,t,s[n],e);return r}function Ft(t,e,n,o){Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get(){const t=e[n];return o||!l(t)?t:Rt(t)},set(){}})}function Ut(t,e){return Vt(t,null,{flush:"post"})}const Bt={};function Vt(n,o,{immediate:r,deep:s,flush:c="pre",onTrack:a,onTrigger:l}=t){const u=rt,f=(t,e,n=null)=>Pe(t,null,n,u,e);let d,p,h=!1,m=!1;if(It(n)?(d=()=>n.value,h=Et(n)):jt(n)?(d=()=>(n.__ob__.dep.depend(),n),s=!0):e(n)?(m=!0,h=n.some((t=>jt(t)||Et(t))),d=()=>n.map((t=>It(t)?t.value:jt(t)?nn(t):i(t)?f(t,"watcher getter"):void 0))):d=i(n)?o?()=>f(n,"watcher getter"):()=>{if(!u||!u._isDestroyed)return p&&p(),f(n,"watcher",[_])}:T,o&&s){const t=d;d=()=>nn(t())}let _=t=>{p=v.onStop=()=>{f(t,"watcher cleanup")}};if(Y())return _=T,o?r&&f(o,"watcher callback",[d(),m?[]:void 0,_]):d(),T;const v=new cn(rt,d,T,{lazy:!0});v.noRecurse=!o;let y=m?[]:Bt;return v.run=()=>{if(v.active)if(o){const t=v.get();(s||h||(m?t.some(((t,e)=>N(t,y[e]))):N(t,y)))&&(p&&p(),f(o,"watcher callback",[t,y===Bt?void 0:y,_]),y=t)}else v.get()},"sync"===c?v.update=v.run:"post"===c?(v.post=!0,v.update=()=>An(v)):v.update=()=>{if(u&&u===rt&&!u._isMounted){const t=u._preWatchers||(u._preWatchers=[]);t.indexOf(v)<0&&t.push(v)}else An(v)},o?r?v.run():y=v.get():"post"===c&&u?u.$once("hook:mounted",(()=>v.get())):v.get(),()=>{v.teardown()}}let zt;class Ht{constructor(t=!1){this.active=!0,this.effects=[],this.cleanups=[],!t&&zt&&(this.parent=zt,this.index=(zt.scopes||(zt.scopes=[])).push(this)-1)}run(t){if(this.active){const e=zt;try{return zt=this,t()}finally{zt=e}}}on(){zt=this}off(){zt=this.parent}stop(t){if(this.active){let e,n;for(e=0,n=this.effects.length;e<n;e++)this.effects[e].teardown();for(e=0,n=this.cleanups.length;e<n;e++)this.cleanups[e]();if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].stop(!0);if(this.parent&&!t){const t=this.parent.scopes.pop();t&&t!==this&&(this.parent.scopes[this.index]=t,t.index=this.index)}this.active=!1}}}function Wt(t){const e=t._provided,n=t.$parent&&t.$parent._provided;return n===e?t._provided=Object.create(n):e}const Kt=g((t=>{const e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),o="!"===(t=n?t.slice(1):t).charAt(0);return{name:t=o?t.slice(1):t,once:n,capture:o,passive:e}}));function qt(t,n){function o(){const t=o.fns;if(!e(t))return Pe(t,null,arguments,n,"v-on handler");{const e=t.slice();for(let t=0;t<e.length;t++)Pe(e[t],null,arguments,n,"v-on handler")}}return o.fns=t,o}function Gt(t,e,o,s,i,c){let a,l,u,f;for(a in t)l=t[a],u=e[a],f=Kt(a),n(l)||(n(u)?(n(l.fns)&&(l=t[a]=qt(l,c)),r(f.once)&&(l=t[a]=i(f.name,l,f.capture)),o(f.name,l,f.capture,f.passive,f.params)):l!==u&&(u.fns=l,t[a]=u));for(a in e)n(t[a])&&(f=Kt(a),s(f.name,e[a],f.capture))}function Zt(t,e,s){let i;t instanceof it&&(t=t.data.hook||(t.data.hook={}));const c=t[e];function a(){s.apply(this,arguments),_(i.fns,a)}n(c)?i=qt([a]):o(c.fns)&&r(c.merged)?(i=c,i.fns.push(a)):i=qt([c,a]),i.merged=!0,t[e]=i}function Jt(t,e,n,r,s){if(o(e)){if(y(e,n))return t[n]=e[n],s||delete e[n],!0;if(y(e,r))return t[n]=e[r],s||delete e[r],!0}return!1}function Xt(t){return s(t)?[at(t)]:e(t)?Yt(t):void 0}function Qt(t){return o(t)&&o(t.text)&&!1===t.isComment}function Yt(t,i){const c=[];let a,l,u,f;for(a=0;a<t.length;a++)l=t[a],n(l)||"boolean"==typeof l||(u=c.length-1,f=c[u],e(l)?l.length>0&&(l=Yt(l,`${i||""}_${a}`),Qt(l[0])&&Qt(f)&&(c[u]=at(f.text+l[0].text),l.shift()),c.push.apply(c,l)):s(l)?Qt(f)?c[u]=at(f.text+l):""!==l&&c.push(at(l)):Qt(l)&&Qt(f)?c[u]=at(f.text+l.text):(r(t._isVList)&&o(l.tag)&&n(l.key)&&o(i)&&(l.key=`__vlist${i}_${a}__`),c.push(l)));return c}function te(t,n){let r,s,i,a,l=null;if(e(t)||"string"==typeof t)for(l=new Array(t.length),r=0,s=t.length;r<s;r++)l[r]=n(t[r],r);else if("number"==typeof t)for(l=new Array(t),r=0;r<t;r++)l[r]=n(r+1,r);else if(c(t))if(nt&&t[Symbol.iterator]){l=[];const e=t[Symbol.iterator]();let o=e.next();for(;!o.done;)l.push(n(o.value,l.length)),o=e.next()}else for(i=Object.keys(t),l=new Array(i.length),r=0,s=i.length;r<s;r++)a=i[r],l[r]=n(t[a],a,r);return o(l)||(l=[]),l._isVList=!0,l}function ee(t,e,n,o){const r=this.$scopedSlots[t];let s;r?(n=n||{},o&&(n=S(S({},o),n)),s=r(n)||(i(e)?e():e)):s=this.$slots[t]||(i(e)?e():e);const c=n&&n.slot;return c?this.$createElement("template",{slot:c},s):s}function ne(t){return Kn(this.$options,"filters",t)||E}function oe(t,n){return e(t)?-1===t.indexOf(n):t!==n}function re(t,e,n,o,r){const s=L.keyCodes[e]||n;return r&&o&&!L.keyCodes[e]?oe(r,o):s?oe(s,t):o?x(o)!==e:void 0===t}function se(t,n,o,r,s){if(o)if(c(o)){let i;e(o)&&(o=A(o));for(const e in o){if("class"===e||"style"===e||m(e))i=t;else{const o=t.attrs&&t.attrs.type;i=r||L.mustUseProp(n,o,e)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}const c=$(e),a=x(e);if(!(c in i)&&!(a in i)&&(i[e]=o[e],s)){(t.on||(t.on={}))[`update:${e}`]=function(t){o[e]=t}}}}else;return t}function ie(t,e){const n=this._staticTrees||(this._staticTrees=[]);let o=n[t];return o&&!e||(o=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,this._c,this),ae(o,`__static__${t}`,!1)),o}function ce(t,e,n){return ae(t,`__once__${e}${n?`_${n}`:""}`,!0),t}function ae(t,n,o){if(e(t))for(let e=0;e<t.length;e++)t[e]&&"string"!=typeof t[e]&&le(t[e],`${n}_${e}`,o);else le(t,n,o)}function le(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function ue(t,e){if(e)if(l(e)){const n=t.on=t.on?S({},t.on):{};for(const t in e){const o=n[t],r=e[t];n[t]=o?[].concat(o,r):r}}else;return t}function fe(t,n,o,r){n=n||{$stable:!o};for(let r=0;r<t.length;r++){const s=t[r];e(s)?fe(s,n,o):s&&(s.proxy&&(s.fn.proxy=!0),n[s.key]=s.fn)}return r&&(n.$key=r),n}function de(t,e){for(let n=0;n<e.length;n+=2){const o=e[n];"string"==typeof o&&o&&(t[e[n]]=e[n+1])}return t}function pe(t,e){return"string"==typeof t?e+t:t}function he(t){t._o=ce,t._n=p,t._s=d,t._l=te,t._t=ee,t._q=P,t._i=I,t._m=ie,t._f=ne,t._k=re,t._b=se,t._v=at,t._e=ct,t._u=fe,t._g=ue,t._d=de,t._p=pe}function me(t,e){if(!t||!t.length)return{};const n={};for(let o=0,r=t.length;o<r;o++){const r=t[o],s=r.data;if(s&&s.attrs&&s.attrs.slot&&delete s.attrs.slot,r.context!==e&&r.fnContext!==e||!s||null==s.slot)(n.default||(n.default=[])).push(r);else{const t=s.slot,e=n[t]||(n[t]=[]);"template"===r.tag?e.push.apply(e,r.children||[]):e.push(r)}}for(const t in n)n[t].every(_e)&&delete n[t];return n}function _e(t){return t.isComment&&!t.asyncFactory||" "===t.text}function ve(t){return t.isComment&&t.asyncFactory}function ye(e,n,o,r){let s;const i=Object.keys(o).length>0,c=n?!!n.$stable:!i,a=n&&n.$key;if(n){if(n._normalized)return n._normalized;if(c&&r&&r!==t&&a===r.$key&&!i&&!r.$hasNormal)return r;s={};for(const t in n)n[t]&&"$"!==t[0]&&(s[t]=ge(e,o,t,n[t]))}else s={};for(const t in o)t in s||(s[t]=be(o,t));return n&&Object.isExtensible(n)&&(n._normalized=s),U(s,"$stable",c),U(s,"$key",a),U(s,"$hasNormal",i),s}function ge(t,n,o,r){const s=function(){const n=rt;st(t);let o=arguments.length?r.apply(null,arguments):r({});o=o&&"object"==typeof o&&!e(o)?[o]:Xt(o);const s=o&&o[0];return st(n),o&&(!s||1===o.length&&s.isComment&&!ve(s))?void 0:o};return r.proxy&&Object.defineProperty(n,o,{get:s,enumerable:!0,configurable:!0}),s}function be(t,e){return()=>t[e]}function $e(e){return{get attrs(){if(!e._attrsProxy){const n=e._attrsProxy={};U(n,"_v_attr_proxy",!0),we(n,e.$attrs,t,e,"$attrs")}return e._attrsProxy},get listeners(){if(!e._listenersProxy){we(e._listenersProxy={},e.$listeners,t,e,"$listeners")}return e._listenersProxy},get slots(){return function(t){t._slotsProxy||xe(t._slotsProxy={},t.$scopedSlots);return t._slotsProxy}(e)},emit:k(e.$emit,e),expose(t){t&&Object.keys(t).forEach((n=>Nt(e,t,n)))}}}function we(t,e,n,o,r){let s=!1;for(const i in e)i in t?e[i]!==n[i]&&(s=!0):(s=!0,Ce(t,i,o,r));for(const n in t)n in e||(s=!0,delete t[n]);return s}function Ce(t,e,n,o){Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:()=>n[o][e]})}function xe(t,e){for(const n in e)t[n]=e[n];for(const n in t)n in e||delete t[n]}function ke(){const t=rt;return t._setupContext||(t._setupContext=$e(t))}let Oe=null;function Se(t,e){return(t.__esModule||nt&&"Module"===t[Symbol.toStringTag])&&(t=t.default),c(t)?e.extend(t):t}function Ae(t){if(e(t))for(let e=0;e<t.length;e++){const n=t[e];if(o(n)&&(o(n.componentOptions)||ve(n)))return n}}function Te(t,n,a,l,u,f){return(e(a)||s(a))&&(u=l,l=a,a=void 0),r(f)&&(u=2),function(t,n,r,s,a){if(o(r)&&o(r.__ob__))return ct();o(r)&&o(r.is)&&(n=r.is);if(!n)return ct();e(s)&&i(s[0])&&((r=r||{}).scopedSlots={default:s[0]},s.length=0);2===a?s=Xt(s):1===a&&(s=function(t){for(let n=0;n<t.length;n++)if(e(t[n]))return Array.prototype.concat.apply([],t);return t}(s));let l,u;if("string"==typeof n){let e;u=t.$vnode&&t.$vnode.ns||L.getTagNamespace(n),l=L.isReservedTag(n)?new it(L.parsePlatformTagName(n),r,s,void 0,void 0,t):r&&r.pre||!o(e=Kn(t.$options,"components",n))?new it(n,r,s,void 0,void 0,t):Mn(e,r,t,s,n)}else l=Mn(n,r,t,s);return e(l)?l:o(l)?(o(u)&&je(l,u),o(r)&&function(t){c(t.style)&&nn(t.style);c(t.class)&&nn(t.class)}(r),l):ct()}(t,n,a,l,u)}function je(t,e,s){if(t.ns=e,"foreignObject"===t.tag&&(e=void 0,s=!0),o(t.children))for(let i=0,c=t.children.length;i<c;i++){const c=t.children[i];o(c.tag)&&(n(c.ns)||r(s)&&"svg"!==c.tag)&&je(c,e,s)}}function Ee(t,e,n){pt();try{if(e){let o=e;for(;o=o.$parent;){const r=o.$options.errorCaptured;if(r)for(let s=0;s<r.length;s++)try{if(!1===r[s].call(o,t,e,n))return}catch(t){Ie(t,o,"errorCaptured hook")}}}Ie(t,e,n)}finally{ht()}}function Pe(t,e,n,o,r){let s;try{s=n?t.apply(e,n):t.call(e),s&&!s._isVue&&f(s)&&!s._handled&&(s.catch((t=>Ee(t,o,r+" (Promise/async)"))),s._handled=!0)}catch(t){Ee(t,o,r)}return s}function Ie(t,e,n){if(L.errorHandler)try{return L.errorHandler.call(null,t,e,n)}catch(e){e!==t&&De(e)}De(t)}function De(t,e,n){if(!z||"undefined"==typeof console)throw t;console.error(t)}let Ne=!1;const Me=[];let Re,Le=!1;function Fe(){Le=!1;const t=Me.slice(0);Me.length=0;for(let e=0;e<t.length;e++)t[e]()}if("undefined"!=typeof Promise&&et(Promise)){const t=Promise.resolve();Re=()=>{t.then(Fe),G&&setTimeout(T)},Ne=!0}else if(W||"undefined"==typeof MutationObserver||!et(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())Re="undefined"!=typeof setImmediate&&et(setImmediate)?()=>{setImmediate(Fe)}:()=>{setTimeout(Fe,0)};else{let t=1;const e=new MutationObserver(Fe),n=document.createTextNode(String(t));e.observe(n,{characterData:!0}),Re=()=>{t=(t+1)%2,n.data=String(t)},Ne=!0}function Ue(t,e){let n;if(Me.push((()=>{if(t)try{t.call(e)}catch(t){Ee(t,e,"nextTick")}else n&&n(e)})),Le||(Le=!0,Re()),!t&&"undefined"!=typeof Promise)return new Promise((t=>{n=t}))}function Be(t){return(e,n=rt)=>{if(n)return function(t,e,n){const o=t.$options;o[e]=Vn(o[e],n)}(n,t,e)}}const Ve=Be("beforeMount"),ze=Be("mounted"),He=Be("beforeUpdate"),We=Be("updated"),Ke=Be("beforeDestroy"),qe=Be("destroyed"),Ge=Be("activated"),Ze=Be("deactivated"),Je=Be("serverPrefetch"),Xe=Be("renderTracked"),Qe=Be("renderTriggered"),Ye=Be("errorCaptured");var tn=Object.freeze({__proto__:null,version:"2.7.10",defineComponent:function(t){return t},ref:function(t){return Dt(t,!1)},shallowRef:function(t){return Dt(t,!0)},isRef:It,toRef:Mt,toRefs:function(t){const n=e(t)?new Array(t.length):{};for(const e in t)n[e]=Mt(t,e);return n},unref:function(t){return It(t)?t.value:t},proxyRefs:function(t){if(jt(t))return t;const e={},n=Object.keys(t);for(let o=0;o<n.length;o++)Nt(e,t,n[o]);return e},customRef:function(t){const e=new ft,{get:n,set:o}=t((()=>{e.depend()}),(()=>{e.notify()})),r={get value(){return n()},set value(t){o(t)}};return U(r,"__v_isRef",!0),r},triggerRef:function(t){t.dep&&t.dep.notify()},reactive:function(t){return Tt(t,!1),t},isReactive:jt,isReadonly:Pt,isShallow:Et,isProxy:function(t){return jt(t)||Pt(t)},shallowReactive:At,markRaw:function(t){return U(t,"__v_skip",!0),t},toRaw:function t(e){const n=e&&e.__v_raw;return n?t(n):e},readonly:Rt,shallowReadonly:function(t){return Lt(t,!0)},computed:function(t,e){let n,o;const r=i(t);r?(n=t,o=T):(n=t.get,o=t.set);const s=Y()?null:new cn(rt,n,T,{lazy:!0}),c={effect:s,get value(){return s?(s.dirty&&s.evaluate(),ft.target&&s.depend(),s.value):n()},set value(t){o(t)}};return U(c,"__v_isRef",!0),U(c,"__v_isReadonly",r),c},watch:function(t,e,n){return Vt(t,e,n)},watchEffect:function(t,e){return Vt(t,null,e)},watchPostEffect:Ut,watchSyncEffect:function(t,e){return Vt(t,null,{flush:"sync"})},EffectScope:Ht,effectScope:function(t){return new Ht(t)},onScopeDispose:function(t){zt&&zt.cleanups.push(t)},getCurrentScope:function(){return zt},provide:function(t,e){rt&&(Wt(rt)[t]=e)},inject:function(t,e,n=!1){const o=rt;if(o){const r=o.$parent&&o.$parent._provided;if(r&&t in r)return r[t];if(arguments.length>1)return n&&i(e)?e.call(o):e}},h:function(t,e,n){return Te(rt,t,e,n,2,!0)},getCurrentInstance:function(){return rt&&{proxy:rt}},useSlots:function(){return ke().slots},useAttrs:function(){return ke().attrs},useListeners:function(){return ke().listeners},mergeDefaults:function(t,n){const o=e(t)?t.reduce(((t,e)=>(t[e]={},t)),{}):t;for(const t in n){const r=o[t];r?e(r)||i(r)?o[t]={type:r,default:n[t]}:r.default=n[t]:null===r&&(o[t]={default:n[t]})}return o},nextTick:Ue,set:kt,del:Ot,useCssModule:function(e="$style"){{if(!rt)return t;const n=rt[e];return n||t}},useCssVars:function(t){if(!z)return;const e=rt;e&&Ut((()=>{const n=e.$el,o=t(e,e._setupProxy);if(n&&1===n.nodeType){const t=n.style;for(const e in o)t.setProperty(`--${e}`,o[e])}}))},defineAsyncComponent:function(t){i(t)&&(t={loader:t});const{loader:e,loadingComponent:n,errorComponent:o,delay:r=200,timeout:s,suspensible:c=!1,onError:a}=t;let l=null,u=0;const f=()=>{let t;return l||(t=l=e().catch((t=>{if(t=t instanceof Error?t:new Error(String(t)),a)return new Promise(((e,n)=>{a(t,(()=>e((u++,l=null,f()))),(()=>n(t)),u+1)}));throw t})).then((e=>t!==l&&l?l:(e&&(e.__esModule||"Module"===e[Symbol.toStringTag])&&(e=e.default),e))))};return()=>({component:f(),delay:r,timeout:s,error:o,loading:n})},onBeforeMount:Ve,onMounted:ze,onBeforeUpdate:He,onUpdated:We,onBeforeUnmount:Ke,onUnmounted:qe,onActivated:Ge,onDeactivated:Ze,onServerPrefetch:Je,onRenderTracked:Xe,onRenderTriggered:Qe,onErrorCaptured:function(t,e=rt){Ye(t,e)}});const en=new ot;function nn(t){return on(t,en),en.clear(),t}function on(t,n){let o,r;const s=e(t);if(!(!s&&!c(t)||Object.isFrozen(t)||t instanceof it)){if(t.__ob__){const e=t.__ob__.dep.id;if(n.has(e))return;n.add(e)}if(s)for(o=t.length;o--;)on(t[o],n);else if(It(t))on(t.value,n);else for(r=Object.keys(t),o=r.length;o--;)on(t[r[o]],n)}}let rn,sn=0;class cn{constructor(t,e,n,o,r){!function(t,e=zt){e&&e.active&&e.effects.push(t)}(this,zt&&!zt._vm?zt:t?t._scope:void 0),(this.vm=t)&&r&&(t._watcher=this),o?(this.deep=!!o.deep,this.user=!!o.user,this.lazy=!!o.lazy,this.sync=!!o.sync,this.before=o.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++sn,this.active=!0,this.post=!1,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new ot,this.newDepIds=new ot,this.expression="",i(e)?this.getter=e:(this.getter=function(t){if(B.test(t))return;const e=t.split(".");return function(t){for(let n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}(e),this.getter||(this.getter=T)),this.value=this.lazy?void 0:this.get()}get(){let t;pt(this);const e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;Ee(t,e,`getter for watcher "${this.expression}"`)}finally{this.deep&&nn(t),ht(),this.cleanupDeps()}return t}addDep(t){const e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))}cleanupDeps(){let t=this.deps.length;for(;t--;){const e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}let e=this.depIds;this.depIds=this.newDepIds,this.newDepIds=e,this.newDepIds.clear(),e=this.deps,this.deps=this.newDeps,this.newDeps=e,this.newDeps.length=0}update(){this.lazy?this.dirty=!0:this.sync?this.run():An(this)}run(){if(this.active){const t=this.get();if(t!==this.value||c(t)||this.deep){const e=this.value;if(this.value=t,this.user){const n=`callback for watcher "${this.expression}"`;Pe(this.cb,this.vm,[t,e],this.vm,n)}else this.cb.call(this.vm,t,e)}}}evaluate(){this.value=this.get(),this.dirty=!1}depend(){let t=this.deps.length;for(;t--;)this.deps[t].depend()}teardown(){if(this.vm&&!this.vm._isBeingDestroyed&&_(this.vm._scope.effects,this),this.active){let t=this.deps.length;for(;t--;)this.deps[t].removeSub(this);this.active=!1,this.onStop&&this.onStop()}}}function an(t,e){rn.$on(t,e)}function ln(t,e){rn.$off(t,e)}function un(t,e){const n=rn;return function o(){const r=e.apply(null,arguments);null!==r&&n.$off(t,o)}}function fn(t,e,n){rn=t,Gt(e,n||{},an,ln,un,t),rn=void 0}let dn=null;function pn(t){const e=dn;return dn=t,()=>{dn=e}}function hn(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function mn(t,e){if(e){if(t._directInactive=!1,hn(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(let e=0;e<t.$children.length;e++)mn(t.$children[e]);vn(t,"activated")}}function _n(t,e){if(!(e&&(t._directInactive=!0,hn(t))||t._inactive)){t._inactive=!0;for(let e=0;e<t.$children.length;e++)_n(t.$children[e]);vn(t,"deactivated")}}function vn(t,e,n,o=!0){pt();const r=rt;o&&st(t);const s=t.$options[e],i=`${e} hook`;if(s)for(let e=0,o=s.length;e<o;e++)Pe(s[e],t,n||null,t,i);t._hasHookEvent&&t.$emit("hook:"+e),o&&st(r),ht()}const yn=[],gn=[];let bn={},$n=!1,wn=!1,Cn=0;let xn=0,kn=Date.now;if(z&&!W){const t=window.performance;t&&"function"==typeof t.now&&kn()>document.createEvent("Event").timeStamp&&(kn=()=>t.now())}const On=(t,e)=>{if(t.post){if(!e.post)return 1}else if(e.post)return-1;return t.id-e.id};function Sn(){let t,e;for(xn=kn(),wn=!0,yn.sort(On),Cn=0;Cn<yn.length;Cn++)t=yn[Cn],t.before&&t.before(),e=t.id,bn[e]=null,t.run();const n=gn.slice(),o=yn.slice();Cn=yn.length=gn.length=0,bn={},$n=wn=!1,function(t){for(let e=0;e<t.length;e++)t[e]._inactive=!0,mn(t[e],!0)}(n),function(t){let e=t.length;for(;e--;){const n=t[e],o=n.vm;o&&o._watcher===n&&o._isMounted&&!o._isDestroyed&&vn(o,"updated")}}(o),tt&&L.devtools&&tt.emit("flush")}function An(t){const e=t.id;if(null==bn[e]&&(t!==ft.target||!t.noRecurse)){if(bn[e]=!0,wn){let e=yn.length-1;for(;e>Cn&&yn[e].id>t.id;)e--;yn.splice(e+1,0,t)}else yn.push(t);$n||($n=!0,Ue(Sn))}}function Tn(t,e){if(t){const n=Object.create(null),o=nt?Reflect.ownKeys(t):Object.keys(t);for(let r=0;r<o.length;r++){const s=o[r];if("__ob__"===s)continue;const c=t[s].from;if(c in e._provided)n[s]=e._provided[c];else if("default"in t[s]){const o=t[s].default;n[s]=i(o)?o.call(e):o}}return n}}function jn(n,o,s,i,c){const a=c.options;let l;y(i,"_uid")?(l=Object.create(i),l._original=i):(l=i,i=i._original);const u=r(a._compiled),f=!u;this.data=n,this.props=o,this.children=s,this.parent=i,this.listeners=n.on||t,this.injections=Tn(a.inject,i),this.slots=()=>(this.$slots||ye(i,n.scopedSlots,this.$slots=me(s,i)),this.$slots),Object.defineProperty(this,"scopedSlots",{enumerable:!0,get(){return ye(i,n.scopedSlots,this.slots())}}),u&&(this.$options=a,this.$slots=this.slots(),this.$scopedSlots=ye(i,n.scopedSlots,this.$slots)),a._scopeId?this._c=(t,n,o,r)=>{const s=Te(l,t,n,o,r,f);return s&&!e(s)&&(s.fnScopeId=a._scopeId,s.fnContext=i),s}:this._c=(t,e,n,o)=>Te(l,t,e,n,o,f)}function En(t,e,n,o,r){const s=lt(t);return s.fnContext=n,s.fnOptions=o,e.slot&&((s.data||(s.data={})).slot=e.slot),s}function Pn(t,e){for(const n in e)t[$(n)]=e[n]}function In(t){return t.name||t.__name||t._componentTag}he(jn.prototype);const Dn={init(t,e){if(t.componentInstance&&!t.componentInstance._isDestroyed&&t.data.keepAlive){const e=t;Dn.prepatch(e,e)}else{(t.componentInstance=function(t,e){const n={_isComponent:!0,_parentVnode:t,parent:e},r=t.data.inlineTemplate;o(r)&&(n.render=r.render,n.staticRenderFns=r.staticRenderFns);return new t.componentOptions.Ctor(n)}(t,dn)).$mount(e?t.elm:void 0,e)}},prepatch(e,n){const o=n.componentOptions;!function(e,n,o,r,s){const i=r.data.scopedSlots,c=e.$scopedSlots,a=!!(i&&!i.$stable||c!==t&&!c.$stable||i&&e.$scopedSlots.$key!==i.$key||!i&&e.$scopedSlots.$key);let l=!!(s||e.$options._renderChildren||a);const u=e.$vnode;e.$options._parentVnode=r,e.$vnode=r,e._vnode&&(e._vnode.parent=r),e.$options._renderChildren=s;const f=r.data.attrs||t;e._attrsProxy&&we(e._attrsProxy,f,u.data&&u.data.attrs||t,e,"$attrs")&&(l=!0),e.$attrs=f,o=o||t;const d=e.$options._parentListeners;if(e._listenersProxy&&we(e._listenersProxy,o,d||t,e,"$listeners"),e.$listeners=e.$options._parentListeners=o,fn(e,o,d),n&&e.$options.props){bt(!1);const t=e._props,o=e.$options._propKeys||[];for(let r=0;r<o.length;r++){const s=o[r],i=e.$options.props;t[s]=qn(s,i,n,e)}bt(!0),e.$options.propsData=n}l&&(e.$slots=me(s,r.context),e.$forceUpdate())}(n.componentInstance=e.componentInstance,o.propsData,o.listeners,n,o.children)},insert(t){const{context:e,componentInstance:n}=t;var o;n._isMounted||(n._isMounted=!0,vn(n,"mounted")),t.data.keepAlive&&(e._isMounted?((o=n)._inactive=!1,gn.push(o)):mn(n,!0))},destroy(t){const{componentInstance:e}=t;e._isDestroyed||(t.data.keepAlive?_n(e,!0):e.$destroy())}},Nn=Object.keys(Dn);function Mn(s,i,a,l,u){if(n(s))return;const d=a.$options._base;if(c(s)&&(s=d.extend(s)),"function"!=typeof s)return;let p;if(n(s.cid)&&(p=s,s=function(t,e){if(r(t.error)&&o(t.errorComp))return t.errorComp;if(o(t.resolved))return t.resolved;const s=Oe;if(s&&o(t.owners)&&-1===t.owners.indexOf(s)&&t.owners.push(s),r(t.loading)&&o(t.loadingComp))return t.loadingComp;if(s&&!o(t.owners)){const r=t.owners=[s];let i=!0,a=null,l=null;s.$on("hook:destroyed",(()=>_(r,s)));const u=t=>{for(let t=0,e=r.length;t<e;t++)r[t].$forceUpdate();t&&(r.length=0,null!==a&&(clearTimeout(a),a=null),null!==l&&(clearTimeout(l),l=null))},d=D((n=>{t.resolved=Se(n,e),i?r.length=0:u(!0)})),p=D((e=>{o(t.errorComp)&&(t.error=!0,u(!0))})),h=t(d,p);return c(h)&&(f(h)?n(t.resolved)&&h.then(d,p):f(h.component)&&(h.component.then(d,p),o(h.error)&&(t.errorComp=Se(h.error,e)),o(h.loading)&&(t.loadingComp=Se(h.loading,e),0===h.delay?t.loading=!0:a=setTimeout((()=>{a=null,n(t.resolved)&&n(t.error)&&(t.loading=!0,u(!1))}),h.delay||200)),o(h.timeout)&&(l=setTimeout((()=>{l=null,n(t.resolved)&&p(null)}),h.timeout)))),i=!1,t.loading?t.loadingComp:t.resolved}}(p,d),void 0===s))return function(t,e,n,o,r){const s=ct();return s.asyncFactory=t,s.asyncMeta={data:e,context:n,children:o,tag:r},s}(p,i,a,l,u);i=i||{},co(s),o(i.model)&&function(t,n){const r=t.model&&t.model.prop||"value",s=t.model&&t.model.event||"input";(n.attrs||(n.attrs={}))[r]=n.model.value;const i=n.on||(n.on={}),c=i[s],a=n.model.callback;o(c)?(e(c)?-1===c.indexOf(a):c!==a)&&(i[s]=[a].concat(c)):i[s]=a}(s.options,i);const h=function(t,e,r){const s=e.options.props;if(n(s))return;const i={},{attrs:c,props:a}=t;if(o(c)||o(a))for(const t in s){const e=x(t);Jt(i,a,t,e,!0)||Jt(i,c,t,e,!1)}return i}(i,s);if(r(s.options.functional))return function(n,r,s,i,c){const a=n.options,l={},u=a.props;if(o(u))for(const e in u)l[e]=qn(e,u,r||t);else o(s.attrs)&&Pn(l,s.attrs),o(s.props)&&Pn(l,s.props);const f=new jn(s,l,c,i,n),d=a.render.call(null,f._c,f);if(d instanceof it)return En(d,s,f.parent,a);if(e(d)){const t=Xt(d)||[],e=new Array(t.length);for(let n=0;n<t.length;n++)e[n]=En(t[n],s,f.parent,a);return e}}(s,h,i,a,l);const m=i.on;if(i.on=i.nativeOn,r(s.options.abstract)){const t=i.slot;i={},t&&(i.slot=t)}!function(t){const e=t.hook||(t.hook={});for(let t=0;t<Nn.length;t++){const n=Nn[t],o=e[n],r=Dn[n];o===r||o&&o._merged||(e[n]=o?Rn(r,o):r)}}(i);const v=In(s.options)||u;return new it(`vue-component-${s.cid}${v?`-${v}`:""}`,i,void 0,void 0,void 0,a,{Ctor:s,propsData:h,listeners:m,tag:u,children:l},p)}function Rn(t,e){const n=(n,o)=>{t(n,o),e(n,o)};return n._merged=!0,n}let Ln=T;const Fn=L.optionMergeStrategies;function Un(t,e){if(!e)return t;let n,o,r;const s=nt?Reflect.ownKeys(e):Object.keys(e);for(let i=0;i<s.length;i++)n=s[i],"__ob__"!==n&&(o=t[n],r=e[n],y(t,n)?o!==r&&l(o)&&l(r)&&Un(o,r):kt(t,n,r));return t}function Bn(t,e,n){return n?function(){const o=i(e)?e.call(n,n):e,r=i(t)?t.call(n,n):t;return o?Un(o,r):r}:e?t?function(){return Un(i(e)?e.call(this,this):e,i(t)?t.call(this,this):t)}:e:t}function Vn(t,n){const o=n?t?t.concat(n):e(n)?n:[n]:t;return o?function(t){const e=[];for(let n=0;n<t.length;n++)-1===e.indexOf(t[n])&&e.push(t[n]);return e}(o):o}function zn(t,e,n,o){const r=Object.create(t||null);return e?S(r,e):r}Fn.data=function(t,e,n){return n?Bn(t,e,n):e&&"function"!=typeof e?t:Bn(t,e)},R.forEach((t=>{Fn[t]=Vn})),M.forEach((function(t){Fn[t+"s"]=zn})),Fn.watch=function(t,n,o,r){if(t===J&&(t=void 0),n===J&&(n=void 0),!n)return Object.create(t||null);if(!t)return n;const s={};S(s,t);for(const t in n){let o=s[t];const r=n[t];o&&!e(o)&&(o=[o]),s[t]=o?o.concat(r):e(r)?r:[r]}return s},Fn.props=Fn.methods=Fn.inject=Fn.computed=function(t,e,n,o){if(!t)return e;const r=Object.create(null);return S(r,t),e&&S(r,e),r},Fn.provide=Bn;const Hn=function(t,e){return void 0===e?t:e};function Wn(t,n,o){if(i(n)&&(n=n.options),function(t,n){const o=t.props;if(!o)return;const r={};let s,i,c;if(e(o))for(s=o.length;s--;)i=o[s],"string"==typeof i&&(c=$(i),r[c]={type:null});else if(l(o))for(const t in o)i=o[t],c=$(t),r[c]=l(i)?i:{type:i};t.props=r}(n),function(t,n){const o=t.inject;if(!o)return;const r=t.inject={};if(e(o))for(let t=0;t<o.length;t++)r[o[t]]={from:o[t]};else if(l(o))for(const t in o){const e=o[t];r[t]=l(e)?S({from:t},e):{from:e}}}(n),function(t){const e=t.directives;if(e)for(const t in e){const n=e[t];i(n)&&(e[t]={bind:n,update:n})}}(n),!n._base&&(n.extends&&(t=Wn(t,n.extends,o)),n.mixins))for(let e=0,r=n.mixins.length;e<r;e++)t=Wn(t,n.mixins[e],o);const r={};let s;for(s in t)c(s);for(s in n)y(t,s)||c(s);function c(e){const s=Fn[e]||Hn;r[e]=s(t[e],n[e],o,e)}return r}function Kn(t,e,n,o){if("string"!=typeof n)return;const r=t[e];if(y(r,n))return r[n];const s=$(n);if(y(r,s))return r[s];const i=w(s);if(y(r,i))return r[i];return r[n]||r[s]||r[i]}function qn(t,e,n,o){const r=e[t],s=!y(n,t);let c=n[t];const a=Xn(Boolean,r.type);if(a>-1)if(s&&!y(r,"default"))c=!1;else if(""===c||c===x(t)){const t=Xn(String,r.type);(t<0||a<t)&&(c=!0)}if(void 0===c){c=function(t,e,n){if(!y(e,"default"))return;const o=e.default;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return i(o)&&"Function"!==Zn(e.type)?o.call(t):o}(o,r,t);const e=gt;bt(!0),Ct(c),bt(e)}return c}const Gn=/^\s*function (\w+)/;function Zn(t){const e=t&&t.toString().match(Gn);return e?e[1]:""}function Jn(t,e){return Zn(t)===Zn(e)}function Xn(t,n){if(!e(n))return Jn(n,t)?0:-1;for(let e=0,o=n.length;e<o;e++)if(Jn(n[e],t))return e;return-1}const Qn={enumerable:!0,configurable:!0,get:T,set:T};function Yn(t,e,n){Qn.get=function(){return this[e][n]},Qn.set=function(t){this[e][n]=t},Object.defineProperty(t,n,Qn)}function to(t){const n=t.$options;if(n.props&&function(t,e){const n=t.$options.propsData||{},o=t._props=At({}),r=t.$options._propKeys=[];t.$parent&&bt(!1);for(const s in e){r.push(s);xt(o,s,qn(s,e,n,t)),s in t||Yn(t,"_props",s)}bt(!0)}(t,n.props),function(t){const e=t.$options,n=e.setup;if(n){const o=t._setupContext=$e(t);st(t),pt();const r=Pe(n,null,[t._props||At({}),o],t,"setup");if(ht(),st(),i(r))e.render=r;else if(c(r))if(t._setupState=r,r.__sfc){const e=t._setupProxy={};for(const t in r)"__sfc"!==t&&Nt(e,r,t)}else for(const e in r)F(e)||Nt(t,r,e)}}(t),n.methods&&function(t,e){t.$options.props;for(const n in e)t[n]="function"!=typeof e[n]?T:k(e[n],t)}(t,n.methods),n.data)!function(t){let e=t.$options.data;e=t._data=i(e)?function(t,e){pt();try{return t.call(e,e)}catch(t){return Ee(t,e,"data()"),{}}finally{ht()}}(e,t):e||{},l(e)||(e={});const n=Object.keys(e),o=t.$options.props;t.$options.methods;let r=n.length;for(;r--;){const e=n[r];o&&y(o,e)||F(e)||Yn(t,"_data",e)}const s=Ct(e);s&&s.vmCount++}(t);else{const e=Ct(t._data={});e&&e.vmCount++}n.computed&&function(t,e){const n=t._computedWatchers=Object.create(null),o=Y();for(const r in e){const s=e[r],c=i(s)?s:s.get;o||(n[r]=new cn(t,c||T,T,eo)),r in t||no(t,r,s)}}(t,n.computed),n.watch&&n.watch!==J&&function(t,n){for(const o in n){const r=n[o];if(e(r))for(let e=0;e<r.length;e++)so(t,o,r[e]);else so(t,o,r)}}(t,n.watch)}const eo={lazy:!0};function no(t,e,n){const o=!Y();i(n)?(Qn.get=o?oo(e):ro(n),Qn.set=T):(Qn.get=n.get?o&&!1!==n.cache?oo(e):ro(n.get):T,Qn.set=n.set||T),Object.defineProperty(t,e,Qn)}function oo(t){return function(){const e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),ft.target&&e.depend(),e.value}}function ro(t){return function(){return t.call(this,this)}}function so(t,e,n,o){return l(n)&&(o=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,o)}let io=0;function co(t){let e=t.options;if(t.super){const n=co(t.super);if(n!==t.superOptions){t.superOptions=n;const o=function(t){let e;const n=t.options,o=t.sealedOptions;for(const t in n)n[t]!==o[t]&&(e||(e={}),e[t]=n[t]);return e}(t);o&&S(t.extendOptions,o),e=t.options=Wn(n,t.extendOptions),e.name&&(e.components[e.name]=t)}}return e}function ao(t){this._init(t)}function lo(t){t.cid=0;let e=1;t.extend=function(t){t=t||{};const n=this,o=n.cid,r=t._Ctor||(t._Ctor={});if(r[o])return r[o];const s=In(t)||In(n.options),i=function(t){this._init(t)};return(i.prototype=Object.create(n.prototype)).constructor=i,i.cid=e++,i.options=Wn(n.options,t),i.super=n,i.options.props&&function(t){const e=t.options.props;for(const n in e)Yn(t.prototype,"_props",n)}(i),i.options.computed&&function(t){const e=t.options.computed;for(const n in e)no(t.prototype,n,e[n])}(i),i.extend=n.extend,i.mixin=n.mixin,i.use=n.use,M.forEach((function(t){i[t]=n[t]})),s&&(i.options.components[s]=i),i.superOptions=n.options,i.extendOptions=t,i.sealedOptions=S({},i.options),r[o]=i,i}}function uo(t){return t&&(In(t.Ctor.options)||t.tag)}function fo(t,n){return e(t)?t.indexOf(n)>-1:"string"==typeof t?t.split(",").indexOf(n)>-1:(o=t,"[object RegExp]"===a.call(o)&&t.test(n));var o}function po(t,e){const{cache:n,keys:o,_vnode:r}=t;for(const t in n){const s=n[t];if(s){const i=s.name;i&&!e(i)&&ho(n,t,o,r)}}}function ho(t,e,n,o){const r=t[e];!r||o&&r.tag===o.tag||r.componentInstance.$destroy(),t[e]=null,_(n,e)}!function(e){e.prototype._init=function(e){const n=this;n._uid=io++,n._isVue=!0,n.__v_skip=!0,n._scope=new Ht(!0),n._scope._vm=!0,e&&e._isComponent?function(t,e){const n=t.$options=Object.create(t.constructor.options),o=e._parentVnode;n.parent=e.parent,n._parentVnode=o;const r=o.componentOptions;n.propsData=r.propsData,n._parentListeners=r.listeners,n._renderChildren=r.children,n._componentTag=r.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(n,e):n.$options=Wn(co(n.constructor),e||{},n),n._renderProxy=n,n._self=n,function(t){const e=t.$options;let n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._provided=n?n._provided:Object.create(null),t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(n),function(t){t._events=Object.create(null),t._hasHookEvent=!1;const e=t.$options._parentListeners;e&&fn(t,e)}(n),function(e){e._vnode=null,e._staticTrees=null;const n=e.$options,o=e.$vnode=n._parentVnode,r=o&&o.context;e.$slots=me(n._renderChildren,r),e.$scopedSlots=o?ye(e.$parent,o.data.scopedSlots,e.$slots):t,e._c=(t,n,o,r)=>Te(e,t,n,o,r,!1),e.$createElement=(t,n,o,r)=>Te(e,t,n,o,r,!0);const s=o&&o.data;xt(e,"$attrs",s&&s.attrs||t,null,!0),xt(e,"$listeners",n._parentListeners||t,null,!0)}(n),vn(n,"beforeCreate",void 0,!1),function(t){const e=Tn(t.$options.inject,t);e&&(bt(!1),Object.keys(e).forEach((n=>{xt(t,n,e[n])})),bt(!0))}(n),to(n),function(t){const e=t.$options.provide;if(e){const n=i(e)?e.call(t):e;if(!c(n))return;const o=Wt(t),r=nt?Reflect.ownKeys(n):Object.keys(n);for(let t=0;t<r.length;t++){const e=r[t];Object.defineProperty(o,e,Object.getOwnPropertyDescriptor(n,e))}}}(n),vn(n,"created"),n.$options.el&&n.$mount(n.$options.el)}}(ao),function(t){const e={get:function(){return this._data}},n={get:function(){return this._props}};Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=kt,t.prototype.$delete=Ot,t.prototype.$watch=function(t,e,n){const o=this;if(l(e))return so(o,t,e,n);(n=n||{}).user=!0;const r=new cn(o,t,e,n);if(n.immediate){const t=`callback for immediate watcher "${r.expression}"`;pt(),Pe(e,o,[r.value],o,t),ht()}return function(){r.teardown()}}}(ao),function(t){const n=/^hook:/;t.prototype.$on=function(t,o){const r=this;if(e(t))for(let e=0,n=t.length;e<n;e++)r.$on(t[e],o);else(r._events[t]||(r._events[t]=[])).push(o),n.test(t)&&(r._hasHookEvent=!0);return r},t.prototype.$once=function(t,e){const n=this;function o(){n.$off(t,o),e.apply(n,arguments)}return o.fn=e,n.$on(t,o),n},t.prototype.$off=function(t,n){const o=this;if(!arguments.length)return o._events=Object.create(null),o;if(e(t)){for(let e=0,r=t.length;e<r;e++)o.$off(t[e],n);return o}const r=o._events[t];if(!r)return o;if(!n)return o._events[t]=null,o;let s,i=r.length;for(;i--;)if(s=r[i],s===n||s.fn===n){r.splice(i,1);break}return o},t.prototype.$emit=function(t){const e=this;let n=e._events[t];if(n){n=n.length>1?O(n):n;const o=O(arguments,1),r=`event handler for "${t}"`;for(let t=0,s=n.length;t<s;t++)Pe(n[t],e,o,e,r)}return e}}(ao),function(t){t.prototype._update=function(t,e){const n=this,o=n.$el,r=n._vnode,s=pn(n);n._vnode=t,n.$el=r?n.__patch__(r,t):n.__patch__(n.$el,t,e,!1),s(),o&&(o.__vue__=null),n.$el&&(n.$el.__vue__=n);let i=n;for(;i&&i.$vnode&&i.$parent&&i.$vnode===i.$parent._vnode;)i.$parent.$el=i.$el,i=i.$parent},t.prototype.$forceUpdate=function(){const t=this;t._watcher&&t._watcher.update()},t.prototype.$destroy=function(){const t=this;if(t._isBeingDestroyed)return;vn(t,"beforeDestroy"),t._isBeingDestroyed=!0;const e=t.$parent;!e||e._isBeingDestroyed||t.$options.abstract||_(e.$children,t),t._scope.stop(),t._data.__ob__&&t._data.__ob__.vmCount--,t._isDestroyed=!0,t.__patch__(t._vnode,null),vn(t,"destroyed"),t.$off(),t.$el&&(t.$el.__vue__=null),t.$vnode&&(t.$vnode.parent=null)}}(ao),function(t){he(t.prototype),t.prototype.$nextTick=function(t){return Ue(t,this)},t.prototype._render=function(){const t=this,{render:n,_parentVnode:o}=t.$options;let r;o&&t._isMounted&&(t.$scopedSlots=ye(t.$parent,o.data.scopedSlots,t.$slots,t.$scopedSlots),t._slotsProxy&&xe(t._slotsProxy,t.$scopedSlots)),t.$vnode=o;try{st(t),Oe=t,r=n.call(t._renderProxy,t.$createElement)}catch(e){Ee(e,t,"render"),r=t._vnode}finally{Oe=null,st()}return e(r)&&1===r.length&&(r=r[0]),r instanceof it||(r=ct()),r.parent=o,r}}(ao);const mo=[String,RegExp,Array];var _o={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:mo,exclude:mo,max:[String,Number]},methods:{cacheVNode(){const{cache:t,keys:e,vnodeToCache:n,keyToCache:o}=this;if(n){const{tag:r,componentInstance:s,componentOptions:i}=n;t[o]={name:uo(i),tag:r,componentInstance:s},e.push(o),this.max&&e.length>parseInt(this.max)&&ho(t,e[0],e,this._vnode),this.vnodeToCache=null}}},created(){this.cache=Object.create(null),this.keys=[]},destroyed(){for(const t in this.cache)ho(this.cache,t,this.keys)},mounted(){this.cacheVNode(),this.$watch("include",(t=>{po(this,(e=>fo(t,e)))})),this.$watch("exclude",(t=>{po(this,(e=>!fo(t,e)))}))},updated(){this.cacheVNode()},render(){const t=this.$slots.default,e=Ae(t),n=e&&e.componentOptions;if(n){const t=uo(n),{include:o,exclude:r}=this;if(o&&(!t||!fo(o,t))||r&&t&&fo(r,t))return e;const{cache:s,keys:i}=this,c=null==e.key?n.Ctor.cid+(n.tag?`::${n.tag}`:""):e.key;s[c]?(e.componentInstance=s[c].componentInstance,_(i,c),i.push(c)):(this.vnodeToCache=e,this.keyToCache=c),e.data.keepAlive=!0}return e||t&&t[0]}}};!function(t){const e={get:()=>L};Object.defineProperty(t,"config",e),t.util={warn:Ln,extend:S,mergeOptions:Wn,defineReactive:xt},t.set=kt,t.delete=Ot,t.nextTick=Ue,t.observable=t=>(Ct(t),t),t.options=Object.create(null),M.forEach((e=>{t.options[e+"s"]=Object.create(null)})),t.options._base=t,S(t.options.components,_o),function(t){t.use=function(t){const e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;const n=O(arguments,1);return n.unshift(this),i(t.install)?t.install.apply(t,n):i(t)&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=Wn(this.options,t),this}}(t),lo(t),function(t){M.forEach((e=>{t[e]=function(t,n){return n?("component"===e&&l(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&i(n)&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}}))}(t)}(ao),Object.defineProperty(ao.prototype,"$isServer",{get:Y}),Object.defineProperty(ao.prototype,"$ssrContext",{get(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(ao,"FunctionalRenderContext",{value:jn}),ao.version="2.7.10";const vo=h("style,class"),yo=h("input,textarea,option,select,progress"),go=h("contenteditable,draggable,spellcheck"),bo=h("events,caret,typing,plaintext-only"),$o=h("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible"),wo="http://www.w3.org/1999/xlink",Co=t=>":"===t.charAt(5)&&"xlink"===t.slice(0,5),xo=t=>Co(t)?t.slice(6,t.length):"",ko=t=>null==t||!1===t;function Oo(t){let e=t.data,n=t,r=t;for(;o(r.componentInstance);)r=r.componentInstance._vnode,r&&r.data&&(e=So(r.data,e));for(;o(n=n.parent);)n&&n.data&&(e=So(e,n.data));return function(t,e){if(o(t)||o(e))return Ao(t,To(e));return""}(e.staticClass,e.class)}function So(t,e){return{staticClass:Ao(t.staticClass,e.staticClass),class:o(t.class)?[t.class,e.class]:e.class}}function Ao(t,e){return t?e?t+" "+e:t:e||""}function To(t){return Array.isArray(t)?function(t){let e,n="";for(let r=0,s=t.length;r<s;r++)o(e=To(t[r]))&&""!==e&&(n&&(n+=" "),n+=e);return n}(t):c(t)?function(t){let e="";for(const n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}const jo={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},Eo=h("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Po=h("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Io=t=>Eo(t)||Po(t);const Do=Object.create(null);const No=h("text,number,password,search,email,tel,url");var Mo=Object.freeze({__proto__:null,createElement:function(t,e){const n=document.createElement(t);return"select"!==t||e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n},createElementNS:function(t,e){return document.createElementNS(jo[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setStyleScope:function(t,e){t.setAttribute(e,"")}}),Ro={create(t,e){Lo(e)},update(t,e){t.data.ref!==e.data.ref&&(Lo(t,!0),Lo(e))},destroy(t){Lo(t,!0)}};function Lo(t,n){const r=t.data.ref;if(!o(r))return;const s=t.context,c=t.componentInstance||t.elm,a=n?null:c,l=n?void 0:c;if(i(r))return void Pe(r,s,[a],s,"template ref function");const u=t.data.refInFor,f="string"==typeof r||"number"==typeof r,d=It(r),p=s.$refs;if(f||d)if(u){const t=f?p[r]:r.value;n?e(t)&&_(t,c):e(t)?t.includes(c)||t.push(c):f?(p[r]=[c],Fo(s,r,p[r])):r.value=[c]}else if(f){if(n&&p[r]!==c)return;p[r]=l,Fo(s,r,a)}else if(d){if(n&&r.value!==c)return;r.value=a}}function Fo({_setupState:t},e,n){t&&y(t,e)&&(It(t[e])?t[e].value=n:t[e]=n)}const Uo=new it("",{},[]),Bo=["create","activate","update","remove","destroy"];function Vo(t,e){return t.key===e.key&&t.asyncFactory===e.asyncFactory&&(t.tag===e.tag&&t.isComment===e.isComment&&o(t.data)===o(e.data)&&function(t,e){if("input"!==t.tag)return!0;let n;const r=o(n=t.data)&&o(n=n.attrs)&&n.type,s=o(n=e.data)&&o(n=n.attrs)&&n.type;return r===s||No(r)&&No(s)}(t,e)||r(t.isAsyncPlaceholder)&&n(e.asyncFactory.error))}function zo(t,e,n){let r,s;const i={};for(r=e;r<=n;++r)s=t[r].key,o(s)&&(i[s]=r);return i}var Ho={create:Wo,update:Wo,destroy:function(t){Wo(t,Uo)}};function Wo(t,e){(t.data.directives||e.data.directives)&&function(t,e){const n=t===Uo,o=e===Uo,r=qo(t.data.directives,t.context),s=qo(e.data.directives,e.context),i=[],c=[];let a,l,u;for(a in s)l=r[a],u=s[a],l?(u.oldValue=l.value,u.oldArg=l.arg,Zo(u,"update",e,t),u.def&&u.def.componentUpdated&&c.push(u)):(Zo(u,"bind",e,t),u.def&&u.def.inserted&&i.push(u));if(i.length){const o=()=>{for(let n=0;n<i.length;n++)Zo(i[n],"inserted",e,t)};n?Zt(e,"insert",o):o()}c.length&&Zt(e,"postpatch",(()=>{for(let n=0;n<c.length;n++)Zo(c[n],"componentUpdated",e,t)}));if(!n)for(a in r)s[a]||Zo(r[a],"unbind",t,t,o)}(t,e)}const Ko=Object.create(null);function qo(t,e){const n=Object.create(null);if(!t)return n;let o,r;for(o=0;o<t.length;o++){if(r=t[o],r.modifiers||(r.modifiers=Ko),n[Go(r)]=r,e._setupState&&e._setupState.__sfc){const t=r.def||Kn(e,"_setupState","v-"+r.name);r.def="function"==typeof t?{bind:t,update:t}:t}r.def=r.def||Kn(e.$options,"directives",r.name)}return n}function Go(t){return t.rawName||`${t.name}.${Object.keys(t.modifiers||{}).join(".")}`}function Zo(t,e,n,o,r){const s=t.def&&t.def[e];if(s)try{s(n.elm,t,n,o,r)}catch(o){Ee(o,n.context,`directive ${t.name} ${e} hook`)}}var Jo=[Ro,Ho];function Xo(t,e){const s=e.componentOptions;if(o(s)&&!1===s.Ctor.options.inheritAttrs)return;if(n(t.data.attrs)&&n(e.data.attrs))return;let i,c,a;const l=e.elm,u=t.data.attrs||{};let f=e.data.attrs||{};for(i in(o(f.__ob__)||r(f._v_attr_proxy))&&(f=e.data.attrs=S({},f)),f)c=f[i],a=u[i],a!==c&&Qo(l,i,c,e.data.pre);for(i in(W||q)&&f.value!==u.value&&Qo(l,"value",f.value),u)n(f[i])&&(Co(i)?l.removeAttributeNS(wo,xo(i)):go(i)||l.removeAttribute(i))}function Qo(t,e,n,o){o||t.tagName.indexOf("-")>-1?Yo(t,e,n):$o(e)?ko(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n)):go(e)?t.setAttribute(e,((t,e)=>ko(e)||"false"===e?"false":"contenteditable"===t&&bo(e)?e:"true")(e,n)):Co(e)?ko(n)?t.removeAttributeNS(wo,xo(e)):t.setAttributeNS(wo,e,n):Yo(t,e,n)}function Yo(t,e,n){if(ko(n))t.removeAttribute(e);else{if(W&&!K&&"TEXTAREA"===t.tagName&&"placeholder"===e&&""!==n&&!t.__ieph){const e=n=>{n.stopImmediatePropagation(),t.removeEventListener("input",e)};t.addEventListener("input",e),t.__ieph=!0}t.setAttribute(e,n)}}var tr={create:Xo,update:Xo};function er(t,e){const r=e.elm,s=e.data,i=t.data;if(n(s.staticClass)&&n(s.class)&&(n(i)||n(i.staticClass)&&n(i.class)))return;let c=Oo(e);const a=r._transitionClasses;o(a)&&(c=Ao(c,To(a))),c!==r._prevClass&&(r.setAttribute("class",c),r._prevClass=c)}var nr={create:er,update:er};let or;function rr(t,e,n){const o=or;return function r(){const s=e.apply(null,arguments);null!==s&&cr(t,r,n,o)}}const sr=Ne&&!(Z&&Number(Z[1])<=53);function ir(t,e,n,o){if(sr){const t=xn,n=e;e=n._wrapper=function(e){if(e.target===e.currentTarget||e.timeStamp>=t||e.timeStamp<=0||e.target.ownerDocument!==document)return n.apply(this,arguments)}}or.addEventListener(t,e,Q?{capture:n,passive:o}:n)}function cr(t,e,n,o){(o||or).removeEventListener(t,e._wrapper||e,n)}function ar(t,e){if(n(t.data.on)&&n(e.data.on))return;const r=e.data.on||{},s=t.data.on||{};or=e.elm||t.elm,function(t){if(o(t.__r)){const e=W?"change":"input";t[e]=[].concat(t.__r,t[e]||[]),delete t.__r}o(t.__c)&&(t.change=[].concat(t.__c,t.change||[]),delete t.__c)}(r),Gt(r,s,ir,cr,rr,e.context),or=void 0}var lr={create:ar,update:ar,destroy:t=>ar(t,Uo)};let ur;function fr(t,e){if(n(t.data.domProps)&&n(e.data.domProps))return;let s,i;const c=e.elm,a=t.data.domProps||{};let l=e.data.domProps||{};for(s in(o(l.__ob__)||r(l._v_attr_proxy))&&(l=e.data.domProps=S({},l)),a)s in l||(c[s]="");for(s in l){if(i=l[s],"textContent"===s||"innerHTML"===s){if(e.children&&(e.children.length=0),i===a[s])continue;1===c.childNodes.length&&c.removeChild(c.childNodes[0])}if("value"===s&&"PROGRESS"!==c.tagName){c._value=i;const t=n(i)?"":String(i);dr(c,t)&&(c.value=t)}else if("innerHTML"===s&&Po(c.tagName)&&n(c.innerHTML)){ur=ur||document.createElement("div"),ur.innerHTML=`<svg>${i}</svg>`;const t=ur.firstChild;for(;c.firstChild;)c.removeChild(c.firstChild);for(;t.firstChild;)c.appendChild(t.firstChild)}else if(i!==a[s])try{c[s]=i}catch(t){}}}function dr(t,e){return!t.composing&&("OPTION"===t.tagName||function(t,e){let n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,e)||function(t,e){const n=t.value,r=t._vModifiers;if(o(r)){if(r.number)return p(n)!==p(e);if(r.trim)return n.trim()!==e.trim()}return n!==e}(t,e))}var pr={create:fr,update:fr};const hr=g((function(t){const e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach((function(t){if(t){const o=t.split(n);o.length>1&&(e[o[0].trim()]=o[1].trim())}})),e}));function mr(t){const e=_r(t.style);return t.staticStyle?S(t.staticStyle,e):e}function _r(t){return Array.isArray(t)?A(t):"string"==typeof t?hr(t):t}const vr=/^--/,yr=/\s*!important$/,gr=(t,e,n)=>{if(vr.test(e))t.style.setProperty(e,n);else if(yr.test(n))t.style.setProperty(x(e),n.replace(yr,""),"important");else{const o=wr(e);if(Array.isArray(n))for(let e=0,r=n.length;e<r;e++)t.style[o]=n[e];else t.style[o]=n}},br=["Webkit","Moz","ms"];let $r;const wr=g((function(t){if($r=$r||document.createElement("div").style,"filter"!==(t=$(t))&&t in $r)return t;const e=t.charAt(0).toUpperCase()+t.slice(1);for(let t=0;t<br.length;t++){const n=br[t]+e;if(n in $r)return n}}));function Cr(t,e){const r=e.data,s=t.data;if(n(r.staticStyle)&&n(r.style)&&n(s.staticStyle)&&n(s.style))return;let i,c;const a=e.elm,l=s.staticStyle,u=s.normalizedStyle||s.style||{},f=l||u,d=_r(e.data.style)||{};e.data.normalizedStyle=o(d.__ob__)?S({},d):d;const p=function(t,e){const n={};let o;if(e){let e=t;for(;e.componentInstance;)e=e.componentInstance._vnode,e&&e.data&&(o=mr(e.data))&&S(n,o)}(o=mr(t.data))&&S(n,o);let r=t;for(;r=r.parent;)r.data&&(o=mr(r.data))&&S(n,o);return n}(e,!0);for(c in f)n(p[c])&&gr(a,c,"");for(c in p)i=p[c],i!==f[c]&&gr(a,c,null==i?"":i)}var xr={create:Cr,update:Cr};const kr=/\s+/;function Or(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(kr).forEach((e=>t.classList.add(e))):t.classList.add(e);else{const n=` ${t.getAttribute("class")||""} `;n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function Sr(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(kr).forEach((e=>t.classList.remove(e))):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{let n=` ${t.getAttribute("class")||""} `;const o=" "+e+" ";for(;n.indexOf(o)>=0;)n=n.replace(o," ");n=n.trim(),n?t.setAttribute("class",n):t.removeAttribute("class")}}function Ar(t){if(t){if("object"==typeof t){const e={};return!1!==t.css&&S(e,Tr(t.name||"v")),S(e,t),e}return"string"==typeof t?Tr(t):void 0}}const Tr=g((t=>({enterClass:`${t}-enter`,enterToClass:`${t}-enter-to`,enterActiveClass:`${t}-enter-active`,leaveClass:`${t}-leave`,leaveToClass:`${t}-leave-to`,leaveActiveClass:`${t}-leave-active`}))),jr=z&&!K;let Er="transition",Pr="transitionend",Ir="animation",Dr="animationend";jr&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Er="WebkitTransition",Pr="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Ir="WebkitAnimation",Dr="webkitAnimationEnd"));const Nr=z?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:t=>t();function Mr(t){Nr((()=>{Nr(t)}))}function Rr(t,e){const n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),Or(t,e))}function Lr(t,e){t._transitionClasses&&_(t._transitionClasses,e),Sr(t,e)}function Fr(t,e,n){const{type:o,timeout:r,propCount:s}=Br(t,e);if(!o)return n();const i="transition"===o?Pr:Dr;let c=0;const a=()=>{t.removeEventListener(i,l),n()},l=e=>{e.target===t&&++c>=s&&a()};setTimeout((()=>{c<s&&a()}),r+1),t.addEventListener(i,l)}const Ur=/\b(transform|all)(,|$)/;function Br(t,e){const n=window.getComputedStyle(t),o=(n[Er+"Delay"]||"").split(", "),r=(n[Er+"Duration"]||"").split(", "),s=Vr(o,r),i=(n[Ir+"Delay"]||"").split(", "),c=(n[Ir+"Duration"]||"").split(", "),a=Vr(i,c);let l,u=0,f=0;"transition"===e?s>0&&(l="transition",u=s,f=r.length):"animation"===e?a>0&&(l="animation",u=a,f=c.length):(u=Math.max(s,a),l=u>0?s>a?"transition":"animation":null,f=l?"transition"===l?r.length:c.length:0);return{type:l,timeout:u,propCount:f,hasTransform:"transition"===l&&Ur.test(n[Er+"Property"])}}function Vr(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map(((e,n)=>zr(e)+zr(t[n]))))}function zr(t){return 1e3*Number(t.slice(0,-1).replace(",","."))}function Hr(t,e){const r=t.elm;o(r._leaveCb)&&(r._leaveCb.cancelled=!0,r._leaveCb());const s=Ar(t.data.transition);if(n(s))return;if(o(r._enterCb)||1!==r.nodeType)return;const{css:a,type:l,enterClass:u,enterToClass:f,enterActiveClass:d,appearClass:h,appearToClass:m,appearActiveClass:_,beforeEnter:v,enter:y,afterEnter:g,enterCancelled:b,beforeAppear:$,appear:w,afterAppear:C,appearCancelled:x,duration:k}=s;let O=dn,S=dn.$vnode;for(;S&&S.parent;)O=S.context,S=S.parent;const A=!O._isMounted||!t.isRootInsert;if(A&&!w&&""!==w)return;const T=A&&h?h:u,j=A&&_?_:d,E=A&&m?m:f,P=A&&$||v,I=A&&i(w)?w:y,N=A&&C||g,M=A&&x||b,R=p(c(k)?k.enter:k),L=!1!==a&&!K,F=qr(I),U=r._enterCb=D((()=>{L&&(Lr(r,E),Lr(r,j)),U.cancelled?(L&&Lr(r,T),M&&M(r)):N&&N(r),r._enterCb=null}));t.data.show||Zt(t,"insert",(()=>{const e=r.parentNode,n=e&&e._pending&&e._pending[t.key];n&&n.tag===t.tag&&n.elm._leaveCb&&n.elm._leaveCb(),I&&I(r,U)})),P&&P(r),L&&(Rr(r,T),Rr(r,j),Mr((()=>{Lr(r,T),U.cancelled||(Rr(r,E),F||(Kr(R)?setTimeout(U,R):Fr(r,l,U)))}))),t.data.show&&(e&&e(),I&&I(r,U)),L||F||U()}function Wr(t,e){const r=t.elm;o(r._enterCb)&&(r._enterCb.cancelled=!0,r._enterCb());const s=Ar(t.data.transition);if(n(s)||1!==r.nodeType)return e();if(o(r._leaveCb))return;const{css:i,type:a,leaveClass:l,leaveToClass:u,leaveActiveClass:f,beforeLeave:d,leave:h,afterLeave:m,leaveCancelled:_,delayLeave:v,duration:y}=s,g=!1!==i&&!K,b=qr(h),$=p(c(y)?y.leave:y),w=r._leaveCb=D((()=>{r.parentNode&&r.parentNode._pending&&(r.parentNode._pending[t.key]=null),g&&(Lr(r,u),Lr(r,f)),w.cancelled?(g&&Lr(r,l),_&&_(r)):(e(),m&&m(r)),r._leaveCb=null}));function C(){w.cancelled||(!t.data.show&&r.parentNode&&((r.parentNode._pending||(r.parentNode._pending={}))[t.key]=t),d&&d(r),g&&(Rr(r,l),Rr(r,f),Mr((()=>{Lr(r,l),w.cancelled||(Rr(r,u),b||(Kr($)?setTimeout(w,$):Fr(r,a,w)))}))),h&&h(r,w),g||b||w())}v?v(C):C()}function Kr(t){return"number"==typeof t&&!isNaN(t)}function qr(t){if(n(t))return!1;const e=t.fns;return o(e)?qr(Array.isArray(e)?e[0]:e):(t._length||t.length)>1}function Gr(t,e){!0!==e.data.show&&Hr(e)}const Zr=function(t){let i,c;const a={},{modules:l,nodeOps:u}=t;for(i=0;i<Bo.length;++i)for(a[Bo[i]]=[],c=0;c<l.length;++c)o(l[c][Bo[i]])&&a[Bo[i]].push(l[c][Bo[i]]);function f(t){const e=u.parentNode(t);o(e)&&u.removeChild(e,t)}function d(t,e,n,s,i,c,l){if(o(t.elm)&&o(c)&&(t=c[l]=lt(t)),t.isRootInsert=!i,function(t,e,n,s){let i=t.data;if(o(i)){const c=o(t.componentInstance)&&i.keepAlive;if(o(i=i.hook)&&o(i=i.init)&&i(t,!1),o(t.componentInstance))return p(t,e),m(n,t.elm,s),r(c)&&function(t,e,n,r){let s,i=t;for(;i.componentInstance;)if(i=i.componentInstance._vnode,o(s=i.data)&&o(s=s.transition)){for(s=0;s<a.activate.length;++s)a.activate[s](Uo,i);e.push(i);break}m(n,t.elm,r)}(t,e,n,s),!0}}(t,e,n,s))return;const f=t.data,d=t.children,h=t.tag;o(h)?(t.elm=t.ns?u.createElementNS(t.ns,h):u.createElement(h,t),g(t),_(t,d,e),o(f)&&y(t,e),m(n,t.elm,s)):r(t.isComment)?(t.elm=u.createComment(t.text),m(n,t.elm,s)):(t.elm=u.createTextNode(t.text),m(n,t.elm,s))}function p(t,e){o(t.data.pendingInsert)&&(e.push.apply(e,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,v(t)?(y(t,e),g(t)):(Lo(t),e.push(t))}function m(t,e,n){o(t)&&(o(n)?u.parentNode(n)===t&&u.insertBefore(t,e,n):u.appendChild(t,e))}function _(t,n,o){if(e(n))for(let e=0;e<n.length;++e)d(n[e],o,t.elm,null,!0,n,e);else s(t.text)&&u.appendChild(t.elm,u.createTextNode(String(t.text)))}function v(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return o(t.tag)}function y(t,e){for(let e=0;e<a.create.length;++e)a.create[e](Uo,t);i=t.data.hook,o(i)&&(o(i.create)&&i.create(Uo,t),o(i.insert)&&e.push(t))}function g(t){let e;if(o(e=t.fnScopeId))u.setStyleScope(t.elm,e);else{let n=t;for(;n;)o(e=n.context)&&o(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e),n=n.parent}o(e=dn)&&e!==t.context&&e!==t.fnContext&&o(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e)}function b(t,e,n,o,r,s){for(;o<=r;++o)d(n[o],s,t,e,!1,n,o)}function $(t){let e,n;const r=t.data;if(o(r))for(o(e=r.hook)&&o(e=e.destroy)&&e(t),e=0;e<a.destroy.length;++e)a.destroy[e](t);if(o(e=t.children))for(n=0;n<t.children.length;++n)$(t.children[n])}function w(t,e,n){for(;e<=n;++e){const n=t[e];o(n)&&(o(n.tag)?(C(n),$(n)):f(n.elm))}}function C(t,e){if(o(e)||o(t.data)){let n;const r=a.remove.length+1;for(o(e)?e.listeners+=r:e=function(t,e){function n(){0==--n.listeners&&f(t)}return n.listeners=e,n}(t.elm,r),o(n=t.componentInstance)&&o(n=n._vnode)&&o(n.data)&&C(n,e),n=0;n<a.remove.length;++n)a.remove[n](t,e);o(n=t.data.hook)&&o(n=n.remove)?n(t,e):e()}else f(t.elm)}function x(t,e,n,r){for(let s=n;s<r;s++){const n=e[s];if(o(n)&&Vo(t,n))return s}}function k(t,e,s,i,c,l){if(t===e)return;o(e.elm)&&o(i)&&(e=i[c]=lt(e));const f=e.elm=t.elm;if(r(t.isAsyncPlaceholder))return void(o(e.asyncFactory.resolved)?A(t.elm,e,s):e.isAsyncPlaceholder=!0);if(r(e.isStatic)&&r(t.isStatic)&&e.key===t.key&&(r(e.isCloned)||r(e.isOnce)))return void(e.componentInstance=t.componentInstance);let p;const h=e.data;o(h)&&o(p=h.hook)&&o(p=p.prepatch)&&p(t,e);const m=t.children,_=e.children;if(o(h)&&v(e)){for(p=0;p<a.update.length;++p)a.update[p](t,e);o(p=h.hook)&&o(p=p.update)&&p(t,e)}n(e.text)?o(m)&&o(_)?m!==_&&function(t,e,r,s,i){let c,a,l,f,p=0,h=0,m=e.length-1,_=e[0],v=e[m],y=r.length-1,g=r[0],$=r[y];const C=!i;for(;p<=m&&h<=y;)n(_)?_=e[++p]:n(v)?v=e[--m]:Vo(_,g)?(k(_,g,s,r,h),_=e[++p],g=r[++h]):Vo(v,$)?(k(v,$,s,r,y),v=e[--m],$=r[--y]):Vo(_,$)?(k(_,$,s,r,y),C&&u.insertBefore(t,_.elm,u.nextSibling(v.elm)),_=e[++p],$=r[--y]):Vo(v,g)?(k(v,g,s,r,h),C&&u.insertBefore(t,v.elm,_.elm),v=e[--m],g=r[++h]):(n(c)&&(c=zo(e,p,m)),a=o(g.key)?c[g.key]:x(g,e,p,m),n(a)?d(g,s,t,_.elm,!1,r,h):(l=e[a],Vo(l,g)?(k(l,g,s,r,h),e[a]=void 0,C&&u.insertBefore(t,l.elm,_.elm)):d(g,s,t,_.elm,!1,r,h)),g=r[++h]);p>m?(f=n(r[y+1])?null:r[y+1].elm,b(t,f,r,h,y,s)):h>y&&w(e,p,m)}(f,m,_,s,l):o(_)?(o(t.text)&&u.setTextContent(f,""),b(f,null,_,0,_.length-1,s)):o(m)?w(m,0,m.length-1):o(t.text)&&u.setTextContent(f,""):t.text!==e.text&&u.setTextContent(f,e.text),o(h)&&o(p=h.hook)&&o(p=p.postpatch)&&p(t,e)}function O(t,e,n){if(r(n)&&o(t.parent))t.parent.data.pendingInsert=e;else for(let t=0;t<e.length;++t)e[t].data.hook.insert(e[t])}const S=h("attrs,class,staticClass,staticStyle,key");function A(t,e,n,s){let i;const{tag:c,data:a,children:l}=e;if(s=s||a&&a.pre,e.elm=t,r(e.isComment)&&o(e.asyncFactory))return e.isAsyncPlaceholder=!0,!0;if(o(a)&&(o(i=a.hook)&&o(i=i.init)&&i(e,!0),o(i=e.componentInstance)))return p(e,n),!0;if(o(c)){if(o(l))if(t.hasChildNodes())if(o(i=a)&&o(i=i.domProps)&&o(i=i.innerHTML)){if(i!==t.innerHTML)return!1}else{let e=!0,o=t.firstChild;for(let t=0;t<l.length;t++){if(!o||!A(o,l[t],n,s)){e=!1;break}o=o.nextSibling}if(!e||o)return!1}else _(e,l,n);if(o(a)){let t=!1;for(const o in a)if(!S(o)){t=!0,y(e,n);break}!t&&a.class&&nn(a.class)}}else t.data!==e.text&&(t.data=e.text);return!0}return function(t,e,s,i){if(n(e))return void(o(t)&&$(t));let c=!1;const l=[];if(n(t))c=!0,d(e,l);else{const n=o(t.nodeType);if(!n&&Vo(t,e))k(t,e,l,null,null,i);else{if(n){if(1===t.nodeType&&t.hasAttribute("data-server-rendered")&&(t.removeAttribute("data-server-rendered"),s=!0),r(s)&&A(t,e,l))return O(e,l,!0),t;f=t,t=new it(u.tagName(f).toLowerCase(),{},[],void 0,f)}const i=t.elm,c=u.parentNode(i);if(d(e,l,i._leaveCb?null:c,u.nextSibling(i)),o(e.parent)){let t=e.parent;const n=v(e);for(;t;){for(let e=0;e<a.destroy.length;++e)a.destroy[e](t);if(t.elm=e.elm,n){for(let e=0;e<a.create.length;++e)a.create[e](Uo,t);const e=t.data.hook.insert;if(e.merged)for(let t=1;t<e.fns.length;t++)e.fns[t]()}else Lo(t);t=t.parent}}o(c)?w([t],0,0):o(t.tag)&&$(t)}}var f;return O(e,l,c),e.elm}}({nodeOps:Mo,modules:[tr,nr,lr,pr,xr,z?{create:Gr,activate:Gr,remove(t,e){!0!==t.data.show?Wr(t,e):e()}}:{}].concat(Jo)});K&&document.addEventListener("selectionchange",(()=>{const t=document.activeElement;t&&t.vmodel&&os(t,"input")}));const Jr={inserted(t,e,n,o){"select"===n.tag?(o.elm&&!o.elm._vOptions?Zt(n,"postpatch",(()=>{Jr.componentUpdated(t,e,n)})):Xr(t,e,n.context),t._vOptions=[].map.call(t.options,ts)):("textarea"===n.tag||No(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("compositionstart",es),t.addEventListener("compositionend",ns),t.addEventListener("change",ns),K&&(t.vmodel=!0)))},componentUpdated(t,e,n){if("select"===n.tag){Xr(t,e,n.context);const o=t._vOptions,r=t._vOptions=[].map.call(t.options,ts);if(r.some(((t,e)=>!P(t,o[e])))){(t.multiple?e.value.some((t=>Yr(t,r))):e.value!==e.oldValue&&Yr(e.value,r))&&os(t,"change")}}}};function Xr(t,e,n){Qr(t,e),(W||q)&&setTimeout((()=>{Qr(t,e)}),0)}function Qr(t,e,n){const o=e.value,r=t.multiple;if(r&&!Array.isArray(o))return;let s,i;for(let e=0,n=t.options.length;e<n;e++)if(i=t.options[e],r)s=I(o,ts(i))>-1,i.selected!==s&&(i.selected=s);else if(P(ts(i),o))return void(t.selectedIndex!==e&&(t.selectedIndex=e));r||(t.selectedIndex=-1)}function Yr(t,e){return e.every((e=>!P(e,t)))}function ts(t){return"_value"in t?t._value:t.value}function es(t){t.target.composing=!0}function ns(t){t.target.composing&&(t.target.composing=!1,os(t.target,"input"))}function os(t,e){const n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function rs(t){return!t.componentInstance||t.data&&t.data.transition?t:rs(t.componentInstance._vnode)}var ss={bind(t,{value:e},n){const o=(n=rs(n)).data&&n.data.transition,r=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;e&&o?(n.data.show=!0,Hr(n,(()=>{t.style.display=r}))):t.style.display=e?r:"none"},update(t,{value:e,oldValue:n},o){if(!e==!n)return;(o=rs(o)).data&&o.data.transition?(o.data.show=!0,e?Hr(o,(()=>{t.style.display=t.__vOriginalDisplay})):Wr(o,(()=>{t.style.display="none"}))):t.style.display=e?t.__vOriginalDisplay:"none"},unbind(t,e,n,o,r){r||(t.style.display=t.__vOriginalDisplay)}},is={model:Jr,show:ss};const cs={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function as(t){const e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?as(Ae(e.children)):t}function ls(t){const e={},n=t.$options;for(const o in n.propsData)e[o]=t[o];const o=n._parentListeners;for(const t in o)e[$(t)]=o[t];return e}function us(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}const fs=t=>t.tag||ve(t),ds=t=>"show"===t.name;var ps={name:"transition",props:cs,abstract:!0,render(t){let e=this.$slots.default;if(!e)return;if(e=e.filter(fs),!e.length)return;const n=this.mode,o=e[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return o;const r=as(o);if(!r)return o;if(this._leaving)return us(t,o);const i=`__transition-${this._uid}-`;r.key=null==r.key?r.isComment?i+"comment":i+r.tag:s(r.key)?0===String(r.key).indexOf(i)?r.key:i+r.key:r.key;const c=(r.data||(r.data={})).transition=ls(this),a=this._vnode,l=as(a);if(r.data.directives&&r.data.directives.some(ds)&&(r.data.show=!0),l&&l.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(r,l)&&!ve(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){const e=l.data.transition=S({},c);if("out-in"===n)return this._leaving=!0,Zt(e,"afterLeave",(()=>{this._leaving=!1,this.$forceUpdate()})),us(t,o);if("in-out"===n){if(ve(r))return a;let t;const n=()=>{t()};Zt(c,"afterEnter",n),Zt(c,"enterCancelled",n),Zt(e,"delayLeave",(e=>{t=e}))}}return o}};const hs=S({tag:String,moveClass:String},cs);delete hs.mode;var ms={props:hs,beforeMount(){const t=this._update;this._update=(e,n)=>{const o=pn(this);this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept,o(),t.call(this,e,n)}},render(t){const e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),o=this.prevChildren=this.children,r=this.$slots.default||[],s=this.children=[],i=ls(this);for(let t=0;t<r.length;t++){const e=r[t];e.tag&&null!=e.key&&0!==String(e.key).indexOf("__vlist")&&(s.push(e),n[e.key]=e,(e.data||(e.data={})).transition=i)}if(o){const r=[],s=[];for(let t=0;t<o.length;t++){const e=o[t];e.data.transition=i,e.data.pos=e.elm.getBoundingClientRect(),n[e.key]?r.push(e):s.push(e)}this.kept=t(e,null,r),this.removed=s}return t(e,null,s)},updated(){const t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(_s),t.forEach(vs),t.forEach(ys),this._reflow=document.body.offsetHeight,t.forEach((t=>{if(t.data.moved){const n=t.elm,o=n.style;Rr(n,e),o.transform=o.WebkitTransform=o.transitionDuration="",n.addEventListener(Pr,n._moveCb=function t(o){o&&o.target!==n||o&&!/transform$/.test(o.propertyName)||(n.removeEventListener(Pr,t),n._moveCb=null,Lr(n,e))})}})))},methods:{hasMove(t,e){if(!jr)return!1;if(this._hasMove)return this._hasMove;const n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach((t=>{Sr(n,t)})),Or(n,e),n.style.display="none",this.$el.appendChild(n);const o=Br(n);return this.$el.removeChild(n),this._hasMove=o.hasTransform}}};function _s(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function vs(t){t.data.newPos=t.elm.getBoundingClientRect()}function ys(t){const e=t.data.pos,n=t.data.newPos,o=e.left-n.left,r=e.top-n.top;if(o||r){t.data.moved=!0;const e=t.elm.style;e.transform=e.WebkitTransform=`translate(${o}px,${r}px)`,e.transitionDuration="0s"}}var gs={Transition:ps,TransitionGroup:ms};ao.config.mustUseProp=(t,e,n)=>"value"===n&&yo(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t,ao.config.isReservedTag=Io,ao.config.isReservedAttr=vo,ao.config.getTagNamespace=function(t){return Po(t)?"svg":"math"===t?"math":void 0},ao.config.isUnknownElement=function(t){if(!z)return!0;if(Io(t))return!1;if(t=t.toLowerCase(),null!=Do[t])return Do[t];const e=document.createElement(t);return t.indexOf("-")>-1?Do[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Do[t]=/HTMLUnknownElement/.test(e.toString())},S(ao.options.directives,is),S(ao.options.components,gs),ao.prototype.__patch__=z?Zr:T,ao.prototype.$mount=function(t,e){return function(t,e,n){let o;t.$el=e,t.$options.render||(t.$options.render=ct),vn(t,"beforeMount"),o=()=>{t._update(t._render(),n)},new cn(t,o,T,{before(){t._isMounted&&!t._isDestroyed&&vn(t,"beforeUpdate")}},!0),n=!1;const r=t._preWatchers;if(r)for(let t=0;t<r.length;t++)r[t].run();return null==t.$vnode&&(t._isMounted=!0,vn(t,"mounted")),t}(this,t=t&&z?function(t){if("string"==typeof t){return document.querySelector(t)||document.createElement("div")}return t}(t):void 0,e)},z&&setTimeout((()=>{L.devtools&&tt&&tt.emit("init",ao)}),0),S(ao,tn),module.exports=ao;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)

},{"timers":5}],11:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            loading: false,
            failed: false,
            hasChanged: false,
            tags: [],
            rules: [],
            backup: null
        };
    },


    computed: {
        filteredTags: function filteredTags() {
            var _this = this;

            return _.filter(this.tags, function (tag) {
                return !_this.tagHasRules(tag.id);
            });
        }
    },

    mounted: function mounted() {
        var _this2 = this;

        this.fetchTags();
        this.fetchRules();

        $('#files_classifier_select_tags').select2({
            placeholder: this.$gettext('Add a tag'),
            formatNoMatches: this.$gettext('No tags found'),
            initSelection: function initSelection(el, callback) {
                callback();
            },

            query: function query(_query) {
                var results = _.filter(_this2.filteredTags, function (tag) {
                    return tag.text.toUpperCase().indexOf(_query.term.toUpperCase()) >= 0;
                });
                _query.callback({ results: results });
            }
        }).on('change', function (e) {
            _this2.addRule(e.added.id);
            $(e.target).select2('val', '');
        });
    },


    watch: {
        rules: {
            deep: true,
            handler: function handler() {
                if (!this.backup) {
                    return;
                }

                this.hasChanged = (0, _stringify2.default)(this.rules) !== this.backup;
            }
        }
    },

    methods: {
        _setLoading: function _setLoading() {
            this.loading = true;
            this.failed = false;
        },
        _setFailed: function _setFailed() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.loading = false;
            this.failed = message ? message : true;
        },
        _setDone: function _setDone() {
            this.loading = false;
            this.failed = false;
        },
        _backupRules: function _backupRules() {
            this.backup = (0, _stringify2.default)(this.rules);
        },
        _restoreRules: function _restoreRules() {
            this.rules = JSON.parse(this.backup);
        },
        addRule: function addRule(tagId) {
            var newRule = _.extend({
                xpath: null,
                value: null,
                documentIdXpath: null,
                daysUntilPasswordlessLinkSharesExpire: null,
                isUploadAllowed: true,
                isLinkShareAllowed: true
            }, { tagId: tagId });

            this.rules.push(newRule);
        },
        removeRule: function removeRule(key) {
            if (!this.loading) {
                this.rules.splice(key, 1);
            }
        },
        getTagNameById: function getTagNameById(id) {
            return _.findWhere(this.tags, { id: id }).text;
        },
        tagHasRules: function tagHasRules(id) {
            var filtered = _.where(this.rules, { tagId: id });
            return !!filtered.length;
        },
        restoreFromBackup: function restoreFromBackup() {
            this._restoreRules();
        },
        toggleAllowUpload: function toggleAllowUpload(id) {
            var rule = this.rules[id];
            rule.isUploadAllowed = !rule.isUploadAllowed;
        },
        toggleAllowLinkShare: function toggleAllowLinkShare(id) {
            var rule = this.rules[id];
            rule.isLinkShareAllowed = !rule.isLinkShareAllowed;

            if (!rule.isLinkShareAllowed) {
                rule.daysUntilPasswordlessLinkSharesExpire = null;
            }
        },
        fetchTags: function fetchTags() {
            var _this3 = this;

            this._setLoading();

            $.ajax({
                dataType: 'json',
                url: OC.generateUrl('apps/files_classifier/tags')
            }).success(function (tags) {
                _this3.tags = _.chain(tags).where({ isUserEditable: false }).map(function (tag) {
                    if (!(tag.isUserVisible && tag.isUserAssignable && tag.isUserEditable)) {
                        return {
                            id: tag.id,
                            text: tag.name
                        };
                    }
                }).value();
                _this3._setDone();
            }).fail(function (err) {
                _this3._setFailed(err);
            });
        },
        fetchRules: function fetchRules() {
            var _this4 = this;

            this._setLoading();
            $.ajax({
                dataType: 'json',
                url: OC.generateUrl('apps/files_classifier/rules')
            }).success(function (rules) {
                _this4.rules = rules ? rules : [];
                _this4._backupRules();
                _this4._setDone();
            }).fail(function (err) {
                _this4._setFailed(err);
            });
        },
        saveRules: function saveRules() {
            var _this5 = this;

            this._setLoading();
            var prepared = this.rules.map(function (rule) {
                var expire = parseInt(rule.daysUntilPasswordlessLinkSharesExpire, 10);
                if (!expire) {
                    expire = null;
                }
                return _.extend(rule, { daysUntilPasswordlessLinkSharesExpire: expire });
            });

            $.ajax({
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                url: OC.generateUrl('apps/files_classifier/rules'),
                data: (0, _stringify2.default)(prepared)
            }).success(function () {
                _this5.fetchRules();
            }).fail(function (err) {
                _this5._setFailed(err);
            });
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"section",attrs:{"id":"files_classifier"}},[_c('h2',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("\n        Document Classification and Feature Policies\n        ")]),_vm._v(" "),_c('p',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("\n        Define rules to automatically tag uploaded documents using their metadata and enforce feature policies based on assigned tags.\n    ")]),_vm._v(" "),_c('section',{staticClass:"tag-list",class:{ 'is-loading' : _vm.loading }},[_c('table',[_c('thead',[_c('tr',[_c('th',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"colspan":"2"}},[_vm._v("Metadata")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"rowspan":"2"}},[_vm._v("Tag")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"colspan":"3"}},[_vm._v("Policies")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"colspan":"2"}},[_vm._v("Logging")])]),_vm._v(" "),_c('tr',[_c('th',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("Property XPath")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("Property Value")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("Prevent upload")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("Prevent link sharing")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}],staticStyle:{"min-width":"125px"}},[_vm._v("Unprotected links expire")]),_vm._v(" "),_c('th',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"colspan":"2"}},[_vm._v("Document ID XPath")])])]),_vm._v(" "),_c('tbody',[(!_vm.rules.length)?_c('tr',[_c('td',{staticClass:"text-center",attrs:{"colspan":"7"}},[_c('em',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("No data yet")])])]):_vm._e(),_vm._v(" "),_vm._l((_vm.rules),function(rule,rid){return _c('tr',{key:rid},[_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(rule.xpath),expression:"rule.xpath",modifiers:{"lazy":true}}],attrs:{"type":"text","readonly":_vm.loading},domProps:{"value":(rule.xpath)},on:{"change":function($event){return _vm.$set(rule, "xpath", $event.target.value)}}})]),_vm._v(" "),_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(rule.value),expression:"rule.value",modifiers:{"lazy":true}}],attrs:{"type":"text","readonly":_vm.loading},domProps:{"value":(rule.value)},on:{"change":function($event){return _vm.$set(rule, "value", $event.target.value)}}})]),_vm._v(" "),_c('td',{staticClass:"text-bold text-monospace"},[_c('select',{directives:[{name:"model",rawName:"v-model",value:(rule.tagId),expression:"rule.tagId"}],attrs:{"disabled":_vm.loading},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(rule, "tagId", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},_vm._l((_vm.tags),function(tag,tid){return _c('option',{key:tid,attrs:{"disabled":_vm.tagHasRules(tag.id) && rule.tagId != tag.id},domProps:{"value":tag.id}},[_vm._v(_vm._s(_vm.getTagNameById(tag.id)))])}),0)]),_vm._v(" "),_c('td',{staticClass:"checkbox",class:{'is-checked' : !rule.isUploadAllowed },on:{"click":function($event){return _vm.toggleAllowUpload(rid)}}}),_vm._v(" "),_c('td',{staticClass:"checkbox",class:{'is-checked' : !rule.isLinkShareAllowed },on:{"click":function($event){return _vm.toggleAllowLinkShare(rid)}}}),_vm._v(" "),_c('td',[(rule.isLinkShareAllowed)?_c('div',[_c('span',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("after")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(rule.daysUntilPasswordlessLinkSharesExpire),expression:"rule.daysUntilPasswordlessLinkSharesExpire",modifiers:{"lazy":true}}],staticStyle:{"width":"38px","text-align":"center"},attrs:{"type":"number","min":"1","readonly":_vm.loading},domProps:{"value":(rule.daysUntilPasswordlessLinkSharesExpire)},on:{"change":function($event){return _vm.$set(rule, "daysUntilPasswordlessLinkSharesExpire", $event.target.value)}}}),_vm._v(" "),_c('span',{directives:[{name:"translate",rawName:"v-translate"}]},[_vm._v("days")])]):_vm._e()]),_vm._v(" "),_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(rule.documentIdXpath),expression:"rule.documentIdXpath",modifiers:{"lazy":true}}],attrs:{"type":"text","readonly":_vm.loading},domProps:{"value":(rule.documentIdXpath)},on:{"change":function($event){return _vm.$set(rule, "documentIdXpath", $event.target.value)}}})]),_vm._v(" "),_c('td',{staticClass:"text-right"},[_c('span',{staticClass:"icon icon-delete inlineblock",on:{"click":function($event){return _vm.removeRule(rid)}}})])])})],2)]),_vm._v(" "),_c('section',{staticClass:"footer"},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"footer-right"},[(_vm.hasChanged)?_c('button',{directives:[{name:"translate",rawName:"v-translate"}],attrs:{"disabled":_vm.loading},on:{"click":_vm.restoreFromBackup}},[_vm._v("Revert")]):_vm._e(),_vm._v(" "),_c('button',{directives:[{name:"translate",rawName:"v-translate",value:(_vm.core),expression:"core"}],staticClass:"button-primary",attrs:{"disabled":!_vm.hasChanged || _vm.loading},on:{"click":_vm.saveRules}},[_vm._v("Save")])])]),_vm._v(" "),(_vm.loading)?_c('div',{staticClass:"loading"}):_vm._e()])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"footer-left"},[_c('input',{attrs:{"name":"foo","id":"files_classifier_select_tags"}})])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d588019c", __vue__options__)
  } else {
    hotAPI.reload("data-v-d588019c", __vue__options__)
  }
})()}

},{"babel-runtime/core-js/json/stringify":1,"vue":9,"vue-hot-reload-api":6}],12:[function(require,module,exports){
'use strict';

var _vueMin = require('vue/dist/vue.min.js');

var _vueMin2 = _interopRequireDefault(_vueMin);

var _settings = require('./components/settings.vue');

var _settings2 = _interopRequireDefault(_settings);

var _translate = require('./translate.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vueMin2.default.mixin(_translate.mixin); /**
                                           *
                                           * @copyright Copyright (c) 2018, ownCloud GmbH
                                           * @license OCL
                                           *
                                           * This code is covered by the ownCloud Commercial License.
                                           *
                                           * You should have received a copy of the ownCloud Commercial License
                                           * along with this program. If not, see <https://owncloud.com/licenses/owncloud-commercial/>.
                                           *
                                           */

// @NOTE: Use vue.js (drom .min.) in development mode
// @TODO: Employ NODE_ENV specific version(s)

_vueMin2.default.directive('translate', _translate.directive);

var files_classifier = new _vueMin2.default({
  template: '<Settings/>',
  components: {
    Settings: _settings2.default
  }
});

$(document).ready(function () {

  // outsourced for eslint purposes
  files_classifier.$mount('#app-files_classifier');
});

},{"./components/settings.vue":11,"./translate.js":13,"vue/dist/vue.min.js":7}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var mixin = {
	data: function data() {
		return {
			core: 'core'
		};
	},

	methods: {
		t: function (_t) {
			function t(_x) {
				return _t.apply(this, arguments);
			}

			t.toString = function () {
				return _t.toString();
			};

			return t;
		}(function (string) {
			var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'files_classifier';

			return t(scope, string);
		}),
		$gettext: function $gettext(string) {
			var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'files_classifier';

			return t(scope, string);
		}
	}
};

var directive = {
	bind: function bind(el) {
		el.innerText = t('files_classifier', el.innerText.trim());
	}
};

exports.mixin = mixin;
exports.directive = directive;

},{}]},{},[12])
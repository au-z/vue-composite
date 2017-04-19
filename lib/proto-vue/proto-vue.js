/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ProtoVue = factory());
}(this, (function() {
	'use strict';
	let Vue;
	let opts;
	let handler;

	function install(_Vue, options) {
		if(!options.pvService) console.error('[ProtoVue] no pvService provided.');
		if(Vue) {
			console.error('[ProtoVue] already installed. \'Vue.use(ProtoVue)\' should be called only once.');
			return;
		}
		Vue = _Vue;
		opts = options || {};
		applyMixin(Vue);
	}

	function applyMixin(Vue) {
		let version = Number(Vue.version.split('.')[0]);
		if(version >= 2) {
			let usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
			Vue.mixin(usesInit ? {init: registerMixins} : {beforeCreate: registerMixins});
		}else{
			throw new Error('[ProtoVue] is only compatible with Vue >= 2.x');
		}
	}

	function registerMixins() {
		this.$pvInit = $pvInit;
		this.$pvSub = $pvSub;
	}

	function $pvSub(type, cb) {
		if(!handler) return;
		handler.subscribe('message', function(data) {
			return data;
		});
	}

	function $pvInit(classSelector, origin) {
		handler = opts.pvService({classSelector, origin});
	}

	// auto install in dist mode
	if(typeof window !== 'undefined' && window.Vue) install(window.Vue);

	return {
		version: '1.0.0',
		install,
	};
})));

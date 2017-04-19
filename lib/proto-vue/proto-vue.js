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
	let service;

	function install(_Vue, options) {
		opts = options || {};
		if(!opts.pvService) console.error('[ProtoVue] no pvService provided.');
		if(Vue) {
			console.error('[ProtoVue] already installed. \'Vue.use(ProtoVue)\' should be called only once.');
			return;
		}
		Vue = _Vue;
		service = opts.pvService({classSelector: opts.classSelector, targetOrigin: opts.targetOrigin})
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
		this.$pvInit = service.init;
		this.$pvSub = service.subscribe;
	}

	// auto install in dist mode
	if(typeof window !== 'undefined' && window.Vue) install(window.Vue);

	return {
		version: '1.0.0',
		install,
	};
})));

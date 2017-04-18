/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueComposite = factory());
}(this, (function() {
	'use strict';
	let Vue;
	let opts;
	let pvHandler;

	function install(_Vue, options) {
		if(Vue) {
			console.error('[ProtoVue] already installed. \'Vue.use(ProtoVue)\' should be called only once.');
			return;
		}
		Vue = _Vue;
		opts = options || {};
		if(!opts.handler) {
			console.error('[ProtoVue] No handler provided. Aborting.');
			return;
		}
		pvHandler = opts.pvHandler;
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
		this.$pvBind = $pvBind;
	}

	function $pvBind(messageKey, cb) {
		pvHandler.bindToEvent('message', cb || function(data) {
			return data;
		});
	}

	return {
		version: '1.0.0',
		install,
	};
})));

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueI18n = factory());
}(this, function() {
	'use strict';

	let Vue;
	let $api = {};

	function install(_Vue, options) {
		if(Vue) {
			console.error('[VueComposite] already installed. \'Vue.use(VueComposite)\' should be called only once.');
			return;
		}
		if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
			console.error('[VueComposite] Sorry, Promises are not supported by your browser. :(');
			return;
		}
		options = options || {};
		Vue = _Vue;
		if(!Vue.customElement) {
			console.error('[VueComposite] The vue-custom-element package required.');
			return;
		}
		Vue.registerApi = registerApi;
		applyMixin(Vue);
	}

	function applyMixin(Vue) {
		let version = Number(Vue.version.split('.')[0]);
		if(version >= 2) {
			let usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
			Vue.mixin(usesInit ? {init: registerMixins} : {beforeCreate: registerMixins});
		}else{
			throw new Error('vue-globals only works with Vue >= 2.x');
		}
	}

	function registerMixins() {
		this.$compose = $compose;
		this.$api = $api;
	}

	let $compose = function(url) {
		get(url).then(function(response) {
			let component = eval(response);
			console.log(component);
			if(!component.name) {
				console.error('[VueComposite] cannot create custom element with no name.');
			}
			if(component._compositeUrls){
				console.log('Sub-components!');
				component._compositeUrls.forEach((url) => $compose(url));
			}
			Vue.customElement(component.name, component);
		})
		.catch(function(error) {
			console.error('[VueComposite] cannot GET component at ' + url, error);
		});
	};

	let registerApi = function(args) {
		if(!args.name || !args.url) {
			console.error('[VueComposite] cannot register a new api route with no name or url.');
			return;
		}
		if($api[args.name]) {
			console.warn('[VueComposite] api \'' + args.name + '\' is already defined. Overwriting...');
		}
		$api[args.name] = {name: args.name, url: args.url};
	};

	function get(url) {
		return new Promise((resolve, reject) => {
			let http = new XMLHttpRequest();
			http.responseType = 'text';
			http.open('GET', url);
			http.onload = () => {
				(http.status === 200 && http.response !== null) ?
					resolve(http.response) : reject(Error(http.statusText));
			};
			http.onerror = () => reject(Error('Network error.'));
			http.send();
		});
	}

	// auto install in dist mode
	if (typeof window !== 'undefined' && window.Vue) {
		install(window.Vue);
	}

	return {
		version: '1.0.0',
		install,
	};
}));

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
	let Vuex;
	let mapState;
	let mapGetters;
	let mapMutations;
	let mapActions;

	let opts;
	let composedStores = {};
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
		Vue = _Vue;

		opts = options || {};
		opts.styleSheetId = opts.styleSheetId || 'composedCss';
		Vuex = opts.Vuex;

		if(Vuex) {
			mapState = Vuex.mapState;
			mapGetters = Vuex.mapGetters;
			mapMutations = Vuex.mapMutations;
			mapActions = Vuex.mapActions;
		} else {
			console.warn('[VueComposite] Vuex not included in options. New compositions will not have access to a store.');
		}
		if(!Vue.customElement) {
			console.error('[VueComposite] The vue-custom-element package is required.');
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
			throw new Error('[VueComposite] is only compatible with Vue >= 2.x');
		}
	}

	function registerMixins() {
		this.$compose = $compose;
		this.$api = $api;
	}

	let $compose = function(url, parentStoreKey) {
		get(url).then(function(response) {
			let component = eval(response);

			if(component.store) {
				composedStores[component.name] = component.store;
			}
			if(parentStoreKey) {
				component.store = composedStores[parentStoreKey];
			}

			if(!component.name) {
				console.error('[VueComposite] cannot create custom element with no name.');
			}

			if(component._compositeUrls) {
				let storeKey = parentStoreKey || (component.store) ? component.name : null;
				component._compositeUrls.forEach(function(url) {
					$compose(url, storeKey);
				});
			}

			if(component._injectCss){
				injectCss(component._injectCss);
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
		$api[args.name] = {
			name: args.name,
			url: args.url,
			origin: args.url.match(/^https?:\/\/[a-z\.-]+((\.[a-z]{2,})|(:[0-9]+))/i)[0],
		};
	};

	/**
	 * @param {string} css The styles to be added to the stylesheet
	 */
	function injectCss(css) {
		let sheet = findStyleSheet(opts.styleSheetId);
		sheet.innerHTML += css;
	}

	/**
	 * @param {string} title The title of the <style> tag to find
	 * @return {CSSStyleSheet} The found or created style sheet
	 */
	function findStyleSheet(title) {
		let styleEl = document.querySelector('style#' + (title));
		if(!styleEl) {
			styleEl = createStyleElement(title);
		}
		return styleEl;
	}

	function createStyleElement(title) {
		let styleEl = document.createElement('style');
		styleEl.setAttribute('id', title);
		document.body.appendChild(styleEl);
		return styleEl;
	}

	function get(url) {
		return new Promise(function(resolve, reject) {
			let http = new XMLHttpRequest();
			http.responseType = 'text';
			http.open('GET', url);
			http.onload = function() {
				(http.status === 200 && http.response !== null) ?
					resolve(http.response) : reject(Error(http.statusText));
			};
			http.onerror = function() {
				reject(Error('Network error.'));
			};
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
})));

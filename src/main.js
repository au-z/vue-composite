/* eslint-env browser */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueCustomElement from 'vue-custom-element';
import VueComposite from '../lib/vue_composite/vueComposite';

if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
	throw new Error('Sorry, Promises are not supported by your browser. :(');
}

Vue.use(VueRouter, {

});
Vue.use(VueCustomElement);
Vue.use(VueComposite);
Vue.registerApi({name: 'MyAccount', url: 'https://runkit.io/auzmartist/ma-mock/branches/master/'});
Vue.config.ignoredElements = ['pl-profile', 'pl-profile-menu'];

new Vue({
	el: '#app',
	render: (h) => h(App),
});

/**
 * XMLHttpRequests the specified resource as JS.
 * @param {string} uri a relative path
 * @return {Promise} the promised resource
 */
function loadScript(uri) {
	return new Promise((resolve, reject) => {
		let http = new XMLHttpRequest();
		http.responseType = 'text/javascript';
		http.open('GET', uri);
		http.onload = () => {
			(http.status === 200 && http.response !== null) ?
				resolve(http.response) : reject(Error(http.statusText));
		};
		http.onerror = () => reject(Error('Network error.'));
		http.send();
	});
}

window.__loadScript = loadScript;

/* eslint-env browser */
/* eslint-disable no-undef */
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueCustomElement from 'vue-custom-element';
import VueComposite from '../lib/vue-composite/vueComposite';

if(typeof Promise == 'undefined' && Promise.toString().indexOf('[native code]') == -1) {
	throw new Error('Sorry, Promises are not supported by your browser. :(');
}

Vue.use(Vuex);
Vue.use(VueCustomElement);
Vue.use(VueComposite);
Vue.registerApi({name: 'MyAccount', url: 'https://runkit.io/auzmartist/ma-mock/branches/master/'});
Vue.config.ignoredElements = ['pl-profile', 'pl-profile-menu'];

const store = new Vuex.Store({
	state: {
		componentCount: 0,
	},
	mutations: {
		inccomponentCount: (state) => state.componentCount++,
	},
});

new Vue({
	el: '#app',
	store,
	render: (h) => h(App),
});

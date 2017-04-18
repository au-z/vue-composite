/* eslint-env browser */
/* eslint-disable no-undef */
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import VueCustomElement from 'vue-custom-element';
import VueComposite from '../lib/vue-composite/vue-composite';

Vue.use(Vuex);
Vue.use(VueCustomElement);
Vue.use(VueComposite, {Vuex, styleSheetId: 'composedCss'});
Vue.registerApi({name: 'MyAccount', url: 'http://localhost:8081/'});
Vue.config.ignoredElements = ['pl-profile', 'pl-profile-menu'];

new Vue({
	el: '#app',
	render: (h) => h(App),
});

// required to pack the composables
import './composables/pl-profile.vue';
import './composables/pl-profile-menu.vue';

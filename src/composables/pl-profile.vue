<template>
	<div class="pl-profile">
		<div class="header"><h3>Greetings {{name}}!</h3></div>
		<div class="content">
			<button @click="$emit('emitEvent')">-1</button>
			<p>prop: {{prop}} : vuex: {{counter}}</p>
			<p>apiUrl: {{apiUrl}}</p>
		</div>
		<pl-profile-menu></pl-profile-menu>
	</div>
</template>

<script>
/* eslint-env browser */
import Vue from 'vue';
import Vuex from 'vuex';
import {mapGetters} from 'vuex';
Vue.use(Vuex);

export default {
	name: 'pl-profile',
	props: ['prop'],
	_compositeUrls: [
		'http://localhost:8081/api/composables/pl-profile-menu.js',
	],
	store: new Vuex.Store({
		state: {
			counter: 0,
		},
		modules: {
			api: {
				state: {
					url: 'http://localhost:8081/api/',
				},
				getters: {
					apiUrl: function(state) {
						return (function() {
							return state.url;
						})();
					},
				},
			},
		},
		getters: {
			counter: (state) => state.counter,
		},
		mutations: {
			incCounter: function(state) {
				state.counter++;
			},
		},
	}),
	data: function(){
		return {
			name: null,
		};
	},
	computed: mapGetters(['counter', 'apiUrl']),
	created: function() {
		this.getProfile();
	},
	methods: {
		getProfile: function() {
			let vm = this;
			fetch(this.apiUrl + 'account/profile')
			.then(function(r) {
				return r.json();
			})
			.then(function(profile) {
				vm.name = profile.name;
			});
		},
	},
}
</script>

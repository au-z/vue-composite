<template>
	<div class="pl-profile">
		<div class="header" @click="toggleMenu" title="click to toggle"><h4>Greetings {{name}}!</h4></div>
		<div class="content" :class="menuActive ? '' : 'transparent'">
			<button @click="$emit('emitEvent')">-1</button>
			<p>prop: {{prop}} : vuex: {{counter}}</p>
			<p>apiUrl: {{apiUrl}}</p>
			<pl-profile-menu></pl-profile-menu>
		</div>
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
		'http://localhost:8081/composables/pl-profile-menu.js',
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
			menuActive: false,
		};
	},
	computed: mapGetters(['counter', 'apiUrl']),
	created: function() {
		this.getProfile();
	},
	methods: {
		toggleMenu() {
			this.menuActive = !this.menuActive;
		},
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

<style>
	.pl-profile {
		padding: 0 0 8px 8px;
	}
	.pl-profile > .header {
		height: 36px;
		color: #555;
		border-bottom: 2px solid #4488ff;
	}
	.pl-profile > .header:hover {
		cursor: pointer;
	}
	.pl-profile > .header > h4 {
		margin: 8px 0 4px 0;
		font-size: 1.1em;
		font-weight: 300;
	}
	.pl-profile > .content {
		padding: 16px;
		opacity: 1.0;
		transition: 0.3s all;
	}
	.pl-profile > .content.transparent {
		opacity: 0.0
	}
</style>

<template>
	<div id="app">
		<div class="component-count">{{componentCount}}</div>
		<h1>{{$options.name}}</h1>
		<button @click="$compose('/lib/pl-profile.js')">Click To Load</button>
		<pl-profile :prop="time"></pl-profile>
	</div>
</template>

<script>
import {mapState} from 'vuex';
export default {
	name: 'app',
	data() {
		return {
			time: 0,
		};
	},
	computed: {
		...mapState({
			componentCount: (state) => state.componentCount,
		}),
	},
	created() {
		this.tick();
	},
	methods: {
		tick() {
			let vm = this;
			setInterval(() => {
				vm.time++;
			}, 1000);
		},
	},
};
</script>

<style lang="scss">
[v-cloak] { display: none }

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

h1, h2 {
	font-weight: normal;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>

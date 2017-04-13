<template>
	<div id="app">
		<h1>{{$options.name}}</h1>
		{{time}}
		<header><pl-profile :prop="time"></pl-profile></header>
	</div>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {
			time: 0,
		};
	},
	created() {
		this.$compose('/api/composables/pl-profile.js');
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

header {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	height: 42px;
	background-color: #eee;
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

.pl-profile {
	position: absolute;
	right: 0;
	top: 0;
	padding: 0 8px;
	h3 {
		margin: 12px;
	}
}
</style>

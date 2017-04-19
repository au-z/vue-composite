<template>
	<div id="app">
		<h1>{{$options.name}}</h1>
		{{time}}
		<header>
			<pl-profile :prop="time" @emitEvent="addCounter(-1)"></pl-profile>
		</header>
		<div v-for="(v, i) in viewerCount">
			<div class="control-panel">
				<label for="yaw">Yaw</label><input type="number"></input>
				<label for="yaw">Pitch</label><input type="number"></input>
				<label for="yaw">Roll</label><input type="number"></input>
				Mouse: ({{mouse(i, 'x')}}, {{mouse(i, 'y')}})
			</div>
			<div :id="'viewer_' + i" class="proto-view" :data-src="$api['MyAccount'].url + 'pnpv/'" data-width="500" data-height="200" :data-vid="i"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {
			time: 0,
			viewerCount: 3,
			viewers: [],
			mouseX: null,
			mouseY: null,
		};
	},
	computed: {

	},
	created() {
		this.$compose(this.$api['MyAccount'].url + 'composables/pl-profile.js');
		this.tick();
		this.$pvSub('pnpv_mouseUp', (type, payload) => {
			this.viewers[payload._vid].mouse = {
				x: payload.mouseX,
				y: payload.mouseY,
			};
		});
		this.$pvSub('vidAssigned', (type, payload) => console.log(type, payload));
	},
	mounted() {
		this.viewers = this.$pvInit('proto-view', this.$api['MyAccount'].origin);
	},
	methods: {
		mouse(vid, xy) {
			if(!this.viewers) return;
			let viewer = this.viewers[vid];
			return (viewer && viewer.mouse) ? viewer.mouse[xy] : '';
		},
		tick() {
			let vm = this;
			setInterval(() => {
				this.addCounter(1);
			}, 1000);
		},
		addCounter(val) {
			this.time += val;
		},
		pnpvBind(messageKey) {
			return '1';
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

.control-panel {
	input {
		width: 50px;
	}
}
</style>

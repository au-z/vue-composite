<template>
	<div id="app">
		<header>
			<pl-profile :prop="time" @emitEvent="addCounter(-1)"></pl-profile>
		</header>
		<div class="stats-for-nerds">
			<div>Shared Counter: {{time}}</div>
		</div>
		<br><br><br><br>
		<div class="pv-container" v-for="(v, i) in viewers">
			<pl-viewer-control :viewer="v">{{v}}</pl-viewer-control>
			<div :id="'viewer_' + i" class="proto-view" :data-src="$api['MyAccount'].url + 'pnpv/'" data-width="700" data-height="400" :data-vid="i"></div>
		</div>
		<button @click="newViewer()">New</button>
	</div>
</template>

<script>
import PlViewerControl from './pl-viewer-control.vue';
export default {
	name: 'app',
	components: {
		'pl-viewer-control': PlViewerControl,
	},
	data() {
		return {
			time: 0,
			viewers: [{}],
			mouseX: null,
			mouseY: null,
		};
	},
	created() {
		this.$compose(this.$api['MyAccount'].url + 'composables/pl-profile.js');
		this.tick();
	},
	mounted() {
		this.initViewers();
	},
	methods: {
		newViewer() {
			this.viewers.push({});
			this.$nextTick(() => this.initViewers());
		},
		initViewers() {
			this.$pv.init('proto-view', this.$api['MyAccount'].origin).then((viewers) => {
				this.viewers = viewers;
				this.subscribe();
				this.viewers.forEach((v) => v.post('requestRotations'));
			});
		},
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
		subscribe() {
			this.$pv.sub('pnpv_mouseUp', (type, payload) => {
				this.viewers[payload._vid].mouse = {
					x: payload.mouseX,
					y: payload.mouseY,
				};
			});
			this.$pv.sub('yaw', (type, data) => this.viewers[data._vid].yaw = data.payload);
			this.$pv.sub('pitch', (type, data) => this.viewers[data._vid].pitch = data.payload);
			this.$pv.sub('roll', (type, data) => this.viewers[data._vid].roll = data.payload);
		}
	},
};
</script>

<style lang="scss">
[v-cloak] { display: none }
*, *::before, *::after {
	box-sizing: border-box;
}
body {
	background-color: #f8f8f8;
}

#app {
	font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

button {
	background-color: transparent;
	padding: 8px 12px;
	border-radius: 2px;
	background-color: #4488ff;
	color: white;
	font-size: 1em;
	border: none;
	transition: 0.3s all;
	&:hover {
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
	}
}

.stats-for-nerds{
	position: absolute;
	left: 0;
	top: 42px;
	min-width: 300px;
	height: 400px;
	background-color: rgba(40,40,40,0.8);
	border-bottom-right-radius: 4px;
	box-shadow: 0 1px 2px rgba(0,0,0,0.2);
	z-index: 1;
	color: #eee;
	border-bottom: 4px solid #eee;
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

.pv-container {
	position: relative;
	display: flex;
	width: 50%;
	min-width: 700px;
	margin: 16px auto;
	justify-content: center;
	border-radius: 2px;
	background-color: white;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
</style>

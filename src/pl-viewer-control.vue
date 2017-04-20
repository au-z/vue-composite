<template>
	<div class="pl-viewer-control">
			<div class="controls">
				<div><label>Yaw </label><input :placeholder="viewer.yaw" v-model="viewer.yaw" @change="viewer.post('updateYaw', viewer.yaw)"></input></div>
				<div><label>Pitch </label><input :placeholder="viewer.pitch" v-model="viewer.pitch" @change="viewer.post('updatePitch', viewer.pitch)"></input></div>
				<div><label>Roll </label><input :placeholder="viewer.roll" v-model="viewer.roll" @change="viewer.post('updateRoll', viewer.roll)"></input></div>
			</div>
			{{viewer.mouse}}
	</div>
</template>

<script>
	/* eslint-env browser */
	export default {
		name: 'pl-viewer-control',
		props: ['viewer'],
	};
</script>

<style lang="scss">
.pl-viewer-control {
	position: absolute;
	left: 0;
	top: 0;
	padding: 8px;
	text-align: left;
	border-left: 1px solid #eee;
	.controls {
		& > div {
			margin: 2px 5px;
			margin-bottom: 8px;
		}
		input {
			background-color: transparent;
			border: none;
			border-radius: 4px;
			font-size: 14px;
			padding-left: 4px;
			line-height: 1.8em;
			border: 1px solid #bbb;
			width: 70px;
		}
	}
	label {
		display: inline-block;
		width: 48px;
		text-transform: uppercase;
		font-size: 0.8em;
		color: #444;
	}
}
</style>
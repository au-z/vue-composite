(function() {
	return {
		name: 'pl-profile',
		props: ['prop'],
		_compositeUrls: [
			'/api/composables/pl-profile-menu.js',
		],
		store: new Vuex.Store({
			state: {
				counter: 0,
			},
			getters: {
				counter: (state) => state.counter,
			},
			mutations: {
				incCounter: function(state) { state.counter++; },
			},
		}),
		data: function(){
			return {
				name: null,
			};
		},
		computed: mapGetters([ 'counter' ]),
		created: function() {
			this.getProfile();
		},
		methods: {
			getProfile: function() {
				let vm = this;
				// TODO: How to we represent base urls before build?
				fetch(this.$api['MyAccount'].url + 'account/profile')
				.then(function(r) {
					console.log(r);
					return r.json()})
				.then(function(profile) {vm.name = profile.name});
			},
		},
		template: `
			<div class="pl-profile">
				<div class="header"><h3>Hello {{name}}!</h3></div>
				<div class="content">
					<p>{{prop}} : {{counter}}</p>
				</div>
				<pl-profile-menu></pl-profile-menu>
			</div>
		`,
	};
})();

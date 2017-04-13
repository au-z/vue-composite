(function() {
	return {
		name: 'pl-profile',
		props: ['prop'],
		_compositeUrls: [
			'/modules/pl-profile-menu.js',
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
				fetch(this.$api['MyAccount'].url + 'account/profile', {
					headers: {'X-Requested-With': 'XMLHttpRequest'},
				}).then(function(r) {
					var json = JSON.parse(r.headers.get('X-Responded-JSON'));
					if (json && json.status === 401) {
						window.location.href = json.headers['location'];
					}
					return r;
				}).then(function(r) {return r.json()})
				.then(function(profile) {vm.name = profile.name});
			},
		},
		template: `
			<div v-cloak>
				<p>Hello {{name}}!</p>
				<p>prop data: {{prop}} <br> local vuex counter: {{counter}}</p>
				<pl-profile-menu></pl-profile-menu>
			</div>
		`,
	};
})();

(function() {
	return {
		name: 'pl-profile',
		props: ['prop'],
		data: function(){
			return {
				name: null,
			};
		},
		_compositeUrls: [
			'/lib/pl-profile-menu.js',
		],
		created: function() {
			this.getProfile();
		},
		methods: {
			getProfile: function() {
				fetch(this.$api['MyAccount'].url + 'account/profile', {
					headers: {'X-Requested-With': 'XMLHttpRequest'},
				}).then(function(r) {
					var json = JSON.parse(r.headers.get('X-Responded-JSON'));
					if (json && json.status === 401) {
						window.location.href = json.headers['location'];
					}
					return r;
				}).then((r) => r.json())
				.then((data) => this.name = data.name);
			},
		},
		template: `
			<div v-cloak>
				<p>Hello {{name}}!</p>
				<p>Prop Data: {{prop}}</p>
				<pl-profile-menu></pl-profile-menu>
			</div>
		`,
	};
})();

(function(){
	return {
		name: 'pl-profile-menu',
		methods: {
			getActiveState: function(menuItemRoute) {
				return (this.$route.name === menuItemRoute) ? 'active' : 'inactive';
			},
		},
		created: function() {
			let vm = this;
			setInterval(function() {
				vm.$store.commit('incCounter');
			}, 1000);
		},
		template: `
			<nav><ul>
				<li class="menu-item"><a href="#">Profile</a></li>
				<li class="menu-item"><a href="#">Password</a></li>
				<li class="menu-item"><a href="#">Shipping</a></li>
				<li class="menu-item"><a href="#">Billing</a></li>
				<li class="menu-item"><a href="#">Settings</a></li>
			</ul></nav>
		`,
	};
})();

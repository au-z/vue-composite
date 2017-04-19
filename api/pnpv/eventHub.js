/* eslint-env browser */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
var eventHub = (function(options) {
	options = options || {};
	if(!options.targetOrigin) console.error('[eventHub] targetOrigin not provided.');
	let hubId = null;

	const hub = (function(q) {
		let events = {};
		let subUid = -1;

		let subscribe = function(event, func) {
			if(!events[event]) {
				events[event] = [];
			}
			var token = (++subUid).toString();
			events[event].push({token, func});
			return token;
		};

		let publish = function(event, payload) {
			if(!events[event]) return false;
			setTimeout(() => {
				var subscribers = events[event];
				var len = subscribers ? subscribers.length : 0;
				while(len--) {
					subscribers[len].func(event, payload);
				}
			}, 0);
			return true;
		};

		let unsubscribe = function(token) {
			for(var e in events) {
				if(events[e]) {
					for(var i = 0; i < events[e].length; i++) {
						if(events[e][i].token === token) {
							events[e].splice(i, 1);
							return token;
						}
					}
				}
			}
			return false;
		};

		return {subscribe, publish, unsubscribe};
	})();

	window.addEventListener('message', function(event) {
		var origin = event.origin || event.originalEvent.origin;
		// TODO: replace with list of known origins
		if(origin !== options.targetOrigin) {
			console.warn('[eventHub] message received from unknown origin. Disregarding.');
			return;
		}
		if(!event.data || !event.data._type || !event.data.payload) {
			console.error('[eventHub] No data._type or data.payload sent with message.');
		}
		if(event.data._type === '_init_') {
			hubId = event.data.payload;
		} else {
			hub.publish(event.data._type, event.data.payload);
		}
	});

	/**
	 * Emits the event from the eventHub mount point
	 * @param {string} type the custom event type
	 * @param {Object} payload any object to use as payload
	 */
	function emit(type, payload = {}) {
		hub.publish(type, payload);
		payload._vid = hubId;
		window.parent.postMessage({_type: type, payload}, options.targetOrigin);
	}

	return {
		subscribe: hub.subscribe,
		emit: emit,
		publish: hub.publish,
		unsubscribe: hub.unsubscribe,
	};
})({
	targetOrigin: 'http://localhost:8080',
});

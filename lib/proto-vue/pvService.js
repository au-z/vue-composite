/* eslint-env browser */
/* eslint-disable no-var */
/* eslint-disable no-console */
/* eslint-disable no-undef */
export default function(options) {
	options = options || {};
	if(!options.classSelector) {
		console.error('[PvHandler] No classSelector specified.');
		return;
	}
	if(!options.targetOrigin) {
		console.error('[PvHandler] No targetOrigin specified.');
		return;
	}

	window.addEventListener('message', function(event) {
		var origin = event.origin || event.originalEvent.origin;
		if(origin !== options.targetOrigin) return;
		if(!event.data || !event.data._type || !event.data.payload) {
			console.error('[PvService] no data._type or data.payload in message.');
			return;
		}
		hub.publish(event.data._type, event.data.payload);
	});

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

	let viewers = [];
	init();

	/**
	 * Initializes all currently rendered proto-viewer instances.
	 * @return {Promise} A Promise resolving each of the viewers
	 */
	function init() {
		let containers = [].slice.call(document.getElementsByClassName(options.classSelector));
		viewers.splice(0, viewers.length);
		for(let i = 0; i < containers.length; i++) {
			viewers.push({container: containers[i]});
		}
		let framesLoaded$ = [];
		viewers.forEach(function(v) {
			while(v.container.hasChildNodes()) {
				v.container.removeChild(v.container.lastChild);
			}
			if(!v.container.dataset.src) {
				console.error('[PvHandler] Viewer does not have a data-src attribute.');
			}
			v.iframe = initViewer(v.container.dataset);
			v.container.appendChild(v.iframe);
			v.post = function(type, payload = {}) {
				let message = {_type: type, payload: payload};
				post(v.iframe.contentWindow, message, options.targetOrigin);
			};
			v.subscribe = hub.subscribe;
			v.publish = hub.publish;
			v.unsubscribe = hub.unsubscribe;

			framesLoaded$.push(new Promise(function(resolve, reject) {
				v.iframe.addEventListener('load', function() {
					v.post('_init_', v.container.dataset.vid);
					resolve(v);
				});
			}));
		});

		function initViewer(dataset) {
			dataset = dataset || {};
			var iframe = document.createElement('iframe');
			iframe.src = dataset.src;
			iframe.width = dataset.width;
			iframe.height = dataset.height;
			iframe.id = 'vid_' + dataset.vid;
			iframe.scrolling = 'no';
			iframe.style.border = 'none';
			return iframe;
		}
		return Promise.all(framesLoaded$);
	}

	function post(window, message, targetOrigin) {
		window.postMessage(message, targetOrigin);
	}

	return {
		init: init,
		viewers: viewers,
		subscribe: hub.subscribe,
		unsubscribe: hub.unsubscribe,
	};
}

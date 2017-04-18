/* eslint-env browser */
/* eslint-disable no-var */
/* eslint-disable no-console */
/* eslint-disable no-undef */
var PvHandler = (function(options) {
	options = options || {};
	if(typeof Promise === 'undefined' && Promise.toString().indexOf('[native code]') === -1) {
		console.error('[PvHandler] Sorry, Promises are not supported by your browser. :(');
		return;
	}

	if(!options.classSelector) {
		console.error('[PvHandler] No classSelector specified.');
		return;
	}
	if(!options.origin) {
		console.error('[PvHandler] No origin specified.');
		return;
	}

	let initViewer = function(dataset) {
		dataset = dataset || {};
		var iframe = document.createElement('iframe');
		iframe.src = dataset.src;
		iframe.width = dataset.width;
		iframe.height = dataset.height;
		iframe.scrolling = 'no';
		iframe.style.border = 'none';
		return iframe;
	};

	let post = function(window, message, origin) {
		window.postMessage(message, origin);
	};

	var containers = [].slice.call(document.getElementsByClassName(options.classSelector));
	var viewers = [];
	for(var i = 0; i < containers.length; i++) {
		viewers.push({container: containers[i]});
	}
	console.log(viewers);
	viewers.forEach(function(v) {
		if(!v.container.dataset.src) {
			console.error('[PvHandler] Viewer does not have a data-src attribute.');
		}
		v.iframe = initViewer(v.container.dataset);
		v.container.appendChild(v.iframe);
		v.post = function(message) {
			post(v.iframe.contentWindow, message, options.origin);
		};
	});

	return {
		viewers: viewers,
	};
});

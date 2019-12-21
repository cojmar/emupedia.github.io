importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// noinspection JSUnresolvedVariable
if (workbox) {
	// noinspection JSUnresolvedVariable
	workbox.LOG_LEVEL = 'debug';
	// noinspection JSUnresolvedVariable,JSUnresolvedFunction
	workbox.routing.registerRoute(/^https:\/\/dl\.dropboxusercontent\.com/, new workbox.strategies.CacheFirst({
		cacheName: 'data',
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200]
			})
		]
	}));
}
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// noinspection JSUnresolvedVariable
if (workbox) {
	// noinspection JSUnresolvedVariable,JSUnresolvedFunction
	workbox.routing.registerRoute(/\.zip$/, new workbox.strategies.StaleWhileRevalidate());
}
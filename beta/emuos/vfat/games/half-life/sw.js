function fetchFromCache(e) {
	return caches.match(e.request.headers.get('X-File-Name')).then(function(response) {
		if (!response) {
			throw Error(e.request.url + ' not found in cache');
		}

		return response;
	});
}

function addToCache(name, request, response) {
	if (response.ok) {
		var content_type = response.headers.get('Content-Type') || '';
		var filename = request.headers.get('X-File-Name') || '';

		if (content_type === 'application/zip') {
			if (filename !== '') {
				var copy = response.clone();

				caches.open(name).then(function(cache) {
					// noinspection JSIgnoredPromiseFromCall
					cache.put(filename, copy);
				});
			}
		}
	}

	return response;
}

self.addEventListener('install', function() {
	//console.log('ServiceWorker Installed!');
});

self.addEventListener('activate', function() {
	//console.log('ServiceWorker Activated!');
});

self.addEventListener('message', function(e) {
	//console.log('ServiceWorker: Handling message event: ', e);
});

self.addEventListener('fetch', function(e) {
	//console.log('ServiceWorkder: Handling fetch event for: ', e.request.url);

	if (e.request.url.startsWith('https://dl.dropboxusercontent.com')) {
		var request = e.request;

		// noinspection BadExpressionStatementJS
		e.respondWith(fetchFromCache(e).catch(function() {
			return fetch(request);
		}).then(function(response){
			return addToCache('data', request, response);
		}));
	}
});


var version = "v0.1";
var urlsToPrefetch = [
        'index.html'
        , 'app.js'
        , 'manifest.json'
        , 'images/icons/192x192.png'
        , 'images/icons/144x144.png'
        , 'images/icons/96x96.png'
        , 'images/icons/72x72.png'
        , 'images/icons/48x48.png'
    ];
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(version).then(function (cache) {
        return caches.open(version).then(function (cache) {
            return cache.addAll(urlsToPrefetch);
        });
    }));
});
self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (version != cacheName) { //if (version.indexOf(cacheName) == -1) {
                console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
            }
        }));
    }));
});
self.addEventListener('fetch', function (event) {
    event.respondWith( //
        caches.match(event.request).then(function (response) {
            if (response && event.request.url != "") {
                console.log('Found response in cache:', response);
                return response;
            }
            console.log('No response found in cache. About to fetch from network...');
            return fetch(event.request).then(function (response) {
                console.log('Response from network is:', response);
                return response;
            }).catch(function (error) {
                console.error('Fetching failed:', error);
                throw error;
            });
        }));
});
self.addEventListener('message', function (event) {
    if (event.data.action == 'skipWaiting') {
        self.skipWaiting();
    }
});
const staticCacheName = 'restaurants-v1';
const contentImgsCache = 'restaurants-content-imgs';

var allCaches = [
    staticCacheName,
    contentImgsCache
];

addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);

    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return
    }

    if (requestUrl.pathname.startsWith('/dist/img/') && requestUrl.pathname.endsWith('.webp')) {
        event.respondWith(serveImage(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

function serveImage(request) {
    var storageUrl = request.url;

    return caches.open(contentImgsCache).then(function(cache) {
        return cache.match(storageUrl).then(function(response) {
            if (response) return response;

            return fetch(request).then((networkResponse) => {
                cache.put(storageUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurants-') &&
                        !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                './',
                './css/index.css',
                './css/restaurant.css',
                './css/header.css',
                './css/styles.css',
                './js/all.js',
                './js/all-detail.js',
                './index.html',
                './restaurant.html',
                './manifest.json',
                './sw.js'
            ]);
        })
    );
});

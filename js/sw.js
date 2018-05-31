const staticCacheName = 'restaurants-v1';
const contentImgsCache = 'restaurants-content-imgs';

var allCaches = [
    staticCacheName,
    contentImgsCache
];

addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    console.log(requestUrl.pathname)
    if (requestUrl.pathname.startsWith('/dist/img/') && requestUrl.pathname.endsWith('.webp')) {
        event.respondWith(serveImage(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
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
                'index.html',
                'restaurant.html',
                'sw.js',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'js/service-worker.js',
                'js/indexdb-helper.js',
                'css/header.css',
                'css/map.css',
                'css/navigation.css',
                'css/restaurant-detail.css',
                'css/restaurant-filters.css',
                'css/restaurant-list.css',
                'css/styles.css',

                'dist/css/index.css',
                'dist/js/all.js',
                'dist/index.html',
                'dist/restaurant.html'
            ]);
        })
    );
});

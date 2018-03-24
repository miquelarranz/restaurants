const cacheName = 'restaurants-v1';

addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        'sw.js',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'js/service-worker.js',
        'css/header.css',
        'css/map.css',
        'css/navigation.css',
        'css/restaurant-detail.css',
        'css/restaurant-filters.css',
        'css/restaurant-list.css',
        'css/styles.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        'data/restaurants.json'
      ]);
    })
  );
});

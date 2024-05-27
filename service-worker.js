var cacheName = 'pizzApazzAinfinity-0.6.4';
var filesToCache = [];

self.oninstall = e => e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(filesToCache)));
self.onfetch = e => e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));

self.onmessage = e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
};
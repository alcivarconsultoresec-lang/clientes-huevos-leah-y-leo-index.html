const CACHE_NAME = 'barrioos-huevos-leah-leo-v1';
const APP_SHELL = [
  './',
  './index.html',
  './admin.html',
  './assets/style.css',
  './assets/app.js',
  './assets/carrito.js',
  './assets/admin.js',
  './assets/productos.json',
  './assets/manifest.json',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './assets/sw.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return caches.match('./assets/productos.json');
        });
    })
  );
});

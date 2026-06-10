// Service Worker para PWA - Huevos Leah y Leo

const CACHE_NAME = 'leah-leo-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/products.js',
    '/js/cart.js',
    '/js/app.js',
    '/js/pwa.js'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - devolver respuesta del cache
                if (response) {
                    return response;
                }
                
                // Clonar la petición
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Verificar si es una respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clonar la respuesta
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Manejar notificaciones push (opcional)
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Huevos Leah y Leo';
    const options = {
        body: data.body || 'Nueva oferta disponible',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

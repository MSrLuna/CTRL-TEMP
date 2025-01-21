const CACHE_NAME = 'rhenania-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/src/pages/index.html',
  '/src/pages/refrigerador.html',
  '/src/styles/style.css',
  '/src/scripts/index.js',
  '/src/scripts/refrigerador.js',
  '/public/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes para servir desde la caché o la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Si está en caché, devolver la respuesta
      }
      return fetch(event.request); // Si no está en caché, realizar la solicitud a la red
    })
  );
});

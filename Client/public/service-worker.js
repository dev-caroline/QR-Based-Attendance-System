const CACHE_NAME = 'qr-attendance-v1';
const API_URL = 'http://localhost:3500';

// Assets to pre-cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle same-origin requests (app assets)
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch from network and cache
        return fetch(request).then((response) => {
          // Only cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
    );
  } 
  // Handle API requests
  else if (url.href.startsWith(API_URL)) {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Network unavailable', offline: true }),
            { 
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
  }
});

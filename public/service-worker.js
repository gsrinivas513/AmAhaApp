/**
 * Service Worker - Offline support and caching
 * Located in public/service-worker.js
 */

const CACHE_NAME = 'amaha-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching resources');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker install error:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache successful API responses and assets
          if (
            event.request.url.includes('/api/') ||
            event.request.url.includes('/image/upload/') ||
            event.request.destination === 'image' ||
            event.request.destination === 'style' ||
            event.request.destination === 'script'
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        // Return cached version if available
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/');
          }

          return new Response('Offline - resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(
      // Sync pending analytics events when back online
      syncAnalyticsEvents()
    );
  }
});

async function syncAnalyticsEvents() {
  try {
    const db = await openIndexDB();
    const pendingEvents = await getPendingEvents(db);
    
    // Send pending events to server
    for (const event of pendingEvents) {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    }
    
    // Clear synced events from IndexDB
    await clearSyncedEvents(db);
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

function openIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AmahaDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingEvents(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingEvents'], 'readonly');
    const store = transaction.objectStore('pendingEvents');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function clearSyncedEvents(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingEvents'], 'readwrite');
    const store = transaction.objectStore('pendingEvents');
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

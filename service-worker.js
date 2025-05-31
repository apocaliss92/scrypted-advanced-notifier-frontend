self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js'
            ]);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return true;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registrato:', reg))
        .catch(err => console.error('Errore SW:', err));
}

self.addEventListener('push', function (event) {
    const data = event.data?.json() || {};

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notifica', {
            body: data.body || 'Testo della notifica',
            icon: data.icon || '/icons/icon-192x192.png',
            badge: data.badge || '/icons/badge.png',
            image: data.image, // 👉 anteprima grande
            actions: data.actions || [],
            data: data.url || '/' // URL da aprire
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data;
    event.waitUntil(clients.openWindow(url));
});
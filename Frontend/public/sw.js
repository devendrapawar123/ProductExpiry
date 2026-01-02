// public/sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      if (windowClients.length) {
        return windowClients[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// optional: listen for push or other events if you add server push in future

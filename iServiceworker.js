const CACHE_NAME = "PWA-v1";
const urlsToCache = [
  "/",
  "manifest.json",
  "index.html",
  "pages/home.html",
  "pages/yDay.html",
  "pages/history.html",
  "assets/style.css",
  "js/index.js",
  "js/sw-register.js",
  "js/indexedDb.js",
  "js/pages.js",
  "assets/img/logo.JPG",
  "assets/img/maskable_192x192.png",
  "assets/img/pwa-192x192.png",
  "assets/img/pwa-512x512.png",
  "assets/img/IMG_0109.JPG",
  "assets/img/day.jpg",
  "assets/img/night.jpg",
  "assets/img/icon.JPG",
  "assets/AndikaNewBasic/AndikaNewBasic-Bold.ttf",
  "assets/AndikaNewBasic/AndikaNewBasic-BoldItalic.ttf",
  "assets/AndikaNewBasic/AndikaNewBasic-Italic.ttf",
  "assets/AndikaNewBasic/AndikaNewBasic-Regular.ttf"
];
 
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then( cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
event.waitUntil(
    caches.keys().then(cacheNames => {
    return Promise.all(
        cacheNames.map(cacheName => {
        if (cacheName != CACHE_NAME) {
            console.log(`ServiceWorker: cache  ${cacheName}  dihapus`);
            return caches.delete(cacheName);
        }
        })
    );
    })
);
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.match(e.request).then(res => {
          const promise = fetch(e.request).then(nRes => {
            cache.put(e.request, nRes.clone())
            return nRes
          })
        return res || promise
        })
      })
  )
})

self.addEventListener('push', event => {
  let msg;
  if (event.data) {
    msg = event.data.text();
  } else {
    msg = 'Push message no payload';
  }
  const options = {
    body: msg,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Football', options)
  );
});

// self.addEventListener('notificationclick', function (event) {
//   if (!event.action) {
//     // Penguna menyentuh area notifikasi diluar action
//     console.log('Notification Click.');
//     return;
//   }
//   switch (event.action) {
//     case 'yes-action':
//       console.log('Pengguna memilih action yes.');
//       // buka tab baru
//       clients.openWindow('https://google.com');
//       break;
//     case 'no-action':
//       console.log('Pengguna memilih action no');
//       break;
//     default:
//       console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
//       break;
//   }
//   event.notification.close();
// });
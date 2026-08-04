const CACHE_NAME = "peppy-fashion-v2";

const urlsToCache = [
  "/peppy-fashion-v2/",
  "/peppy-fashion-v2/index.html",
  "/peppy-fashion-v2/shop.html",
  "/peppy-fashion-v2/cart.html",
  "/peppy-fashion-v2/checkout.html",
  "/peppy-fashion-v2/contact.html",
  "/peppy-fashion-v2/offline.html",

  "/peppy-fashion-v2/manifest.json",

  "/peppy-fashion-v2/assets/css/style.css",

  "/peppy-fashion-v2/assets/js/script.js",
  "/peppy-fashion-v2/assets/js/products.js",
  "/peppy-fashion-v2/assets/js/cart.js",
  "/peppy-fashion-v2/assets/js/pwa.js",

  "/peppy-fashion-v2/icons/icon-192.png",
  "/peppy-fashion-v2/icons/icon-512.png",

  "/peppy-fashion-v2/assets/images/logo/logo.png",
  "/peppy-fashion-v2/assets/images/banners/banner.jpg"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(urlsToCache);

    })

  );

  self.skipWaiting();

});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});
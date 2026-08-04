const CACHE_NAME = "peppy-fashion-v1";

const urlsToCache = [
  "/peppy-fashion-v2/",
  "/peppy-fashion-v2/index.html",
  "/peppy-fashion-v2/shop.html",
  "/peppy-fashion-v2/css/style.css",
  "/peppy-fashion-v2/js/script.js",
  "/peppy-fashion-v2/js/products.js",
  "/peppy-fashion-v2/icons/icon-192.png",
  "/peppy-fashion-v2/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
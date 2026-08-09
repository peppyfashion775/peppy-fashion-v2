/* ==========================================
   PEPPY FASHION V3
   SERVICE WORKER
========================================== */

const CACHE_NAME = "peppy-fashion-v3";

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

    /* BANNERS */
    "/peppy-fashion-v2/assets/images/banners/banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/mens-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/womens-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/kids-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/sports-banner.jpg"

];


/* ==========================================
   INSTALL
========================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

    self.skipWaiting();

});


/* ==========================================
   FETCH
========================================== */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request).then(response => {

            return response || fetch(event.request);

        })

    );

});


/* ==========================================
   ACTIVATE
========================================== */

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
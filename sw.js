/* ==========================================
   PEPPY FASHION V4
   SERVICE WORKER
========================================== */

const CACHE_NAME = "peppy-fashion-v4";

const urlsToCache = [

    "/peppy-fashion-v2/",
    "/peppy-fashion-v2/index.html",
    "/peppy-fashion-v2/shop.html",
    "/peppy-fashion-v2/cart.html",
    "/peppy-fashion-v2/checkout.html",
    "/peppy-fashion-v2/contact.html",
    "/peppy-fashion-v2/manifest.json",

    "/peppy-fashion-v2/assets/css/style.css",

    "/peppy-fashion-v2/assets/js/script.js",
    "/peppy-fashion-v2/assets/js/products.js",

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

        caches.open(CACHE_NAME).then(async cache => {

            for (const url of urlsToCache) {

                try {

                    await cache.add(url);

                } catch (error) {

                    console.warn(
                        "Could not cache:",
                        url
                    );

                }

            }

        })

    );

    self.skipWaiting();

});


/* ==========================================
   FETCH
   NETWORK FIRST FOR HTML + BANNERS
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    const isHTML =
        request.mode === "navigate" ||
        request.destination === "document";

    const isBanner =
        url.pathname.includes("/assets/images/banners/");

    if (isHTML || isBanner) {

        event.respondWith(

            fetch(request)
                .then(response => {

                    if (response && response.ok) {

                        const responseClone =
                            response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });

                    }

                    return response;

                })
                .catch(() => {

                    return caches.match(request);

                })

        );

        return;
    }


    /* ======================================
       OTHER FILES
       CACHE FIRST
    ====================================== */

    event.respondWith(

        caches.match(request).then(response => {

            return response || fetch(request);

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
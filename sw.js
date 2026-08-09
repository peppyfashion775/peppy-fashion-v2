/* ==========================================
PEPPY FASHION V6
SERVICE WORKER
========================================== */

const CACHE_NAME = "peppy-fashion-v6";


const urlsToCache = [

    "/peppy-fashion-v2/",
    "/peppy-fashion-v2/index.html",
    "/peppy-fashion-v2/shop.html",
    "/peppy-fashion-v2/cart.html",
    "/peppy-fashion-v2/checkout.html",
    "/peppy-fashion-v2/contact.html",
    "/peppy-fashion-v2/product-details.html",

    "/peppy-fashion-v2/style.css",
    "/peppy-fashion-v2/script.js",
    "/peppy-fashion-v2/products.js",

    "/peppy-fashion-v2/manifest.json",

    "/peppy-fashion-v2/assets/images/logo/logo.png",
    "/peppy-fashion-v2/assets/images/logo/icon-192.png",
    "/peppy-fashion-v2/assets/images/logo/icon-512.png",

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

        caches.open(CACHE_NAME)

            .then(async cache => {

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
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;


    if (request.method !== "GET") {
        return;
    }


    const url =
        new URL(request.url);


    /*
    Only handle our own website.
    */

    if (
        url.origin !== self.location.origin
    ) {
        return;
    }


    const isHTML =
        request.mode === "navigate" ||
        request.destination === "document";


    const isImage =
        request.destination === "image";


    /*
    HTML + images:
    NETWORK FIRST
    */

    if (
        isHTML ||
        isImage
    ) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (
                        response &&
                        response.ok
                    ) {

                        const clone =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        ).then(cache => {

                            cache.put(
                                request,
                                clone
                            );

                        });

                    }

                    return response;

                })

                .catch(() => {

                    return caches.match(
                        request
                    );

                })

        );

        return;

    }


    /*
    CSS / JS / manifest:
    CACHE FIRST
    */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(response => {

                        if (
                            response &&
                            response.ok
                        ) {

                            const clone =
                                response.clone();

                            caches.open(
                                CACHE_NAME
                            ).then(cache => {

                                cache.put(
                                    request,
                                    clone
                                );

                            });

                        }

                        return response;

                    });

            })

    );

});


/* ==========================================
ACTIVATE
========================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (
                            key !== CACHE_NAME
                        ) {

                            return caches.delete(
                                key
                            );

                        }

                    })

                );

            })

    );


    self.clients.claim();

});
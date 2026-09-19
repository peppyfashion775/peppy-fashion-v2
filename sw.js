/* ==========================================
   PEPPY FASHION V5
   SERVICE WORKER
   - Fresh JS/CSS loading
   - Old cache cleanup
   - HTML network-first
   - JS/CSS network-first
   - Google Apps Script API bypass
========================================== */

const CACHE_NAME = "peppy-fashion-v5";

const urlsToCache = [
    "/peppy-fashion-v2/",
    "/peppy-fashion-v2/index.html",
    "/peppy-fashion-v2/shop.html",
    "/peppy-fashion-v2/product.html",
    "/peppy-fashion-v2/cart.html",
    "/peppy-fashion-v2/checkout.html",
    "/peppy-fashion-v2/contact.html",
    "/peppy-fashion-v2/manifest.json",

    "/peppy-fashion-v2/assets/css/style.css",

    "/peppy-fashion-v2/assets/js/script.js",
    "/peppy-fashion-v2/assets/js/products.js",
    "/peppy-fashion-v2/assets/js/cart.js",

    "/peppy-fashion-v2/icons/icon-192.png",
    "/peppy-fashion-v2/icons/icon-512.png",

    "/peppy-fashion-v2/assets/images/logo/logo.png",

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
                        url,
                        error
                    );

                }

            }

        })

    );

    // Activate new service worker immediately
    self.skipWaiting();

});


/* ==========================================
   FETCH
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);


    /* ----------------------------------------
       NEVER CACHE GOOGLE APPS SCRIPT API
    ---------------------------------------- */

    if (
        url.hostname.includes("script.google.com") ||
        url.hostname.includes("googleusercontent.com")
    ) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })

        );

        return;
    }


    /* ----------------------------------------
       HTML
       NETWORK FIRST
    ---------------------------------------- */

    const isHTML =
        request.mode === "navigate" ||
        request.destination === "document";


    /* ----------------------------------------
       JS / CSS
       NETWORK FIRST
       Prevent old code from staying cached
    ---------------------------------------- */

    const isJavaScript =
        request.destination === "script" ||
        url.pathname.endsWith(".js");

    const isCSS =
        request.destination === "style" ||
        url.pathname.endsWith(".css");


    /* ----------------------------------------
       BANNERS
       NETWORK FIRST
    ---------------------------------------- */

    const isBanner =
        url.pathname.includes("/assets/images/banners/");


    if (
        isHTML ||
        isJavaScript ||
        isCSS ||
        isBanner
    ) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })

                .then(response => {

                    if (
                        response &&
                        response.ok
                    ) {

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


    /* ----------------------------------------
       OTHER FILES
       CACHE FIRST
    ---------------------------------------- */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request);

            })

    );

});


/* ==========================================
   ACTIVATE
========================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames.map(cacheName => {

                    // Delete every old Peppy Fashion cache
                    if (
                        cacheName !== CACHE_NAME &&
                        (
                            cacheName.startsWith(
                                "peppy-fashion-"
                            ) ||
                            cacheName.includes(
                                "peppy-fashion"
                            )
                        )
                    ) {

                        console.log(
                            "Deleting old cache:",
                            cacheName
                        );

                        return caches.delete(
                            cacheName
                        );

                    }

                })

            );

        })

    );


    // Take control of all open pages
    self.clients.claim();

});


/* ==========================================
   MESSAGE
   Allows manual cache refresh if needed
========================================== */

self.addEventListener("message", event => {

    if (
        event.data &&
        event.data.type === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});
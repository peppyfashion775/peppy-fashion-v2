/* ==========================================
   PEPPY FASHION V5
   SERVICE WORKER
========================================== */

const CACHE_NAME = "peppy-fashion-v6";


/* ==========================================
   FILES TO CACHE
========================================== */

const urlsToCache = [

    /* MAIN PAGES */

    "/peppy-fashion-v2/",
    "/peppy-fashion-v2/index.html",
    "/peppy-fashion-v2/shop.html",
    "/peppy-fashion-v2/product.html",
    "/peppy-fashion-v2/cart.html",
    "/peppy-fashion-v2/checkout.html",
    "/peppy-fashion-v2/contact.html",
    "/peppy-fashion-v2/wishlist.html",
    "/peppy-fashion-v2/account.html",
    "/peppy-fashion-v2/splash.html",
    "/peppy-fashion-v2/offline.html",


    /* PWA */

    "/peppy-fashion-v2/manifest.json",

    "/peppy-fashion-v2/icons/icon-192.png",
    "/peppy-fashion-v2/icons/icon-512.png",


    /* CSS */

    "/peppy-fashion-v2/assets/css/style.css",


    /* JAVASCRIPT */

    "/peppy-fashion-v2/assets/js/script.js",
    "/peppy-fashion-v2/assets/js/products.js",
    "/peppy-fashion-v2/assets/js/cart.js",
    "/peppy-fashion-v2/assets/js/pwa.js",


    /* LOGO */

    "/peppy-fashion-v2/assets/images/logo/logo.png",


    /* BANNERS */

    "/peppy-fashion-v2/assets/images/banners/banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/mens-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/womens-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/kids-banner.jpg",
    "/peppy-fashion-v2/assets/images/banners/sports-banner.jpg",


    /* PRODUCT IMAGES */

    "/peppy-fashion-v2/assets/images/products/bag-1.jpg",
    "/peppy-fashion-v2/assets/images/products/dress-1.jpg",
    "/peppy-fashion-v2/assets/images/products/hoodie-1.jpg",
    "/peppy-fashion-v2/assets/images/products/jersey-1.jpg",
    "/peppy-fashion-v2/assets/images/products/kids-1.jpg",
    "/peppy-fashion-v2/assets/images/products/panjabi-1.jpg",

    "/peppy-fashion-v2/assets/images/products/pant-1.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-2.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-3.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-4.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-5.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-6.jpg",
    "/peppy-fashion-v2/assets/images/products/pant-7.jpg",

    "/peppy-fashion-v2/assets/images/products/sharee-1.jpg",
    "/peppy-fashion-v2/assets/images/products/sharee-2.jpg",
    "/peppy-fashion-v2/assets/images/products/sharee-3.jpg",

    "/peppy-fashion-v2/assets/images/products/shirt-1.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-2.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-3.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-4.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-5.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-6.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-7.jpg",
    "/peppy-fashion-v2/assets/images/products/shirt-8.jpg",

    "/peppy-fashion-v2/assets/images/products/shoes-1.jpg",

    "/peppy-fashion-v2/assets/images/products/sunglass-1.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-2.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-3.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-4.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-5.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-6.jpg",
    "/peppy-fashion-v2/assets/images/products/sunglass-7.jpg",

    "/peppy-fashion-v2/assets/images/products/tshirt-1.jpg",

    "/peppy-fashion-v2/assets/images/products/watch-1.jpg",
    "/peppy-fashion-v2/assets/images/products/watch-2.jpg",
    "/peppy-fashion-v2/assets/images/products/watch-3.jpg"

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

    /*
       Activate the new service worker
       immediately.
    */

    self.skipWaiting();

});


/* ==========================================
   FETCH
   NETWORK FIRST FOR HTML
   AND BANNERS
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;


    /* Only handle GET requests */

    if (request.method !== "GET") {

        return;

    }


    const url = new URL(request.url);


    /*
       Ignore requests from
       other websites/domains.
    */

    if (
        url.origin !== self.location.origin
    ) {

        return;

    }


    /* ======================================
       HTML PAGES
       NETWORK FIRST
    ====================================== */

    const isHTML =
        request.mode === "navigate" ||
        request.destination === "document";


    /* ======================================
       BANNERS
       NETWORK FIRST
    ====================================== */

    const isBanner =
        url.pathname.includes(
            "/assets/images/banners/"
        );


    if (isHTML || isBanner) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (
                        response &&
                        response.ok
                    ) {

                        const responseClone =
                            response.clone();


                        caches.open(
                            CACHE_NAME
                        ).then(cache => {

                            cache.put(
                                request,
                                responseClone
                            );

                        });

                    }


                    return response;

                })


                .catch(() => {

                    return caches.match(
                        request
                    ).then(cachedResponse => {

                        if (cachedResponse) {

                            return cachedResponse;

                        }


                        /*
                           If an HTML page is
                           unavailable offline,
                           show offline page.
                        */

                        if (isHTML) {

                            return caches.match(
                                "/peppy-fashion-v2/offline.html"
                            );

                        }

                    });

                })

        );

        return;

    }


    /* ======================================
       OTHER FILES
       CACHE FIRST
    ====================================== */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(response => {

                        /*
                           Cache successful
                           same-origin responses.
                        */

                        if (
                            response &&
                            response.ok
                        ) {

                            const responseClone =
                                response.clone();


                            caches.open(
                                CACHE_NAME
                            ).then(cache => {

                                cache.put(
                                    request,
                                    responseClone
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

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    /*
                       Delete old Peppy
                       Fashion caches.
                    */

                    if (
                        key !== CACHE_NAME &&
                        key.startsWith(
                            "peppy-fashion-"
                        )
                    ) {

                        return caches.delete(
                            key
                        );

                    }

                })

            );

        })

    );


    /*
       Take control of all
       open pages immediately.
    */

    self.clients.claim();

});
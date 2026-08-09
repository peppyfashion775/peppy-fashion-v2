/* =====================================
PEPPY FASHION V6
PRODUCTS DATA
===================================== */

let products = [];

const API_URL =
"https://script.google.com/macros/s/AKfycbwbHxHS5GuRH4Lr-L5wTs8aRjXbdgK60CyM0muAjRvhUKZ-1IzeFBGq7y6an9d0Kmg_/exec";

const CACHE_KEY = "peppy_products_v6";


/* =====================================
LOAD PRODUCTS
===================================== */

async function loadProducts() {

    if (products.length > 0) {
        return products;
    }

    try {

        const cached =
            localStorage.getItem(CACHE_KEY);

        if (cached) {

            const cachedData =
                JSON.parse(cached);

            if (
                Array.isArray(cachedData) &&
                cachedData.length > 0
            ) {

                products = cachedData;

                /* Refresh in background */
                refreshProducts();

                return products;
            }

        }

    } catch (error) {

        localStorage.removeItem(CACHE_KEY);

    }


    return await refreshProducts();

}


/* =====================================
REFRESH PRODUCTS FROM GOOGLE SHEETS
===================================== */

async function refreshProducts() {

    try {

        const response =
            await fetch(
                API_URL + "?t=" + Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.products)
        ) {

            throw new Error(
                "Invalid product data"
            );

        }


        products =
            data.products.map(product => ({

                id:
                    Number(product.id),

                name:
                    String(product.name || "").trim(),

                category:
                    String(
                        product.category || "Others"
                    ).trim(),

                subCategory:
                    String(
                        product.subCategory || "All"
                    ).trim(),

                collection:
                    String(
                        product.collection || ""
                    ).trim(),

                price:
                    Number(product.price) || 0,

                oldPrice:
                    product.oldPrice !== "" &&
                    product.oldPrice !== null &&
                    product.oldPrice !== undefined
                        ? Number(product.oldPrice)
                        : null,

                discount:
                    Number(product.discount) || 0,

                image:
                    String(
                        product.image || ""
                    ).trim(),

                badge:
                    String(
                        product.badge || ""
                    ).trim(),

                stock:
                    Number(product.stock) || 0,

                featured:
                    String(
                        product.featured || ""
                    )
                    .trim()
                    .toLowerCase(),

                description:
                    String(
                        product.description || ""
                    ).trim(),

                sizes:
                    Array.isArray(product.sizes)
                        ? product.sizes
                        : []

            }));


        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(products)
        );


        return products;

    }


    catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        /*
        If fresh loading fails,
        use existing cached data.
        */

        try {

            const cached =
                localStorage.getItem(CACHE_KEY);

            if (cached) {

                products =
                    JSON.parse(cached);

                return products;

            }

        } catch (cacheError) {

            console.error(
                "Cache error:",
                cacheError
            );

        }


        products = [];

        return [];

    }

}


/* =====================================
GET PRODUCT BY ID
===================================== */

function getProductById(id) {

    return products.find(product =>
        Number(product.id) === Number(id)
    );

}


/* =====================================
GET PRODUCTS BY CATEGORY
===================================== */

function getProductsByCategory(category) {

    return products.filter(product =>

        String(product.category || "")
            .trim()
            .toLowerCase() ===

        String(category || "")
            .trim()
            .toLowerCase()

    );

}


/* =====================================
GET PRODUCTS BY SUB CATEGORY
===================================== */

function getProductsBySubCategory(
    category,
    subCategory
) {

    return products.filter(product =>

        String(product.category || "")
            .trim()
            .toLowerCase() ===

        String(category || "")
            .trim()
            .toLowerCase()

        &&

        String(product.subCategory || "")
            .trim()
            .toLowerCase() ===

        String(subCategory || "")
            .trim()
            .toLowerCase()

    );

}


/* =====================================
GET FEATURED PRODUCTS
===================================== */

function getFeaturedProducts() {

    return products.filter(product =>

        String(product.featured || "")
            .trim()
            .toLowerCase() === "yes"

    );

}


/* =====================================
GET COLLECTION PRODUCTS
===================================== */

function getCollectionProducts(
    collection
) {

    return products.filter(product =>

        String(product.collection || "")
            .trim()
            .toLowerCase() ===

        String(collection || "")
            .trim()
            .toLowerCase()

    );

}


/* =====================================
SEARCH ALL PRODUCTS
===================================== */

function searchAllProducts(keyword) {

    keyword =
        String(keyword || "")
            .trim()
            .toLowerCase();


    if (!keyword) {
        return products;
    }


    return products.filter(product => {

        return (

            String(product.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(product.category || "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(product.subCategory || "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(product.collection || "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(product.badge || "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(product.description || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

}


/* =====================================
CLEAR PRODUCT CACHE
===================================== */

function clearProductCache() {

    localStorage.removeItem(
        CACHE_KEY
    );

}
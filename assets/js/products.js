/* =====================================
   PEPPY FASHION V6
   PRODUCTS
===================================== */

let products = [];
let productsLoadPromise = null;

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyJQKb2dFFZvo765SCMbK_y3cef2opsujzzzJr4HsuvZbSBgsU3fZ-06qgDATHVr4nb3A/exec";

const CACHE_KEY = "peppy_products_v10";

function productNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const text = String(value ?? "").trim().replace(/,/g, "").replace(/[৳$%]/g, "");
    const direct = Number(text);
    if (Number.isFinite(direct)) return direct;
    const match = text.match(/-?\d+(?:\.\d+)?/);
    const extracted = match ? Number(match[0]) : 0;
    return Number.isFinite(extracted) ? extracted : 0;
}

function syncCartProductPrices() {
    try {
        const raw = localStorage.getItem("peppyCart");
        if (!raw) return;
        const cart = JSON.parse(raw);
        if (!Array.isArray(cart)) return;
        let changed = false;
        cart.forEach(item => {
            const p = products.find(x => String(x.id) === String(item.id));
            if (p && productNumber(item.price) !== p.price) {
                item.price = p.price;
                changed = true;
            }
        });
        if (changed) localStorage.setItem("peppyCart", JSON.stringify(cart));
    } catch (e) {
        console.warn("Unable to sync cart prices:", e);
    }
}



/* =====================================
   LOAD PRODUCTS
===================================== */
async function loadProducts(){

    if (products.length > 0) {
        return products;
    }

    if (productsLoadPromise) {
        return productsLoadPromise;
    }

    let cachedProducts = localStorage.getItem(CACHE_KEY);

    if (cachedProducts) {
        try {
            products = JSON.parse(cachedProducts);

            // Refresh in the background. Cached data is used immediately so
            // the page does not wait for Google Apps Script on every visit.
            refreshProducts().then(() => {
                if (typeof applyFilters === "function" &&
                    document.getElementById("productContainer")) {
                    applyFilters();
                }
                if (typeof calculateCheckout === "function" &&
                    document.getElementById("checkoutSubtotal")) {
                    calculateCheckout();
                }
            });

            return products;
        } catch (error) {
            console.error("Invalid cached products:", error);
            localStorage.removeItem(CACHE_KEY);
        }
    }

    productsLoadPromise = refreshProducts();

    try {
        return await productsLoadPromise;
    } finally {
        productsLoadPromise = null;
    }
}


/* =====================================
   REFRESH PRODUCTS
===================================== */

async function refreshProducts(){

    try{

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        let response;
        try {
            response = await fetch(GOOGLE_SCRIPT_URL, {
                cache: "no-store",
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }



        if(!response.ok){

            throw new Error(
                "Failed to load products"
            );

        }



        const data =
        await response.json();



        if(

            data.success &&

            Array.isArray(data.products)

        ){

            products =
            data.products.map(product => ({

                id:
                String(product.id ?? "").trim(),

                name:
                product.name || "",

                category:
                product.category || "Others",

                subCategory:
                product.subCategory || "All",

                collection:
                product.collection || "",

                price:
                productNumber(product.price),

                oldPrice:
                product.oldPrice
                ? productNumber(product.oldPrice)
                : null,

                discount:
                productNumber(product.discount),

                image:
                product.image || "",

                badge:
                product.badge || "",

                stock:
                productNumber(product.stock),

                featured:
                String(product.featured)
                .toLowerCase(),

                description:
                product.description || "",

                sizes:

                Array.isArray(product.sizes)

                ? product.sizes

                : []

            }));



            localStorage.setItem(CACHE_KEY, JSON.stringify(products));
            syncCartProductPrices();

        }



        return products;

    }

    catch(error){

        console.error(error);

        return [];

    }

}

/* =====================================
   GET PRODUCT BY ID
===================================== */

function getProductById(id){

    return products.find(product =>

        String(product.id).trim() === String(id).trim()

    );

}



/* =====================================
   GET PRODUCTS BY CATEGORY
===================================== */

function getProductsByCategory(category){

    return products.filter(product =>

        String(product.category)
        .toLowerCase() ===
        String(category)
        .toLowerCase()

    );

}



/* =====================================
   GET FEATURED PRODUCTS
===================================== */

function getFeaturedProducts(){

    return products.filter(product =>

        String(product.featured)
        .toLowerCase() === "yes"

    );

}

/* =====================================
   GET COLLECTION PRODUCTS
===================================== */

function getCollectionProducts(collection){

    return products.filter(product =>

        String(product.collection)
        .toLowerCase() ===
        String(collection)
        .toLowerCase()

    );

}



/* =====================================
   SEARCH PRODUCTS
===================================== */

function searchAllProducts(keyword){

    keyword = String(keyword).toLowerCase();

    return products.filter(product =>

        String(product.name)
        .toLowerCase()
        .includes(keyword)

        ||

        String(product.category)
        .toLowerCase()
        .includes(keyword)

        ||

        String(product.subCategory)
        .toLowerCase()
        .includes(keyword)

        ||

        String(product.collection)
        .toLowerCase()
        .includes(keyword)

    );

}


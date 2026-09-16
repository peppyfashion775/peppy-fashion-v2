/* =====================================
   PEPPY FASHION V6
   PRODUCTS
===================================== */

let products = [];

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyJQKb2dFFZvo765SCMbK_y3cef2opsujzzzJr4HsuvZbSBgsU3fZ-06qgDATHVr4nb3A/exec";

const CACHE_KEY = "peppy_products_v7";

function productNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const text = String(value ?? "").trim().replace(/,/g, "").replace(/[৳$%]/g, "");
    const n = Number(text);
    return Number.isFinite(n) ? n : 0;
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

    if(products.length > 0){
        return products;
    }

    let cachedProducts =
        localStorage.getItem(CACHE_KEY);

    if(cachedProducts){

        try{

            products =
                JSON.parse(cachedProducts);

            // Refresh in background
            refreshProducts().then(() => {

                // Re-render shop after fresh data arrives
                if(
                    typeof applyFilters === "function" &&
                    document.getElementById("productContainer")
                ){
                    applyFilters();
                }

            });

            return products;

        }

        catch(error){

            console.error(
                "Invalid cached products:",
                error
            );

            localStorage.removeItem(CACHE_KEY);

        }

    }

    return await refreshProducts();

}


/* =====================================
   REFRESH PRODUCTS
===================================== */

async function refreshProducts(){

    try{

        const response =
        await fetch(GOOGLE_SCRIPT_URL, { cache: "no-store" });



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
                Number(product.id),

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

        Number(product.id) === Number(id)

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


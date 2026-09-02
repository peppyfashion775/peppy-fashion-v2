/* =====================================
   PEPPY FASHION V6
   PRODUCTS
===================================== */

let products = [];

const API_URL =
"https://script.google.com/macros/s/AKfycbwbHxHS5GuRH4Lr-L5wTs8aRjXbdgK60CyM0muAjRvhUKZ-1IzeFBGq7y6an9d0Kmg_/exec";

const CACHE_KEY = "peppy_products";



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
        await fetch(API_URL);



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
                Number(product.price) || 0,

                oldPrice:
                product.oldPrice
                ? Number(product.oldPrice)
                : null,

                discount:
                Number(product.discount) || 0,

                image:
                product.image || "",

                badge:
                product.badge || "",

                stock:
                Number(product.stock) || 0,

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



            localStorage.setItem(

                CACHE_KEY,

                JSON.stringify(products)

            );

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


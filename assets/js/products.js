/* =====================================
   PEPPY FASHION V6
   PRODUCTS
===================================== */

let products = [];


/* =====================================
   GOOGLE APPS SCRIPT API
===================================== */

const API_URL =
"https://script.google.com/macros/s/AKfycbwbHxHS5GuRH4Lr-L5wTs8aRjXbdgK60CyM0muAjRvhUKZ-1IzeFBGq7y6an9d0Kmg_/exec";


/* =====================================
   LOCAL STORAGE CACHE
===================================== */

const CACHE_KEY =
"peppy_products";

const CACHE_VERSION =
"v3";

const CACHE_VERSION_KEY =
"peppy_products_cache_version";


/* =====================================
   NORMALIZE CATEGORY / TEXT
===================================== */

function normalizeProductValue(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");

}


/* =====================================
   NORMALIZE IMAGE PATH
===================================== */

function normalizeProductImage(image) {

    if (
        image === null ||
        image === undefined
    ) {

        return "";

    }


    let imagePath =
        String(image).trim();


    if (!imagePath) {

        return "";

    }


    /*
       Convert Windows-style
       backslashes to web slashes.
    */

    imagePath =
        imagePath.replace(
            /\\/g,
            "/"
        );


    /*
       Full external image URL.
    */

    if (
        /^https?:\/\//i.test(
            imagePath
        )
    ) {

        return imagePath;

    }


    /*
       Data URL.
    */

    if (
        /^data:/i.test(
            imagePath
        )
    ) {

        return imagePath;

    }


    /*
       Remove leading ./ 
    */

    imagePath =
        imagePath.replace(
            /^\.\/+/,
            ""
        );


    /*
       If Google Sheet contains only:

       shirt-1.jpg

       convert it to:

       assets/images/products/shirt-1.jpg
    */

    if (
        !imagePath.includes("/")
    ) {

        return (
            "assets/images/products/" +
            imagePath
        );

    }


    /*
       Existing relative path.

       Example:

       assets/images/products/shirt-1.jpg

       stays unchanged.
    */

    return imagePath;

}


/* =====================================
   NORMALIZE SIZES
===================================== */

function normalizeProductSizes(
    sizes
) {

    /*
       If API already returns an array.
    */

    if (
        Array.isArray(sizes)
    ) {

        return sizes
            .map(
                size =>
                    String(size).trim()
            )
            .filter(Boolean);

    }


    /*
       Google Sheet normally returns
       something like:

       S,M,L,XL,XXL
    */

    if (
        sizes === null ||
        sizes === undefined
    ) {

        return [];

    }


    return String(sizes)
        .split(",")
        .map(
            size =>
                size.trim()
        )
        .filter(Boolean);

}


/* =====================================
   NORMALIZE SINGLE PRODUCT
===================================== */

function normalizeProduct(
    product
) {

    if (
        !product ||
        typeof product !== "object"
    ) {

        return null;

    }


    /*
       Support both:

       subCategory

       and:

       subcategory
    */

    const rawSubCategory =
        product.subCategory !== undefined
            ? product.subCategory
            : product.subcategory;


    const normalizedProduct = {

        /* PRODUCT ID */

        id:
            String(
                product.id ?? ""
            ).trim(),


        /* PRODUCT NAME */

        name:
            normalizeProductValue(
                product.name
            ),


        /* MAIN CATEGORY */

        category:
            normalizeProductValue(
                product.category
            ),


        /* SUB CATEGORY */

        subCategory:
            normalizeProductValue(
                rawSubCategory
            ),


        /* COLLECTION */

        collection:
            normalizeProductValue(
                product.collection
            ),


        /* PRICE */

        price:
            Number(
                String(
                    product.price ?? 0
                ).replace(
                    /,/g,
                    ""
                )
            ) || 0,


        /* OLD PRICE */

        oldPrice:

            product.oldPrice === "" ||
            product.oldPrice === null ||
            product.oldPrice === undefined

                ? null

                : Number(
                    String(
                        product.oldPrice
                    ).replace(
                        /,/g,
                        ""
                    )
                ) || null,


        /* DISCOUNT */

        discount:
            Number(
                String(
                    product.discount ?? 0
                ).replace(
                    /,/g,
                    ""
                )
            ) || 0,


        /* IMAGE */

        image:
            normalizeProductImage(
                product.image
            ),


        /* BADGE */

        badge:
            normalizeProductValue(
                product.badge
            ),


        /* STOCK */

        stock:
            Number(
                String(
                    product.stock ?? 0
                ).replace(
                    /,/g,
                    ""
                )
            ) || 0,


        /* FEATURED */

        featured:
            String(
                product.featured ?? ""
            )
            .trim()
            .toLowerCase(),


        /* DESCRIPTION */

        description:
            normalizeProductValue(
                product.description
            ),


        /* SIZES */

        sizes:
            normalizeProductSizes(
                product.sizes
            )

    };


    /*
       Safe fallback for missing
       main category.
    */

    if (
        !normalizedProduct.category
    ) {

        normalizedProduct.category =
            "Others";

    }


    /*
       Safe fallback for missing
       subcategory.
    */

    if (
        !normalizedProduct.subCategory
    ) {

        normalizedProduct.subCategory =
            "All";

    }


    return normalizedProduct;

}


/* =====================================
   NORMALIZE PRODUCT LIST
===================================== */

function normalizeProducts(
    productList
) {

    if (
        !Array.isArray(productList)
    ) {

        return [];

    }


    return productList
        .map(
            product =>
                normalizeProduct(product)
        )
        .filter(
            product =>
                product !== null
        );

}


/* =====================================
   LOAD PRODUCTS
===================================== */

async function loadProducts() {

    /*
       If products are already loaded,
       return them.
    */

    if (
        Array.isArray(products) &&
        products.length > 0
    ) {

        return products;

    }


    /*
       Read cached products first.

       Cache is only a fallback.
    */

    const savedVersion =
        localStorage.getItem(
            CACHE_VERSION_KEY
        );


    if (
        savedVersion === CACHE_VERSION
    ) {

        const cachedProducts =
            localStorage.getItem(
                CACHE_KEY
            );


        if (cachedProducts) {

            try {

                const parsed =
                    JSON.parse(
                        cachedProducts
                    );


                if (
                    Array.isArray(parsed)
                ) {

                    products =
                        normalizeProducts(
                            parsed
                        );

                }

            }

            catch(error) {

                console.warn(
                    "Invalid product cache:",
                    error
                );


                localStorage.removeItem(
                    CACHE_KEY
                );

            }

        }

    }


    /*
       Always try to get fresh data
       from Google Apps Script.
    */

    const freshProducts =
        await refreshProducts();


    /*
       Fresh data successfully loaded.
    */

    if (
        Array.isArray(
            freshProducts
        ) &&
        freshProducts.length > 0
    ) {

        return freshProducts;

    }


    /*
       API failed.

       Use cached products as fallback.
    */

    if (
        Array.isArray(products) &&
        products.length > 0
    ) {

        console.warn(
            "Using cached products because fresh products could not be loaded."
        );


        return products;

    }


    return [];

}


/* =====================================
   REFRESH PRODUCTS
===================================== */

async function refreshProducts() {

    try {

        /*
           Add timestamp to prevent
           stale browser/proxy response.
        */

        const separator =
            API_URL.includes("?")
                ? "&"
                : "?";


        const requestURL =
            API_URL +
            separator +
            "_=" +
            Date.now();


        const response =
            await fetch(
                requestURL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Product API request failed. HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        /*
           Validate API structure.
        */

        if (
            !data ||
            !Array.isArray(
                data.products
            )
        ) {

            throw new Error(
                "Invalid product API response."
            );

        }


        /*
           Convert API products into
           clean frontend products.
        */

        const freshProducts =
            normalizeProducts(
                data.products
            );


        /*
           Replace global product list.
        */

        products =
            freshProducts;


        /*
           Save latest successful data.
        */

        try {

            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify(
                    products
                )
            );


            localStorage.setItem(
                CACHE_VERSION_KEY,
                CACHE_VERSION
            );

        }

        catch(cacheError) {

            console.warn(
                "Could not save product cache:",
                cacheError
            );

        }


        console.log(
            "Peppy Fashion:",
            products.length,
            "products loaded."
        );


        return products;

    }

    catch(error) {

        console.error(
            "Unable to refresh products:",
            error
        );


        return [];

    }

}


/* =====================================
   FORCE REFRESH
===================================== */

async function forceRefreshProducts() {

    try {

        /*
           Clear cached products.
        */

        localStorage.removeItem(
            CACHE_KEY
        );


        /*
           Clear current products.
        */

        products = [];


        /*
           Get fresh API data.
        */

        return await refreshProducts();

    }

    catch(error) {

        console.error(
            "Force refresh failed:",
            error
        );


        return [];

    }

}


/* =====================================
   GET PRODUCT BY ID
===================================== */

function getProductById(
    id
) {

    if (
        !Array.isArray(products)
    ) {

        return undefined;

    }


    const target =
        String(id).trim();


    return products.find(
        product =>

            String(
                product.id
            ).trim() === target

    );

}


/* =====================================
   GET PRODUCTS BY MAIN CATEGORY
===================================== */

function getProductsByCategory(
    category
) {

    const target =
        normalizeProductValue(
            category
        )
        .toLowerCase();


    /*
       All categories.
    */

    if (
        target === "all"
    ) {

        return Array.isArray(products)
            ? [...products]
            : [];

    }


    return products.filter(
        product =>

            normalizeProductValue(
                product.category
            )
            .toLowerCase() ===
            target

    );

}


/* =====================================
   GET PRODUCTS BY SUBCATEGORY
===================================== */

function getProductsBySubCategory(
    category,
    subCategory
) {

    const targetCategory =
        normalizeProductValue(
            category
        )
        .toLowerCase();


    const targetSubCategory =
        normalizeProductValue(
            subCategory
        )
        .toLowerCase();


    /*
       If main category is All,
       return all products.
    */

    if (
        targetCategory === "all"
    ) {

        return Array.isArray(products)
            ? [...products]
            : [];

    }


    return products.filter(
        product => {

            const productCategory =
                normalizeProductValue(
                    product.category
                )
                .toLowerCase();


            const productSubCategory =
                normalizeProductValue(
                    product.subCategory
                )
                .toLowerCase();


            /*
               Main category must match.
            */

            if (
                productCategory !==
                targetCategory
            ) {

                return false;

            }


            /*
               All subcategories.
            */

            if (
                targetSubCategory ===
                "all"
            ) {

                return true;

            }


            /*
               Specific subcategory.
            */

            return (
                productSubCategory ===
                targetSubCategory
            );

        }
    );

}


/* =====================================
   GET FEATURED PRODUCTS
===================================== */

function getFeaturedProducts() {

    return products.filter(
        product =>

            String(
                product.featured
            )
            .trim()
            .toLowerCase() ===
            "yes"

    );

}


/* =====================================
   GET COLLECTION PRODUCTS
===================================== */

function getCollectionProducts(
    collection
) {

    const target =
        normalizeProductValue(
            collection
        )
        .toLowerCase();


    return products.filter(
        product =>

            normalizeProductValue(
                product.collection
            )
            .toLowerCase() ===
            target

    );

}


/* =====================================
   SEARCH ALL PRODUCTS
===================================== */

function searchAllProducts(
    keyword
) {

    const search =
        normalizeProductValue(
            keyword
        )
        .toLowerCase();


    /*
       Empty search returns all products.
    */

    if (!search) {

        return Array.isArray(products)
            ? [...products]
            : [];

    }


    return products.filter(
        product => {

            return (

                normalizeProductValue(
                    product.name
                )
                .toLowerCase()
                .includes(search)

                ||

                normalizeProductValue(
                    product.category
                )
                .toLowerCase()
                .includes(search)

                ||

                normalizeProductValue(
                    product.subCategory
                )
                .toLowerCase()
                .includes(search)

                ||

                normalizeProductValue(
                    product.collection
                )
                .toLowerCase()
                .includes(search)

                ||

                normalizeProductValue(
                    product.badge
                )
                .toLowerCase()
                .includes(search)

            );

        }
    );

}


/* =====================================
   GET ALL PRODUCTS
===================================== */

function getAllProducts() {

    return Array.isArray(products)
        ? [...products]
        : [];

}


/* =====================================
   DEBUG PRODUCT DATA
===================================== */

function debugProductCategories() {

    if (
        !Array.isArray(products)
    ) {

        console.log(
            "Products are not loaded."
        );

        return;

    }


    console.table(

        products.map(
            product => ({

                id:
                    product.id,

                name:
                    product.name,

                category:
                    product.category,

                subCategory:
                    product.subCategory,

                image:
                    product.image,

                stock:
                    product.stock

            })
        )

    );

}


/* =====================================
   GLOBAL FUNCTIONS
===================================== */

window.loadProducts =
    loadProducts;


window.refreshProducts =
    refreshProducts;


window.forceRefreshProducts =
    forceRefreshProducts;


window.getProductById =
    getProductById;


window.getProductsByCategory =
    getProductsByCategory;


window.getProductsBySubCategory =
    getProductsBySubCategory;


window.getFeaturedProducts =
    getFeaturedProducts;


window.getCollectionProducts =
    getCollectionProducts;


window.searchAllProducts =
    searchAllProducts;


window.getAllProducts =
    getAllProducts;


window.debugProductCategories =
    debugProductCategories;


/* =====================================
   READY
===================================== */

console.log(
    "Peppy Fashion products.js loaded successfully."
);
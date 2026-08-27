/* =====================================
   PEPPY FASHION
   MAIN SCRIPT + SEO
===================================== */

let selectedMainCategory = "All";
let selectedSubCategory = "All";


/* =====================================
   CATEGORY CONFIGURATION
===================================== */

const categoryConfig = {

    Men: [
        "All",
        "Shirts",
        "T-Shirts",
        "Pants",
        "Panjabi",
        "Polo",
        "Hoodies",
        "Jackets",
        "Shoes",
        "Watches",
        "Sunglasses",
        "Accessories"
    ],

    Women: [
        "All",
        "One Piece",
        "Three Piece",
        "Sharee",
        "Burkha",
        "Tops",
        "Pants",
        "Stylish Dress",
        "Bags",
        "Shoes",
        "Sunglasses",
        "Watches",
        "Accessories"
    ],

    Kids: [
        "All",
        "Dress",
        "Shirts",
        "T-Shirts",
        "Pants",
        "Panjabi",
        "Shoes",
        "Accessories"
    ],

    Sports: [
        "All",
        "Jersey",
        "Shoes",
        "Shorts",
        "Accessories"
    ]

};


/* =====================================
   MOBILE MENU
===================================== */

function toggleMenu() {

    const nav =
        document.querySelector(".navbar");

    if (!nav) return;

    if (nav.style.display === "flex") {

        nav.style.display = "none";

    } else {

        nav.style.display = "flex";

    }

}


/* =====================================
   CLOSE MENU WHEN CLICK OUTSIDE
===================================== */

document.addEventListener(
    "click",
    function (e) {

        const nav =
            document.querySelector(".navbar");

        const menuBtn =
            document.querySelector(".menu-btn");

        if (!nav || !menuBtn) return;

        if (
            window.innerWidth <= 768 &&
            nav.style.display === "flex" &&
            !nav.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {

            nav.style.display = "none";

        }

    }
);


/* =====================================
   CATEGORY VALUE NORMALIZER
===================================== */

function normalizeCategory(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


/* =====================================
   MAIN CATEGORY
===================================== */

function changeCategory(category, button) {

    selectedMainCategory =
        String(category || "All").trim();

    selectedSubCategory = "All";


    document
        .querySelectorAll(".category-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    renderSubCategories();

    applyFilters();

}


/* =====================================
   SUB CATEGORY
===================================== */

function renderSubCategories() {

    const area =
        document.getElementById(
            "subCategoryContainer"
        );

    if (!area) return;


    area.innerHTML = "";


    if (
        normalizeCategory(
            selectedMainCategory
        ) === "all"
    ) {

        area.style.display = "none";

        return;

    }


    const config =
        categoryConfig[
            selectedMainCategory
        ];


    if (!config) {

        area.style.display = "none";

        return;

    }


    area.style.display = "flex";


    config.forEach(sub => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "subcategory-btn";


        if (
            normalizeCategory(sub) ===
            normalizeCategory(
                selectedSubCategory
            )
        ) {

            button.classList.add(
                "active"
            );

        }


        button.textContent = sub;


        button.addEventListener(
            "click",
            function () {

                changeSubCategory(
                    sub,
                    button
                );

            }
        );


        area.appendChild(button);

    });

}


/* =====================================
   CHANGE SUB CATEGORY
===================================== */

function changeSubCategory(
    sub,
    button
) {

    selectedSubCategory =
        String(sub || "All").trim();


    document
        .querySelectorAll(
            ".subcategory-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    applyFilters();

}


/* =====================================
   APPLY FILTERS
===================================== */

function applyFilters() {

    let filtered =
        Array.isArray(products)
            ? [...products]
            : [];


    const selectedCategory =
        normalizeCategory(
            selectedMainCategory
        );


    const selectedSub =
        normalizeCategory(
            selectedSubCategory
        );


    /* =================================
       MAIN CATEGORY FILTER
    ================================= */

    if (
        selectedCategory !== "all"
    ) {

        filtered =
            filtered.filter(product => {

                return (
                    normalizeCategory(
                        product.category
                    ) ===
                    selectedCategory
                );

            });

    }


    /* =================================
       SUB CATEGORY FILTER
    ================================= */

    if (
        selectedCategory !== "all" &&
        selectedSub !== "all"
    ) {

        filtered =
            filtered.filter(product => {

                return (
                    normalizeCategory(
                        product.subCategory
                    ) ===
                    selectedSub
                );

            });

    }


    /* =================================
       SEARCH FILTER
    ================================= */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (
        searchInput &&
        searchInput.value.trim() !== ""
    ) {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();


        filtered =
            filtered.filter(product => {

                return (

                    normalizeCategory(
                        product.name
                    ).includes(keyword)

                    ||

                    normalizeCategory(
                        product.category
                    ).includes(keyword)

                    ||

                    normalizeCategory(
                        product.subCategory
                    ).includes(keyword)

                    ||

                    normalizeCategory(
                        product.collection
                    ).includes(keyword)

                    ||

                    normalizeCategory(
                        product.badge
                    ).includes(keyword)

                );

            });

    }


    /* =================================
       SORT
    ================================= */

    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (sort) {

        switch (sort.value) {

            case "low":

                filtered.sort(
                    (a, b) =>
                        Number(a.price || 0) -
                        Number(b.price || 0)
                );

                break;


            case "high":

                filtered.sort(
                    (a, b) =>
                        Number(b.price || 0) -
                        Number(a.price || 0)
                );

                break;


            case "name":

                filtered.sort(
                    (a, b) =>
                        String(a.name || "")
                            .localeCompare(
                                String(
                                    b.name || ""
                                )
                            )
                );

                break;

        }

    }


    /* =================================
       DISPLAY RESULT
    ================================= */

    displayProducts(filtered);

}


/* =====================================
   SEARCH
===================================== */

function searchProducts() {

    applyFilters();

}


/* =====================================
   SORT
===================================== */

function sortProducts() {

    applyFilters();

}


/* =====================================
   DISPLAY PRODUCTS
===================================== */

function displayProducts(
    productList = products
) {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (!container) return;


    if (
        !Array.isArray(productList) ||
        productList.length === 0
    ) {

        container.innerHTML = `

<div class="empty-products">

    <h2>No Products Found</h2>

    <p>
        Try another category or search.
    </p>

</div>

`;

        return;

    }


    container.innerHTML = "";


    productList.forEach(product => {


        let priceHTML = `

<h3 class="price">
    ৳${product.price}
</h3>

`;


        if (product.oldPrice) {

            priceHTML = `

<div class="price-group">

    <span class="new-price">
        ৳${product.price}
    </span>

    <span class="old-price">
        ৳${product.oldPrice}
    </span>

    <span class="discount">
        -${product.discount}%
    </span>

</div>

`;

        }


        let stockHTML = "";


        if (
            Number(product.stock) <= 0
        ) {

            stockHTML = `

<span class="out-stock">
    Out of Stock
</span>

`;

        }


        container.innerHTML += `

<article class="product-card">

    <div class="product-image">

        <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
        >

    </div>


    <div class="product-info">


        ${
            product.badge

            ?

            `<span class="badge">
                ${escapeHTML(product.badge)}
            </span>`

            :

            ""
        }


        <h3>

            ${escapeHTML(product.name)}

        </h3>


        <p class="category">

            ${escapeHTML(product.category)}
            &gt;
            ${escapeHTML(product.subCategory)}

        </p>


        ${priceHTML}


        ${stockHTML}


        <div class="product-buttons">


            <button
                class="btn"
                type="button"
                onclick="addToCart(${product.id})"
                ${
                    Number(product.stock) <= 0
                        ? "disabled"
                        : ""
                }
            >

                Add To Cart

            </button>


            <a
                href="product.html?id=${encodeURIComponent(product.id)}"
                class="btn btn-secondary"
            >

                View Details

            </a>


        </div>


    </div>

</article>

`;

    });

}


/* =====================================
   FEATURED PRODUCTS
===================================== */

function displayFeaturedProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (!container) return;


    const featured =
        Array.isArray(products)
            ? products.filter(product =>

                normalizeCategory(
                    product.featured
                ) === "yes"

            )
            : [];


    displayProducts(featured);

}

/* =====================================
   PRODUCT SEO HELPERS
===================================== */

function setMetaContent(
    attribute,
    value
) {

    if (!value) return;


    let element =
        document.querySelector(
            `meta[${attribute}]`
        );


    if (!element) {

        element =
            document.createElement("meta");

        const parts =
            attribute.split("=");

        if (parts.length === 2) {

            element.setAttribute(
                parts[0],
                parts[1]
            );

        }

        document.head.appendChild(
            element
        );

    }


    element.setAttribute(
        "content",
        value
    );

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   PRODUCT JSON-LD
===================================== */

function createProductSchema(product) {

    if (!product) return;


    const existing =
        document.getElementById(
            "product-schema"
        );


    if (existing) {

        existing.remove();

    }


    const schema =
        document.createElement("script");


    schema.type =
        "application/ld+json";


    schema.id =
        "product-schema";


    schema.textContent =
        JSON.stringify({

            "@context":
                "https://schema.org",

            "@type":
                "Product",

            name:
                product.name || "",

            image:
                product.image
                    ? [product.image]
                    : [],

            description:
                product.description || "",

            sku:
                String(product.id || ""),

            category:
                product.category || "",

            offers: {

                "@type":
                    "Offer",

                priceCurrency:
                    "BDT",

                price:
                    Number(
                        product.price || 0
                    ),

                availability:
                    Number(
                        product.stock || 0
                    ) > 0

                        ?

                        "https://schema.org/InStock"

                        :

                        "https://schema.org/OutOfStock"

            }

        });


    document.head.appendChild(
        schema
    );

}


/* =====================================
   PRODUCT PAGE SEO
===================================== */

function updateProductSEO(product) {

    if (!product) return;


    const title =
        `${product.name} | Peppy Fashion`;


    const description =
        product.description ||

        `${product.name} available at Peppy Fashion Bangladesh.`;


    document.title =
        title;


    setMetaContent(
        'name="description"',
        description
    );


    setMetaContent(
        'property="og:title"',
        title
    );


    setMetaContent(
        'property="og:description"',
        description
    );


    if (product.image) {

        setMetaContent(
            'property="og:image"',
            product.image
        );

    }


    createProductSchema(
        product
    );

}


/* =====================================
   FIND PRODUCT BY ID
===================================== */

function findProductById(id) {

    if (
        !Array.isArray(products)
    ) {

        return null;

    }


    const target =
        String(id);


    return products.find(
        product =>
            String(product.id) ===
            target
    ) || null;

}


/* =====================================
   LOAD SINGLE PRODUCT
===================================== */

async function loadSingleProduct() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        return null;

    }


    let product =
        findProductById(
            productId
        );


    /* If products are not loaded yet,
       try loading them */

    if (!product) {

        try {

            if (
                typeof loadProducts ===
                "function"
            ) {

                await loadProducts();

            }

        } catch (error) {

            console.error(
                "Unable to load products:",
                error
            );

        }


        product =
            findProductById(
                productId
            );

    }


    return product;

}


/* =====================================
   RENDER SINGLE PRODUCT
===================================== */

function renderSingleProduct(
    product
) {

    if (!product) {

        const container =
            document.getElementById(
                "productDetails"
            );


        if (container) {

            container.innerHTML = `

<div class="empty-products">

    <h2>Product Not Found</h2>

    <p>
        The requested product
        could not be found.
    </p>

    <a
        href="shop.html"
        class="btn"
    >
        Back To Shop
    </a>

</div>

`;

        }

        return;

    }


    updateProductSEO(
        product
    );


    const container =
        document.getElementById(
            "productDetails"
        );


    if (!container) return;


    const stock =
        Number(product.stock || 0);


    const sizes =
        String(
            product.sizes || ""
        )
        .split(",")
        .map(size => size.trim())
        .filter(Boolean);


    const sizeHTML =
        sizes.length > 0

            ?

            `

<div class="product-sizes">

    <label>
        Select Size
    </label>

    <div class="size-options">

        ${sizes.map(size => `

            <button
                type="button"
                class="size-btn"
                data-size="${escapeHTML(size)}"
            >
                ${escapeHTML(size)}
            </button>

        `).join("")}

    </div>

</div>

`

            :

            "";


    container.innerHTML = `

<div class="single-product">

    <div class="single-product-image">

        <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
        >

    </div>


    <div class="single-product-info">


        ${
            product.badge

                ?

            `

            <span class="badge">

                ${escapeHTML(
                    product.badge
                )}

            </span>

            `

                :

            ""
        }


        <h1>

            ${escapeHTML(
                product.name
            )}

        </h1>


        <p class="category">

            ${escapeHTML(
                product.category
            )}

            &gt;

            ${escapeHTML(
                product.subCategory
            )}

        </p>


        <div class="single-price">

            <strong>

                ৳${product.price}

            </strong>


            ${
                product.oldPrice

                    ?

                `

                <del>
                    ৳${product.oldPrice}
                </del>

                `

                    :

                ""
            }


            ${
                product.discount

                    ?

                `

                <span>
                    -${product.discount}%
                </span>

                `

                    :

                ""
            }

        </div>


        ${
            product.description

                ?

            `

            <div class="description">

                ${escapeHTML(
                    product.description
                )}

            </div>

            `

                :

            ""
        }


        ${sizeHTML}


        <div class="product-stock">

            ${
                stock > 0

                    ?

                `In Stock: ${stock}`

                    :

                "Out of Stock"
            }

        </div>


        <button
            type="button"
            class="btn"
            id="singleAddToCart"
            ${
                stock <= 0
                    ? "disabled"
                    : ""
            }
        >

            Add To Cart

        </button>


    </div>

</div>

`;


    let selectedSize = "";


    container
        .querySelectorAll(
            ".size-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    container
                        .querySelectorAll(
                            ".size-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add(
                        "active"
                    );


                    selectedSize =
                        this.dataset.size;

                }
            );

        });


    const addButton =
        document.getElementById(
            "singleAddToCart"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                if (
                    typeof addToCart ===
                    "function"
                ) {

                    addToCart(
                        product.id,
                        selectedSize
                    );

                }

            }
        );

    }

}


/* =====================================
   CATEGORY FROM URL
===================================== */

function loadCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlCategory =
        params.get("category");


    const urlSubCategory =
        params.get("subcategory");


    if (!urlCategory) {

        selectedMainCategory =
            "All";

        selectedSubCategory =
            "All";

        return;

    }


    const normalizedURLCategory =
        normalizeCategory(
            urlCategory
        );


    const matchedCategory =
        Object.keys(
            categoryConfig
        ).find(
            category =>
                normalizeCategory(
                    category
                ) ===
                normalizedURLCategory
        );


    if (!matchedCategory) {

        selectedMainCategory =
            "All";

        selectedSubCategory =
            "All";

        return;

    }


    selectedMainCategory =
        matchedCategory;


    selectedSubCategory =
        "All";


    if (urlSubCategory) {

        const config =
            categoryConfig[
                matchedCategory
            ];


        const matchedSub =
            config.find(
                sub =>
                    normalizeCategory(
                        sub
                    ) ===
                    normalizeCategory(
                        urlSubCategory
                    )
            );


        if (matchedSub) {

            selectedSubCategory =
                matchedSub;

        }

    }

}


/* =====================================
   UPDATE CATEGORY BUTTON UI
===================================== */

function updateCategoryButtonUI() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(button => {

        const buttonCategory =
            button.dataset.category ||
            button.textContent.trim();


        if (
            normalizeCategory(
                buttonCategory
            ) ===
            normalizeCategory(
                selectedMainCategory
            )
        ) {

            button.classList.add(
                "active"
            );

        } else {

            button.classList.remove(
                "active"
            );

        }

    });

}


/* =====================================
   UPDATE SUBCATEGORY BUTTON UI
===================================== */

function updateSubCategoryButtonUI() {

    const buttons =
        document.querySelectorAll(
            ".subcategory-btn"
        );


    buttons.forEach(button => {

        if (
            normalizeCategory(
                button.textContent
            ) ===
            normalizeCategory(
                selectedSubCategory
            )
        ) {

            button.classList.add(
                "active"
            );

        } else {

            button.classList.remove(
                "active"
            );

        }

    });

}

    structuredData.textContent =
        JSON.stringify(
            schema
        );

}


/* =====================================
   UPDATE GENERAL PAGE SEO
===================================== */

function updateGeneralSEO() {

    const path =
        window.location.pathname
            .toLowerCase();


    let title =
        "Peppy Fashion | Online Fashion Store Bangladesh";


    let description =
        "Shop quality fashion products online at Peppy Fashion Bangladesh.";


    let keywords =
        "Peppy Fashion, fashion Bangladesh, online fashion store, clothing Bangladesh";


    /* =================================
       HOME PAGE
    ================================= */

    if (
        path.endsWith("/") ||
        path.endsWith("index.html")
    ) {

        title =
            "Peppy Fashion | Online Fashion Store Bangladesh";

        description =
            "Peppy Fashion is an online fashion store in Bangladesh. Shop men's, women's, kids' and sports fashion.";

        keywords =
            "Peppy Fashion, online fashion Bangladesh, men's fashion, women's fashion, kids fashion, sports fashion";

    }


    /* =================================
       SHOP PAGE
    ================================= */

    else if (
        path.includes("shop")
    ) {

        title =
            "Shop Fashion Products | Peppy Fashion Bangladesh";

        description =
            "Explore men's, women's, kids' and sports fashion products at Peppy Fashion.";

        keywords =
            "shop fashion Bangladesh, men's clothing, women's clothing, kids clothing, sportswear";

    }


    /* =================================
       CONTACT PAGE
    ================================= */

    else if (
        path.includes("contact")
    ) {

        title =
            "Contact Peppy Fashion | Bangladesh";

        description =
            "Contact Peppy Fashion Bangladesh for product and order enquiries.";

        keywords =
            "Peppy Fashion contact, fashion store Bangladesh contact";

    }


    document.title =
        title;


    setMetaContent(
        "name=description",
        description
    );


    setMetaContent(
        "name=keywords",
        keywords
    );


    setMetaContent(
        "property=og:title",
        title
    );


    setMetaContent(
        "property=og:description",
        description
    );


    setMetaContent(
        "property=og:type",
        "website"
    );


    setMetaContent(
        "property=og:url",
        window.location.href
    );


    setMetaContent(
        "name=twitter:title",
        title
    );


    setMetaContent(
        "name=twitter:description",
        description
    );

}


/* =====================================
   UPDATE PRODUCT URL
===================================== */

function updateProductURL(
    productId
) {

    if (!productId) return;


    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "id",
        productId
    );


    window.history.replaceState(
        {},
        "",
        url.toString()
    );

}


/* =====================================
   CART STORAGE
===================================== */

const CART_STORAGE_KEY =
    "peppy_cart";


function getCart() {

    try {

        const stored =
            localStorage.getItem(
                CART_STORAGE_KEY
            );


        if (!stored) {

            return [];

        }


        const parsed =
            JSON.parse(stored);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Cart read error:",
            error
        );


        return [];

    }

}


/* =====================================
   SAVE CART
===================================== */

function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );


        updateCartCount();

    }

    catch (error) {

        console.error(
            "Cart save error:",
            error
        );

    }

}


/* =====================================
   ADD TO CART
===================================== */

function addToCart(
    productId,
    selectedSize = ""
) {

    const product =
        findProductById(
            productId
        );


    if (!product) {

        console.warn(
            "Product not found:",
            productId
        );

        return;

    }


    if (
        Number(product.stock || 0) <= 0
    ) {

        alert(
            "This product is out of stock."
        );

        return;

    }


    const cart =
        getCart();


    const existing =
        cart.find(item =>

            String(item.id) ===
            String(product.id)

            &&

            String(
                item.size || ""
            ) ===
            String(
                selectedSize || ""
            )

        );


    if (existing) {

        const newQuantity =
            Number(
                existing.quantity || 0
            ) + 1;


        if (
            newQuantity >
            Number(product.stock)
        ) {

            alert(
                "You cannot add more than available stock."
            );

            return;

        }


        existing.quantity =
            newQuantity;

    }

    else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price || 0),

            image:
                product.image,

            size:
                selectedSize || "",

            quantity:
                1,

            stock:
                Number(product.stock || 0)

        });

    }


    saveCart(cart);


    updateCartCount();


    if (
        typeof showCartMessage ===
        "function"
    ) {

        showCartMessage(
            "Product added to cart."
        );

    }

}


/* =====================================
   REMOVE FROM CART
===================================== */

function removeFromCart(
    productId,
    selectedSize = ""
) {

    let cart =
        getCart();


    cart =
        cart.filter(item =>

            !(
                String(item.id) ===
                String(productId)

                &&

                String(
                    item.size || ""
                ) ===
                String(
                    selectedSize || ""
                )
            )

        );


    saveCart(cart);


    renderCart();

}


/* =====================================
   UPDATE CART QUANTITY
===================================== */

function updateCartQuantity(
    productId,
    quantity,
    selectedSize = ""
) {

    const cart =
        getCart();


    const item =
        cart.find(item =>

            String(item.id) ===
            String(productId)

            &&

            String(
                item.size || ""
            ) ===
            String(
                selectedSize || ""
            )

        );


    if (!item) return;


    const newQuantity =
        Number(quantity);


    if (
        !Number.isFinite(
            newQuantity
        ) ||
        newQuantity <= 0
    ) {

        removeFromCart(
            productId,
            selectedSize
        );

        return;

    }


    if (
        item.stock &&
        newQuantity >
        Number(item.stock)
    ) {

        alert(
            "Maximum available stock is " +
            item.stock
        );

        return;

    }


    item.quantity =
        newQuantity;


    saveCart(cart);


    renderCart();

}


/* =====================================
   CART COUNT
===================================== */

function updateCartCount() {

    const cart =
        getCart();


    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(element => {

            element.textContent =
                count;

        });


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


/* =====================================
   CART TOTAL
===================================== */

function getCartTotal() {

    const cart =
        getCart();


    return cart.reduce(
        (total, item) =>

            total +

            (
                Number(
                    item.price || 0
                )

                *

                Number(
                    item.quantity || 0
                )
            ),

        0
    );

}


/* =====================================
   RENDER CART
===================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {

        updateCartCount();

        return;

    }


    const cart =
        getCart();


    if (cart.length === 0) {

        container.innerHTML = `

<div class="empty-cart">

    <h2>Your Cart Is Empty</h2>

    <p>
        Add some products to your cart.
    </p>

    <a
        href="shop.html"
        class="btn"
    >
        Continue Shopping
    </a>

</div>

`;


        updateCartCount();

        return;

    }


    container.innerHTML = "";


    cart.forEach(item => {

        container.innerHTML += `

<div class="cart-item">

    <div class="cart-item-image">

        <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.name)}"
        >

    </div>


    <div class="cart-item-info">

        <h3>
            ${escapeHTML(item.name)}
        </h3>


        ${
            item.size

                ?

            `<p>
                Size: ${escapeHTML(item.size)}
            </p>`

                :

            ""
        }


        <p>
            ৳${Number(item.price || 0)}
        </p>


        <div class="cart-quantity">

            <button
                type="button"
                onclick="updateCartQuantity(
                    '${String(item.id).replace(/'/g, "\\'")}',
                    ${Number(item.quantity || 0) - 1},
                    '${String(item.size || "").replace(/'/g, "\\'")}'
                )"
            >
                −
            </button>


            <span>
                ${Number(item.quantity || 0)}
            </span>


            <button
                type="button"
                onclick="updateCartQuantity(
                    '${String(item.id).replace(/'/g, "\\'")}',
                    ${Number(item.quantity || 0) + 1},
                    '${String(item.size || "").replace(/'/g, "\\'")}'
                )"
            >
                +
            </button>

        </div>


        <button
            type="button"
            class="remove-cart"
            onclick="removeFromCart(
                '${String(item.id).replace(/'/g, "\\'")}',
                '${String(item.size || "").replace(/'/g, "\\'")}'
            )"
        >

            Remove

        </button>

    </div>

</div>

`;

    });


    const total =
        document.getElementById(
            "cartTotal"
        );


    if (total) {

        total.textContent =
            `৳${getCartTotal()}`;

    }


    updateCartCount();

}


/* =====================================
   CART MESSAGE
===================================== */

function showCartMessage(
    message
) {

    let messageBox =
        document.getElementById(
            "cartMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );

        messageBox.id =
            "cartMessage";

        messageBox.className =
            "cart-message";


        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    messageBox.classList.add(
        "show"
    );


    setTimeout(
        () => {

            messageBox.classList.remove(
                "show"
            );

        },
        2000
    );

}

/* =====================================
   CART MESSAGE
===================================== */

/* Part 4 continues from here */


/* =====================================
   CHECKOUT
===================================== */

function checkoutCart() {

    const cart =
        getCart();


    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    window.location.href =
        "checkout.html";

}


/* =====================================
   CLEAR CART
===================================== */

function clearCart() {

    const cart =
        getCart();


    if (cart.length === 0) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmed) {

        return;

    }


    try {

        localStorage.removeItem(
            CART_STORAGE_KEY
        );

    }

    catch (error) {

        console.error(
            "Unable to clear cart:",
            error
        );

    }


    renderCart();

    updateCartCount();


    if (
        typeof showCartMessage ===
        "function"
    ) {

        showCartMessage(
            "Cart cleared."
        );

    }

}


/* =====================================
   OPEN CART
===================================== */

function openCart() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        if (
            typeof showCartMessage ===
            "function"
        ) {

            showCartMessage(
                "Your cart is empty."
            );

        }

        return;

    }


    window.location.href =
        "cart.html";

}


/* =====================================
   PRODUCT IMAGE FALLBACK
===================================== */

function handleProductImageError(
    image
) {

    if (!image) return;


    image.onerror = null;


    image.src =
        "assets/images/placeholder.jpg";

}


/* =====================================
   NORMALIZE PRODUCT IMAGE
===================================== */

function normalizeProductImage(
    image
) {

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


    /* Remove accidental leading/trailing spaces */

    imagePath =
        imagePath.trim();


    /* Convert Windows-style separators */

    imagePath =
        imagePath.replace(
            /\\/g,
            "/"
        );


    /* Keep absolute URLs unchanged */

    if (
        /^https?:\/\//i.test(
            imagePath
        )
    ) {

        return imagePath;

    }


    /* Keep data URLs unchanged */

    if (
        /^data:/i.test(
            imagePath
        )
    ) {

        return imagePath;

    }


    /*
       Product images are normally stored in:

       assets/images/products/

       If Google Sheet contains only:
       shirt-1.jpg

       convert it automatically to:
       assets/images/products/shirt-1.jpg
    */

    if (
        !imagePath.includes("/")
    ) {

        imagePath =
            "assets/images/products/" +
            imagePath;

    }


    /*
       Remove accidental leading ./ 
    */

    imagePath =
        imagePath.replace(
            /^\.\/+/,
            ""
        );


    /*
       Prevent duplicate product-image paths
    */

    imagePath =
        imagePath.replace(
            /^assets\/images\/products\/assets\/images\/products\//i,
            "assets/images/products/"
        );


    return imagePath;

}


/* =====================================
   NORMALIZE PRODUCT DATA
===================================== */

function normalizeProductData(
    product
) {

    if (
        !product ||
        typeof product !== "object"
    ) {

        return null;

    }


    const normalized = {

        ...product,


        id:
            String(
                product.id ?? ""
            ).trim(),


        name:
            String(
                product.name ?? ""
            ).trim(),


        category:
            String(
                product.category ?? ""
            ).trim(),


        subCategory:
            String(
                product.subCategory ??
                product.subcategory ??
                ""
            ).trim(),


        collection:
            String(
                product.collection ?? ""
            ).trim(),


        price:
            Number(
                product.price || 0
            ),


        oldPrice:
            product.oldPrice === "" ||
            product.oldPrice === null ||
            product.oldPrice === undefined
                ? null
                : Number(
                    product.oldPrice
                ),


        discount:
            Number(
                product.discount || 0
            ),


        image:
            normalizeProductImage(
                product.image
            ),


        badge:
            String(
                product.badge ?? ""
            ).trim(),


        stock:
            Number(
                product.stock || 0
            ),


        featured:
            String(
                product.featured ?? ""
            )
            .trim()
            .toLowerCase(),


        description:
            String(
                product.description ?? ""
            ).trim()

    };


    /*
       Sizes can arrive from Google Sheets
       as either an array or comma-separated text.
    */

    if (
        Array.isArray(
            product.sizes
        )
    ) {

        normalized.sizes =
            product.sizes
                .map(size =>
                    String(size).trim()
                )
                .filter(Boolean);

    }

    else {

        normalized.sizes =
            String(
                product.sizes ?? ""
            )
            .split(",")
            .map(size =>
                size.trim()
            )
            .filter(Boolean);

    }


    return normalized;

}


/* =====================================
   NORMALIZE ALL PRODUCTS
===================================== */

function normalizeAllProducts() {

    if (
        !Array.isArray(products)
    ) {

        products = [];

        return products;

    }


    products =
        products
            .map(
                normalizeProductData
            )
            .filter(
                product =>
                    product !== null
            );


    return products;

}


/* =====================================
   SAFE PRODUCT SEARCH
===================================== */

function productMatchesText(
    product,
    keyword
) {

    if (!product) {

        return false;

    }


    const search =
        normalizeCategory(
            keyword
        );


    if (!search) {

        return true;

    }


    return (

        normalizeCategory(
            product.name
        ).includes(search)

        ||

        normalizeCategory(
            product.category
        ).includes(search)

        ||

        normalizeCategory(
            product.subCategory
        ).includes(search)

        ||

        normalizeCategory(
            product.collection
        ).includes(search)

        ||

        normalizeCategory(
            product.badge
        ).includes(search)

    );

}


/* =====================================
   PRODUCT FILTER HELPER
===================================== */

function filterProducts(
    mainCategory = "All",
    subCategory = "All"
) {

    if (
        !Array.isArray(products)
    ) {

        return [];

    }


    const main =
        normalizeCategory(
            mainCategory
        );


    const sub =
        normalizeCategory(
            subCategory
        );


    return products.filter(
        product => {

            const productMain =
                normalizeCategory(
                    product.category
                );


            const productSub =
                normalizeCategory(
                    product.subCategory
                );


            /*
               All main categories
            */

            if (
                main === "all"
            ) {

                return true;

            }


            /*
               Main category must match
            */

            if (
                productMain !== main
            ) {

                return false;

            }


            /*
               All subcategories inside
               selected main category
            */

            if (
                sub === "all"
            ) {

                return true;

            }


            /*
               Exact subcategory match
            */

            return (
                productSub === sub
            );

        }
    );

}


/* =====================================
   REBUILD CATEGORY FILTER
===================================== */

function refreshCategoryFilters() {

    renderSubCategories();

    updateCategoryButtonUI();

    updateSubCategoryButtonUI();

}


/* =====================================
   INITIALIZE SHOP FILTERS
===================================== */

function initializeShopFilters() {

    loadCategoryFromURL();

    refreshCategoryFilters();

    applyFilters();

}


/* =====================================
   INITIALIZE PRODUCT PAGE
===================================== */

async function initializeProductPage() {

    const product =
        await loadSingleProduct();


    if (!product) {

        renderSingleProduct(
            null
        );

        return;

    }


    renderSingleProduct(
        product
    );

}


/* =====================================
   INITIALIZE CART
===================================== */

function initializeCart() {

    updateCartCount();

    renderCart();

}


/* =====================================
   PAGE INITIALIZATION
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            /*
               Load product data first.
               This ensures category,
               subcategory and product
               rendering all use the same
               current product array.
            */

            if (
                typeof loadProducts ===
                "function"
            ) {

                await loadProducts();

            }


            /*
               Normalize data received from
               Google Apps Script / Google Sheet.
            */

            normalizeAllProducts();


            /*
               Shop page
            */

            if (
                document.getElementById(
                    "productContainer"
                )
            ) {

                initializeShopFilters();

            }


            /*
               Product details page
            */

            if (
                document.getElementById(
                    "productDetails"
                )
            ) {

                await initializeProductPage();

            }


            /*
               Cart page / cart section
            */

            if (
                document.getElementById(
                    "cartItems"
                ) ||
                document.querySelector(
                    ".cart-count"
                )
            ) {

                initializeCart();

            }


            /*
               General SEO
            */

            updateGeneralSEO();


            /*
               Make sure cart count is
               available on every page.
            */

            updateCartCount();

        }

        catch (error) {

            console.error(
                "Page initialization error:",
                error
            );

        }

    }
);


/* =====================================
   HANDLE URL CATEGORY ON PAGE LOAD
===================================== */

window.addEventListener(
    "popstate",
    function () {

        if (
            document.getElementById(
                "productContainer"
            )
        ) {

            loadCategoryFromURL();

            refreshCategoryFilters();

            applyFilters();

        }

    }
);


/* =====================================
   GLOBAL CATEGORY ACCESS
===================================== */

window.changeCategory =
    changeCategory;


window.changeSubCategory =
    changeSubCategory;


window.searchProducts =
    searchProducts;


window.sortProducts =
    sortProducts;


window.displayProducts =
    displayProducts;


window.displayFeaturedProducts =
    displayFeaturedProducts;


window.addToCart =
    addToCart;


window.removeFromCart =
    removeFromCart;


window.updateCartQuantity =
    updateCartQuantity;


window.updateCartCount =
    updateCartCount;


window.getCart =
    getCart;


window.getCartTotal =
    getCartTotal;


window.renderCart =
    renderCart;


window.clearCart =
    clearCart;


window.checkoutCart =
    checkoutCart;


window.openCart =
    openCart;


/* =====================================
   PEPPY FASHION SCRIPT READY
===================================== */

console.log(
    "Peppy Fashion script loaded successfully."
);
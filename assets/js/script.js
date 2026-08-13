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
   MAIN CATEGORY
===================================== */

function changeCategory(category, button) {

    selectedMainCategory = category;

    selectedSubCategory = "All";


    document
        .querySelectorAll(".category-btn")
        .forEach(
            btn =>
                btn.classList.remove("active")
        );


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
        selectedMainCategory === "All"
    ) {

        area.style.display = "none";

        return;

    }


    area.style.display = "flex";


    if (
        !categoryConfig[
            selectedMainCategory
        ]
    ) {

        return;

    }


    categoryConfig[
        selectedMainCategory
    ].forEach(sub => {

        area.innerHTML += `

<button
    class="subcategory-btn ${sub === "All" ? "active" : ""}"
    type="button"
    onclick="changeSubCategory('${sub}',this)"
>
    ${sub}
</button>

`;

    });

}


/* =====================================
   CHANGE SUB CATEGORY
===================================== */

function changeSubCategory(
    sub,
    button
) {

    selectedSubCategory = sub;


    document
        .querySelectorAll(
            ".subcategory-btn"
        )
        .forEach(
            btn =>
                btn.classList.remove("active")
        );


    if (button) {

        button.classList.add("active");

    }


    applyFilters();

}


/* =====================================
   APPLY FILTERS
===================================== */

function applyFilters() {

    let filtered = [...products];


    /* MAIN CATEGORY */

    if (
        selectedMainCategory !== "All"
    ) {

        filtered =
            filtered.filter(product =>

                (product.category || "")
                    .toLowerCase()
                ===
                selectedMainCategory
                    .toLowerCase()

            );

    }


    /* SUB CATEGORY */

    if (
        selectedMainCategory !== "All" &&
        selectedSubCategory !== "All"
    ) {

        filtered =
            filtered.filter(product =>

                (product.subCategory || "")
                    .toLowerCase()
                ===
                selectedSubCategory
                    .toLowerCase()

            );

    }


    /* SEARCH */

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

                    (product.name || "")
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (product.category || "")
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (product.subCategory || "")
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (product.collection || "")
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (product.badge || "")
                        .toLowerCase()
                        .includes(keyword)

                );

            });

    }


    /* SORT */

    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (sort) {

        switch (sort.value) {

            case "low":

                filtered.sort(
                    (a, b) =>
                        a.price - b.price
                );

                break;


            case "high":

                filtered.sort(
                    (a, b) =>
                        b.price - a.price
                );

                break;


            case "name":

                filtered.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

                break;

        }

    }


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
   CATEGORY FILTER
===================================== */

function filterCategory(category) {

    selectedMainCategory =
        category;

    selectedSubCategory =
        "All";


    renderSubCategories();

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
        !productList ||
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
            src="${product.image}"
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
                ${Number(product.stock) <= 0
                    ? "disabled"
                    : ""}
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
        products.filter(product =>

            String(product.featured)
                .toLowerCase()
            ===
            "yes"

        );


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

        if (
            attribute.startsWith(
                "property="
            )
        ) {

            element.setAttribute(
                "property",
                attribute
                    .replace(
                        "property=",
                        ""
                    )
            );

        }

        else {

            element.setAttribute(
                "name",
                attribute
                    .replace(
                        "name=",
                        ""
                    )
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
   UPDATE PRODUCT SEO
===================================== */

function updateProductSEO(product) {

    if (!product) return;


    const productName =
        product.name ||
        "Product";


    const category =
        product.category ||
        "Fashion";


    const description =
        product.description ||
        `${productName} from Peppy Fashion. Shop quality ${category.toLowerCase()} fashion online in Bangladesh.`;


    const pageTitle =
        `${productName} | Peppy Fashion`;


    const productURL =
        `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(product.id)}`;


    /* TITLE */

    document.title =
        pageTitle;


    /* DESCRIPTION */

    let descriptionMeta =
        document.querySelector(
            'meta[name="description"]'
        );


    if (!descriptionMeta) {

        descriptionMeta =
            document.createElement("meta");

        descriptionMeta.setAttribute(
            "name",
            "description"
        );

        document.head.appendChild(
            descriptionMeta
        );

    }


    descriptionMeta.setAttribute(
        "content",
        description
    );


    /* CANONICAL */

    let canonical =
        document.querySelector(
            'link[rel="canonical"]'
        );


    if (!canonical) {

        canonical =
            document.createElement(
                "link"
            );

        canonical.setAttribute(
            "rel",
            "canonical"
        );

        document.head.appendChild(
            canonical
        );

    }


    canonical.setAttribute(
        "href",
        productURL
    );


    /* OPEN GRAPH */

    setMetaContent(
        "property=og:title",
        pageTitle
    );


    setMetaContent(
        "property=og:description",
        description
    );


    setMetaContent(
        "property=og:url",
        productURL
    );


    if (product.image) {

        setMetaContent(
            "property=og:image",
            product.image
        );

    }


    setMetaContent(
        "property=og:type",
        "product"
    );


    /* TWITTER */

    setMetaContent(
        "name=twitter:title",
        pageTitle
    );


    setMetaContent(
        "name=twitter:description",
        description
    );


    if (product.image) {

        setMetaContent(
            "name=twitter:image",
            product.image
        );

    }


    /* KEYWORDS */

    let keywords =
        document.querySelector(
            'meta[name="keywords"]'
        );


    if (!keywords) {

        keywords =
            document.createElement(
                "meta"
            );

        keywords.setAttribute(
            "name",
            "keywords"
        );

        document.head.appendChild(
            keywords
        );

    }


    keywords.setAttribute(
        "content",
        `${productName}, ${category}, ${product.subCategory || ""}, Peppy Fashion, Bangladesh fashion`
    );


    /* STRUCTURED DATA */

    let structuredData =
        document.getElementById(
            "productStructuredData"
        );


    if (!structuredData) {

        structuredData =
            document.createElement(
                "script"
            );

        structuredData.type =
            "application/ld+json";

        structuredData.id =
            "productStructuredData";

        document.head.appendChild(
            structuredData
        );

    }


    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "Product",

        "name":
            productName,

        "description":
            description,

        "image":
            product.image
                ? [product.image]
                : [],

        "sku":
            String(product.id),

        "category":
            category,

        "brand": {

            "@type":
                "Brand",

            "name":
                "Peppy Fashion"

        },

        "offers": {

            "@type":
                "Offer",

            "url":
                productURL,

            "priceCurrency":
                "BDT",

            "price":
                String(product.price),

            "availability":
                Number(product.stock) > 0

                    ?

                    "https://schema.org/InStock"

                    :

                    "https://schema.org/OutOfStock",

            "seller": {

                "@type":
                    "Organization",

                "name":
                    "Peppy Fashion"

            }

        }

    };


    structuredData.textContent =
        JSON.stringify(schema);

}


/* =====================================
   LOAD SINGLE PRODUCT
===================================== */

function loadSingleProduct() {

    const container =
        document.getElementById(
            "productDetails"
        );


    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(params.get("id"));


    const product =
        getProductById(id);


    if (!product) {

        document.title =
            "Product Not Found | Peppy Fashion";


        container.innerHTML = `

<div class="empty-products">

    <h2>
        Product Not Found
    </h2>

    <p>
        Sorry, this product is no longer available.
    </p>

    <a
        href="shop.html"
        class="btn"
    >
        Back To Shop
    </a>

</div>

`;

        return;

    }


    /* ===========================
       SEO
    =========================== */

    updateProductSEO(product);


    /* ===========================
       SIZE OPTIONS
    =========================== */

    let sizeOptions = "";


    if (
        product.sizes &&
        product.sizes.length > 0
    ) {

        sizeOptions = `

<div class="form-group">

<label for="selectedSize">
    Select Size
</label>

<select
    id="selectedSize"
    class="form-control"
>

${product.sizes.map(size => `

<option value="${escapeHTML(size)}">

    ${escapeHTML(size)}

</option>

`).join("")}

</select>

</div>

`;

    }


    /* ===========================
       OLD PRICE
    =========================== */

    let oldPrice = "";


    if (product.oldPrice) {

        oldPrice = `

<span class="old-price">

    ৳${product.oldPrice}

</span>

`;

    }


    /* ===========================
       STOCK
    =========================== */

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


    /* ===========================
       PRODUCT DESCRIPTION
    =========================== */

    const description =
        product.description || "";


    /* ===========================
       PRODUCT PAGE
    =========================== */

    container.innerHTML = `

<div class="product-single">


<div>


<img
    src="${product.image}"
    alt="${escapeHTML(product.name)}"
    loading="eager"
>


</div>


<div>


${
    product.badge

    ?

    `<span class="badge">
        ${escapeHTML(product.badge)}
    </span>`

    :

    ""
}


<h1>

    ${escapeHTML(product.name)}

</h1>


<p class="category">

    ${escapeHTML(product.category)}
    &gt;
    ${escapeHTML(product.subCategory)}

</p>


<div class="price-group">

<span class="new-price">

    ৳${product.price}

</span>

${oldPrice}

</div>


${stockHTML}


${sizeOptions}


<p>

    ${escapeHTML(description)}

</p>


<button
    class="btn"
    type="button"
    onclick="addCurrentProduct(${product.id})"
    ${Number(product.stock) <= 0
        ? "disabled"
        : ""}
>

    Add To Cart

</button>


</div>


</div>

`;

}


/* =====================================
   ADD CURRENT PRODUCT
===================================== */

function addCurrentProduct(id) {

    let size = "";


    const sizeInput =
        document.getElementById(
            "selectedSize"
        );


    if (sizeInput) {

        size =
            sizeInput.value;

    }


    addToCart(
        id,
        size
    );

}


/* =====================================
   LOAD SHOP BY URL CATEGORY
===================================== */

function loadCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    if (!category) {

        renderSubCategories();

        applyFilters();

        return;

    }


    selectedMainCategory =
        category;


    selectedSubCategory =
        "All";


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );


            if (
                btn.textContent
                    .trim()
                    .toLowerCase()
                ===
                category
                    .toLowerCase()
            ) {

                btn.classList.add(
                    "active"
                );

            }

        });


    renderSubCategories();

    applyFilters();

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================
   INITIAL LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        /* CART */

        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();

        }


        /* PRODUCTS */

        if (
            typeof loadProducts ===
            "function"
        ) {

            await loadProducts();

        }


        /* HOME PAGE */

        if (

            document.getElementById(
                "productContainer"
            )

            &&

            (
                window.location.pathname
                    .endsWith("/")
                ||
                window.location.pathname
                    .includes("index")
            )

        ) {

            displayFeaturedProducts();

        }


        /* SHOP PAGE */

        else if (

            document.getElementById(
                "productContainer"
            )

        ) {

            renderSubCategories();

            loadCategoryFromURL();

            applyFilters();

        }


        /* PRODUCT DETAILS */

        if (

            document.getElementById(
                "productDetails"
            )

        ) {

            loadSingleProduct();

        }

    }
);
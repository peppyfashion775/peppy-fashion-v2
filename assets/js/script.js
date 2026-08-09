```javascript
/* =====================================
PEPPY FASHION V6
CATEGORY + PRODUCT DISPLAY
===================================== */

let selectedMainCategory = "All";
let selectedSubCategory = "All";

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

    const nav = document.querySelector(".navbar");

    if (!nav) return;

    nav.style.display =
        nav.style.display === "flex"
            ? "none"
            : "flex";
}


/* =====================================
CLOSE MENU WHEN CLICK OUTSIDE
===================================== */

document.addEventListener("click", function (e) {

    const nav = document.querySelector(".navbar");
    const menuBtn = document.querySelector(".menu-btn");

    if (!nav || !menuBtn) return;

    if (
        window.innerWidth <= 768 &&
        nav.style.display === "flex" &&
        !nav.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {
        nav.style.display = "none";
    }

});


/* =====================================
MAIN CATEGORY
===================================== */

function changeCategory(category, button) {

    selectedMainCategory = category;
    selectedSubCategory = "All";

    document
        .querySelectorAll(".category-btn")
        .forEach(btn =>
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

    if (selectedMainCategory === "All") {

        area.style.display = "none";
        return;

    }

    const subCategories =
        categoryConfig[selectedMainCategory];

    if (!subCategories) {

        area.style.display = "none";
        return;

    }

    area.style.display = "flex";

    subCategories.forEach(sub => {

        const button =
            document.createElement("button");

        button.className =
            "subcategory-btn" +
            (sub === "All" ? " active" : "");

        button.textContent = sub;

        button.onclick = function () {
            changeSubCategory(sub, button);
        };

        area.appendChild(button);

    });

}


/* =====================================
CHANGE SUB CATEGORY
===================================== */

function changeSubCategory(sub, button) {

    selectedSubCategory = sub;

    document
        .querySelectorAll(".subcategory-btn")
        .forEach(btn =>
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

    if (typeof products === "undefined") return;

    let filtered = [...products];


    /* MAIN CATEGORY */

    if (selectedMainCategory !== "All") {

        filtered = filtered.filter(product =>

            String(product.category || "")
                .trim()
                .toLowerCase() ===
            selectedMainCategory
                .trim()
                .toLowerCase()

        );

    }


    /* SUB CATEGORY */

    if (
        selectedMainCategory !== "All" &&
        selectedSubCategory !== "All"
    ) {

        filtered = filtered.filter(product =>

            String(product.subCategory || "")
                .trim()
                .toLowerCase() ===
            selectedSubCategory
                .trim()
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

        filtered = filtered.filter(product => {

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
                        Number(a.price) -
                        Number(b.price)
                );

                break;

            case "high":

                filtered.sort(
                    (a, b) =>
                        Number(b.price) -
                        Number(a.price)
                );

                break;

            case "name":

                filtered.sort(
                    (a, b) =>
                        String(a.name || "")
                            .localeCompare(
                                String(b.name || "")
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

    selectedMainCategory = category;
    selectedSubCategory = "All";

    renderSubCategories();
    applyFilters();

}


/* =====================================
DISPLAY PRODUCTS
===================================== */

function displayProducts(productList = []) {

    const container =
        document.getElementById(
            "productContainer"
        );

    if (!container) return;


    /* EMPTY */

    if (
        !productList ||
        productList.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No Products Found</h3>
                <p>Try another category or search.</p>
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    /* PRODUCTS */

    productList.forEach(product => {

        let priceHTML = `
            <span class="new-price">
                ৳${product.price}
            </span>
        `;


        if (product.oldPrice) {

            priceHTML = `
                <span class="old-price">
                    ৳${product.oldPrice}
                </span>

                <span class="new-price">
                    ৳${product.price}
                </span>

                ${
                    product.discount
                        ? `
                            <span class="sale-badge">
                                -${product.discount}%
                            </span>
                          `
                        : ""
                }
            `;

        }


        let stockHTML = "";

        if (Number(product.stock) <= 0) {

            stockHTML = `
                <span class="out-stock">
                    Out of Stock
                </span>
            `;

        }


        const productCard = document.createElement("div");

        productCard.className = "product-card";


        productCard.innerHTML = `

            <div class="product-image">

                ${
                    product.badge
                        ? `
                            <span class="badge">
                                ${product.badge}
                            </span>
                          `
                        : ""
                }

                <img
                    src="${product.image || "assets/images/placeholder.jpg"}"
                    alt="${product.name || "Product"}"
                    loading="lazy"
                    onerror="this.src='assets/images/placeholder.jpg'"
                >

            </div>


            <div class="product-info">

                <h3 class="product-name">
                    ${product.name || ""}
                </h3>

                <p class="product-category">
                    ${product.category || ""}
                </p>

                <p class="product-subcategory">
                    ${product.subCategory || ""}
                </p>

                <div class="product-price">
                    ${priceHTML}
                </div>

                ${stockHTML}


                <div class="product-actions">

                    <button
                        class="btn add-cart-btn"
                        onclick="addToCart(${product.id})"
                        ${
                            Number(product.stock) <= 0
                                ? "disabled"
                                : ""
                        }
                    >
                        Add To Cart
                    </button>


                    <button
                        class="btn view-btn"
                        onclick="viewProduct(${product.id})"
                    >
                        View Details
                    </button>

                </div>

            </div>
        `;


        container.appendChild(productCard);

    });

}


/* =====================================
VIEW PRODUCT
===================================== */

function viewProduct(id) {

    window.location.href =
        `product-details.html?id=${id}`;

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

    if (typeof products === "undefined") return;

    const featured =
        products.filter(product =>

            String(product.featured)
                .toLowerCase() === "yes"

        );

    displayProducts(featured);

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
        typeof getProductById === "function"
            ? getProductById(id)
            : products.find(
                p => Number(p.id) === id
            );


    if (!product) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Product Not Found</h3>
                <p>Please return to the shop.</p>
            </div>
        `;

        return;

    }


    let sizeOptions = "";


    if (
        product.sizes &&
        product.sizes.length > 0
    ) {

        sizeOptions = `

            <div class="size-selector">

                <label>
                    Select Size
                </label>

                <select id="selectedSize">

                    <option value="">
                        Select Size
                    </option>

                    ${
                        product.sizes
                            .map(size => `
                                <option value="${size}">
                                    ${size}
                                </option>
                            `)
                            .join("")
                    }

                </select>

            </div>

        `;

    }


    let oldPrice = "";


    if (product.oldPrice) {

        oldPrice = `
            <span class="old-price">
                ৳${product.oldPrice}
            </span>
        `;

    }


    container.innerHTML = `

        <div class="product-detail-image">

            <img
                src="${product.image || "assets/images/placeholder.jpg"}"
                alt="${product.name || "Product"}"
                onerror="this.src='assets/images/placeholder.jpg'"
            >

        </div>


        <div class="product-detail-info">

            ${
                product.badge
                    ? `
                        <span class="badge">
                            ${product.badge}
                        </span>
                      `
                    : ""
            }


            <h1>
                ${product.name}
            </h1>


            <p>
                ${product.category || ""}
            </p>


            <p>
                ${product.subCategory || ""}
            </p>


            <div class="product-price">

                <span class="new-price">
                    ৳${product.price}
                </span>

                ${oldPrice}

            </div>


            ${sizeOptions}


            <div class="product-description">
                ${product.description || ""}
            </div>


            <button
                class="btn add-cart-btn"
                onclick="addCurrentProduct(${product.id})"
                ${
                    Number(product.stock) <= 0
                        ? "disabled"
                        : ""
                }
            >
                Add To Cart
            </button>

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
        size = sizeInput.value;
    }

    addToCart(id, size);

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


    selectedMainCategory = category;
    selectedSubCategory = "All";


    document
        .querySelectorAll(".category-btn")
        .forEach(btn => {

            btn.classList.remove("active");


            if (
                btn.textContent
                    .trim()
                    .toLowerCase() ===
                category
                    .trim()
                    .toLowerCase()
            ) {

                btn.classList.add("active");

            }

        });


    renderSubCategories();
    applyFilters();

}


/* =====================================
INITIAL LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();

        }


        /* WAIT FOR PRODUCTS */

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
            ) &&
            (
                window.location.pathname
                    .endsWith("/") ||

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
```

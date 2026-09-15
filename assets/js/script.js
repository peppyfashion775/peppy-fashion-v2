/* =====================================
   PEPPY FASHION
   MAIN WEBSITE SCRIPT
   UPDATED:
   - Mandatory Size Selection
   - Size Picker Modal
   - Related Products
===================================== */


/* =====================================
   CATEGORY CONFIGURATION
===================================== */

let selectedMainCategory = "All";
let selectedSubCategory = "All";


const categoryConfig = {

    Men: [
        "All",
        "Shirts",
        "T-Shirts",
        "Pants",
        "Jeans",
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


    if (
        nav.style.display === "flex"
    ) {

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

function changeCategory(
    category,
    button
) {

    selectedMainCategory =
        category;

    selectedSubCategory =
        "All";


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
            class="subcategory-btn ${
                sub === "All"
                    ? "active"
                    : ""
            }"
            onclick="changeSubCategory(
                '${sub.replace(/'/g, "\\'")}',
                this
            )"
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

    selectedSubCategory =
        sub;


    document
        .querySelectorAll(
            ".subcategory-btn"
        )
        .forEach(btn =>
            btn.classList.remove(
                "active"
            )
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    applyFilters();

}


/* =====================================
   NORMALIZE TEXT
===================================== */

function normalizeText(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/['’`]/g, "")
        .replace(/[^a-z0-9]/g, "");

}


/* =====================================
   APPLY FILTERS
===================================== */

function applyFilters() {

    if (!Array.isArray(products)) {

        console.error(
            "Products data not available"
        );

        return;

    }


    let filtered = [
        ...products
    ];


    /* =================================
       MAIN CATEGORY
    ================================= */

    if (
        selectedMainCategory !== "All"
    ) {

        const selectedCategory =
            normalizeText(
                selectedMainCategory
            );


        filtered =
            filtered.filter(product => {

                const productCategory =
                    product.category ||
                    product.Category ||
                    product.mainCategory ||
                    product.MainCategory ||
                    "";


                return (
                    normalizeText(
                        productCategory
                    ) ===
                    selectedCategory
                );

            });

    }


    /* =================================
       SUB CATEGORY
    ================================= */

    if (
        selectedMainCategory !== "All" &&
        selectedSubCategory !== "All"
    ) {

        const selectedSub =
            normalizeText(
                selectedSubCategory
            );


        filtered =
            filtered.filter(product => {

                const productSubCategory =
                    product.subCategory ||
                    product.subcategory ||
                    product.SubCategory ||
                    product["Sub Category"] ||
                    "";


                return (
                    normalizeText(
                        productSubCategory
                    ) ===
                    selectedSub
                );

            });

    }


    /* =================================
       SEARCH
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
            normalizeText(
                searchInput.value
            );


        filtered =
            filtered.filter(product => {

                const searchableText = [

                    product.name,

                    product.category,

                    product.Category,

                    product.mainCategory,

                    product.subCategory,

                    product.subcategory,

                    product.collection,

                    product.badge

                ]
                    .map(item =>
                        normalizeText(item)
                    )
                    .join(" ");


                return searchableText.includes(
                    keyword
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
                        String(a.name)
                            .localeCompare(
                                String(b.name)
                            )
                );

                break;

        }

    }


    displayProducts(
        filtered
    );

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
        !productList ||
        productList.length === 0
    ) {

        container.innerHTML = `

        <div class="empty-products">

            <h2>
                No Products Found
            </h2>

            <p>
                Try another category or search.
            </p>

        </div>

        `;

        return;

    }


    container.innerHTML = "";


    productList.forEach(
        product => {


            /* =============================
               PRICE
            ============================= */

            const currentPrice =
                Number(product.price) || 0;


            const discountPercent =
                Number(product.discount) || 0;


            let originalPrice =
                Number(product.oldPrice) || 0;


            if (
                !originalPrice &&
                discountPercent > 0 &&
                currentPrice > 0
            ) {

                originalPrice =
                    currentPrice /
                    (
                        1 -
                        discountPercent / 100
                    );

            }


            /* =============================
               PRICE HTML
            ============================= */

            let priceHTML = `

            <h3 class="price">
                ৳${currentPrice.toFixed(0)}
            </h3>

            `;


            if (
                discountPercent > 0 &&
                originalPrice > currentPrice
            ) {

                priceHTML = `

                <div class="price-group">

                    <span class="new-price">
                        ৳${currentPrice.toFixed(0)}
                    </span>

                    <span class="old-price">
                        ৳${originalPrice.toFixed(0)}
                    </span>

                    <span class="discount">
                        -${discountPercent}%
                    </span>

                </div>

                `;

            }


            /* =============================
               STOCK
            ============================= */

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


            /* =============================
               PRODUCT CARD
            ============================= */

            container.innerHTML += `

            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    ${
                        product.badge

                        ?

                        `<span class="badge">
                            ${product.badge}
                        </span>`

                        :

                        ""
                    }


                    <h3>
                        ${product.name}
                    </h3>


                    <p class="category">

                        ${
                            product.category ||
                            product.mainCategory ||
                            ""
                        }

                        >

                        ${
                            product.subCategory ||
                            ""
                        }

                    </p>


                    ${priceHTML}


                    ${stockHTML}


                    <div class="product-buttons">

                        <button
                            class="btn"
                            onclick="addToCart(
                                ${product.id}
                            )"
                            ${
                                Number(
                                    product.stock
                                ) <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >

                            Add To Cart

                        </button>


                        <a
                            href="product.html?id=${product.id}"
                            class="btn btn-secondary"
                        >

                            View Details

                        </a>

                    </div>

                </div>

            </div>

            `;

        }
    );

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
        products.filter(
            product =>
                String(
                    product.featured
                ).toLowerCase() === "yes"
        );


    displayProducts(
        featured
    );

}


/* =====================================
   CREATE SIZE PICKER MODAL
===================================== */

function createSizePickerModal() {

    if (
        document.getElementById(
            "sizePickerModal"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "peppy-size-picker-style";


    style.innerHTML = `

    #sizePickerModal {

        position: fixed;

        inset: 0;

        background: rgba(
            0,
            0,
            0,
            0.55
        );

        display: none;

        align-items: center;

        justify-content: center;

        z-index: 99999;

        padding: 20px;

    }


    #sizePickerModal.active {

        display: flex;

    }


    .peppy-size-box {

        width: 100%;

        max-width: 420px;

        background: #fff;

        border-radius: 14px;

        padding: 24px;

        box-shadow:
            0 15px 45px
            rgba(
                0,
                0,
                0,
                0.25
            );

        position: relative;

        text-align: center;

    }


    .peppy-size-box h3 {

        margin-top: 0;

        margin-bottom: 8px;

    }


    .peppy-size-product {

        margin-bottom: 18px;

        font-weight: 600;

    }


    .peppy-size-options {

        display: flex;

        flex-wrap: wrap;

        justify-content: center;

        gap: 10px;

        margin: 18px 0;

    }


    .peppy-size-option {

        min-width: 58px;

        padding: 10px 14px;

        border: 1px solid #ccc;

        background: #fff;

        border-radius: 7px;

        cursor: pointer;

        font-weight: 600;

    }


    .peppy-size-option:hover {

        border-color: #e91e63;

    }


    .peppy-size-option.selected {

        background: #e91e63;

        color: #fff;

        border-color: #e91e63;

    }


    .peppy-size-actions {

        display: flex;

        gap: 10px;

        justify-content: center;

        margin-top: 18px;

    }


    .peppy-size-cancel {

        border: 1px solid #ccc;

        background: #fff;

        padding: 10px 20px;

        border-radius: 7px;

        cursor: pointer;

    }


    .peppy-size-confirm {

        border: none;

        background: #e91e63;

        color: #fff;

        padding: 10px 20px;

        border-radius: 7px;

        cursor: pointer;

    }


    .peppy-size-confirm:disabled {

        opacity: 0.5;

        cursor: not-allowed;

    }


    .peppy-size-close {

        position: absolute;

        right: 12px;

        top: 8px;

        border: none;

        background: transparent;

        font-size: 26px;

        cursor: pointer;

    }

    `;


    document.head.appendChild(
        style
    );


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "sizePickerModal";


    modal.innerHTML = `

    <div class="peppy-size-box">

        <button
            class="peppy-size-close"
            onclick="closeSizePicker()"
            aria-label="Close"
        >
            ×
        </button>


        <h3>
            Select Size
        </h3>


        <div
            id="sizePickerProductName"
            class="peppy-size-product"
        >
        </div>


        <div
            id="sizePickerOptions"
            class="peppy-size-options"
        >
        </div>


        <div class="peppy-size-actions">

            <button
                class="peppy-size-cancel"
                onclick="closeSizePicker()"
            >
                Cancel
            </button>


            <button
                id="sizePickerConfirm"
                class="peppy-size-confirm"
                disabled
                onclick="confirmSizePicker()"
            >
                Add To Cart
            </button>

        </div>

    </div>

    `;


    modal.addEventListener(
        "click",
        function (e) {

            if (
                e.target === modal
            ) {

                closeSizePicker();

            }

        }
    );


    document.body.appendChild(
        modal
    );

}


/* =====================================
   SIZE PICKER STATE
===================================== */

let selectedPickerProductId =
    null;

let selectedPickerSize =
    "";


/* =====================================
   OPEN SIZE PICKER
===================================== */

function openSizePicker(
    productId
) {

    createSizePickerModal();


    const product =
        typeof getProductById === "function"
            ? getProductById(productId)
            : null;


    if (!product) {

        alert(
            "Product information is not available."
        );

        return;

    }


    if (
        Number(product.stock) <= 0
    ) {

        alert(
            "Sorry, this product is currently out of stock."
        );

        return;

    }


    /*
       Products without sizes
       can directly be added.
    */

    if (
        !Array.isArray(product.sizes) ||
        product.sizes.length === 0
    ) {

        addToCart(
            product.id,
            ""
        );

        return;

    }


    selectedPickerProductId =
        product.id;

    selectedPickerSize =
        "";


    const name =
        document.getElementById(
            "sizePickerProductName"
        );


    const options =
        document.getElementById(
            "sizePickerOptions"
        );


    const confirm =
        document.getElementById(
            "sizePickerConfirm"
        );


    if (name) {

        name.innerText =
            product.name;

    }


    if (options) {

        options.innerHTML =
            product.sizes
                .map(
                    size => `

                    <button
                        type="button"
                        class="peppy-size-option"
                        onclick="selectPickerSize(
                            '${String(size).replace(
                                /'/g,
                                "\\'"
                            )}',
                            this
                        )"
                    >
                        ${size}
                    </button>

                    `
                )
                .join("");

    }


    if (confirm) {

        confirm.disabled =
            true;

    }


    const modal =
        document.getElementById(
            "sizePickerModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


/* =====================================
   SELECT SIZE FROM PICKER
===================================== */

function selectPickerSize(
    size,
    button
) {

    selectedPickerSize =
        String(size || "").trim();


    document
        .querySelectorAll(
            ".peppy-size-option"
        )
        .forEach(btn =>
            btn.classList.remove(
                "selected"
            )
        );


    if (button) {

        button.classList.add(
            "selected"
        );

    }


    const confirm =
        document.getElementById(
            "sizePickerConfirm"
        );


    if (confirm) {

        confirm.disabled =
            selectedPickerSize === "";

    }

}


/* =====================================
   CONFIRM SIZE PICKER
===================================== */

function confirmSizePicker() {

    if (
        !selectedPickerProductId
    ) {

        return;

    }


    if (
        !selectedPickerSize
    ) {

        alert(
            "Please select a size first."
        );

        return;

    }


    const productId =
        selectedPickerProductId;


    const size =
        selectedPickerSize;


    closeSizePicker();


    if (
        typeof addToCart === "function"
    ) {

        addToCart(
            productId,
            size
        );

    }

}


/* =====================================
   CLOSE SIZE PICKER
===================================== */

function closeSizePicker() {

    const modal =
        document.getElementById(
            "sizePickerModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    selectedPickerProductId =
        null;

    selectedPickerSize =
        "";

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
        Number(
            params.get("id")
        );


    const product =
        typeof getProductById === "function"
            ? getProductById(id)
            : null;


    if (!product) {

        container.innerHTML = `

        <h2>
            Product Not Found
        </h2>

        `;

        return;

    }


    /* =================================
       SIZE OPTIONS
    ================================= */

    let sizeOptions = "";


    if (
        Array.isArray(product.sizes) &&
        product.sizes.length > 0
    ) {

        sizeOptions = `

        <div class="form-group">

            <label>
                Select Size
            </label>


            <select
                id="selectedSize"
                class="form-control"
            >

                <option
                    value=""
                    selected
                    disabled
                >
                    -- Select Size --
                </option>

                ${
                    product.sizes
                        .map(
                            size => `

                            <option
                                value="${size}"
                            >
                                ${size}
                            </option>

                            `
                        )
                        .join("")
                }

            </select>

        </div>

        `;

    }


    /* =================================
       PRICE
    ================================= */

    const currentPrice =
        Number(product.price) || 0;


    const discountPercent =
        Number(product.discount) || 0;


    let originalPrice =
        Number(product.oldPrice) || 0;


    if (
        !originalPrice &&
        discountPercent > 0 &&
        currentPrice > 0
    ) {

        originalPrice =
            currentPrice /
            (
                1 -
                discountPercent / 100
            );

    }


    /* =================================
       OLD PRICE
    ================================= */

    let oldPrice = "";


    if (
        discountPercent > 0 &&
        originalPrice > currentPrice
    ) {

        oldPrice = `

        <span class="old-price">
            ৳${originalPrice.toFixed(0)}
        </span>


        <span class="discount">
            -${discountPercent}%
        </span>

        `;

    }


    /* =================================
       STOCK
    ================================= */

    let stockHTML = "";


    if (
        Number(product.stock) <= 0
    ) {

        stockHTML = `

        <p class="out-stock">
            Out of Stock
        </p>

        `;

    }


    /* =================================
       PRODUCT DETAILS
    ================================= */

    container.innerHTML = `

    <div class="product-single">


        <div>

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div>

            ${
                product.badge

                ?

                `<span class="badge">
                    ${product.badge}
                </span>`

                :

                ""
            }


            <h2>
                ${product.name}
            </h2>


            <p>

                ${
                    product.category ||
                    product.mainCategory ||
                    ""
                }

                >

                ${
                    product.subCategory ||
                    ""
                }

            </p>


            <div class="price-group">

                <span class="new-price">
                    ৳${currentPrice.toFixed(0)}
                </span>

                ${oldPrice}

            </div>


            ${stockHTML}


            ${sizeOptions}


            <p>
                ${product.description || ""}
            </p>


            <button
                class="btn"
                onclick="addCurrentProduct(
                    ${product.id}
                )"
                ${
                    Number(product.stock) <= 0
                        ? "disabled"
                        : ""
                }
            >

                Add To Cart

            </button>


        </div>


    </div>


    <div
        id="relatedProductsSection"
        class="related-products-section"
    >
    </div>

    `;


    /* =================================
       RELATED PRODUCTS
    ================================= */

    renderRelatedProducts(
        product
    );

}


/* =====================================
   ADD CURRENT PRODUCT
===================================== */

function addCurrentProduct(
    id
) {

    let size = "";


    const sizeInput =
        document.getElementById(
            "selectedSize"
        );


    if (sizeInput) {

        size =
            sizeInput.value;

    }


    /*
       IMPORTANT:
       Do not allow empty size.
    */

    const product =
        typeof getProductById === "function"
            ? getProductById(id)
            : null;


    if (
        product &&
        Array.isArray(product.sizes) &&
        product.sizes.length > 0 &&
        !size
    ) {

        alert(
            "Please select a size before adding to cart."
        );

        if (sizeInput) {

            sizeInput.focus();

        }

        return;

    }


    addToCart(
        id,
        size
    );

}


/* =====================================
   RELATED PRODUCTS
===================================== */

function renderRelatedProducts(
    currentProduct
) {

    const container =
        document.getElementById(
            "relatedProductsSection"
        );


    if (!container) return;


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        return;

    }


    const currentId =
        Number(
            currentProduct.id
        );


    const currentSub =
        normalizeText(
            currentProduct.subCategory
        );


    const currentCategory =
        normalizeText(
            currentProduct.category ||
            currentProduct.mainCategory
        );


    const currentCollection =
        normalizeText(
            currentProduct.collection
        );


    /*
       Rank products by similarity.
    */

    const scored =
        products

            .filter(
                product =>
                    Number(product.id) !==
                    currentId
            )

            .map(product => {

                let score = 0;


                const sub =
                    normalizeText(
                        product.subCategory
                    );


                const category =
                    normalizeText(
                        product.category ||
                        product.mainCategory
                    );


                const collection =
                    normalizeText(
                        product.collection
                    );


                if (
                    currentSub &&
                    sub === currentSub
                ) {

                    score += 5;

                }


                if (
                    currentCategory &&
                    category ===
                    currentCategory
                ) {

                    score += 3;

                }


                if (
                    currentCollection &&
                    collection ===
                    currentCollection
                ) {

                    score += 2;

                }


                return {

                    product,
                    score

                };

            });


    scored.sort(
        (a, b) =>
            b.score - a.score
    );


    /*
       First choose matching products.
       If not enough, fill with others.
    */

    let related =
        scored
            .filter(
                item =>
                    item.score > 0
            )
            .slice(0, 6)
            .map(
                item =>
                    item.product
            );


    if (
        related.length < 4
    ) {

        const additional =
            scored

                .filter(
                    item =>
                        !related.some(
                            product =>
                                Number(
                                    product.id
                                ) ===
                                Number(
                                    item.product.id
                                )
                        )
                )

                .slice(
                    0,
                    4 - related.length
                )

                .map(
                    item =>
                        item.product
                );


        related =
            related.concat(
                additional
            );

    }


    if (
        related.length === 0
    ) {

        return;

    }


    /* =================================
       RELATED PRODUCT CARDS
    ================================= */

    let cards = "";


    related.forEach(
        product => {

            const price =
                Number(
                    product.price
                ) || 0;


            const discount =
                Number(
                    product.discount
                ) || 0;


            let oldPrice =
                Number(
                    product.oldPrice
                ) || 0;


            if (
                !oldPrice &&
                discount > 0 &&
                price > 0
            ) {

                oldPrice =
                    price /
                    (
                        1 -
                        discount / 100
                    );

            }


            let priceHTML = `

            <h3 class="price">
                ৳${price.toFixed(0)}
            </h3>

            `;


            if (
                discount > 0 &&
                oldPrice > price
            ) {

                priceHTML = `

                <div class="price-group">

                    <span class="new-price">
                        ৳${price.toFixed(0)}
                    </span>

                    <span class="old-price">
                        ৳${oldPrice.toFixed(0)}
                    </span>

                    <span class="discount">
                        -${discount}%
                    </span>

                </div>

                `;

            }


            const outOfStock =
                Number(
                    product.stock
                ) <= 0;


            cards += `

            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    ${
                        product.badge

                        ?

                        `<span class="badge">
                            ${product.badge}
                        </span>`

                        :

                        ""
                    }


                    <h3>
                        ${product.name}
                    </h3>


                    ${priceHTML}


                    ${
                        outOfStock

                        ?

                        `<span class="out-stock">
                            Out of Stock
                        </span>`

                        :

                        ""
                    }


                    <div class="product-buttons">

                        <button
                            class="btn"
                            onclick="addToCart(
                                ${product.id}
                            )"
                            ${
                                outOfStock
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Add To Cart
                        </button>


                        <a
                            href="product.html?id=${product.id}"
                            class="btn btn-secondary"
                        >
                            View Details
                        </a>

                    </div>

                </div>

            </div>

            `;

        }
    );


    container.innerHTML = `

    <div class="related-products">

        <h2>
            You May Also Like
        </h2>


        <div class="product-grid">

            ${cards}

        </div>

    </div>

    `;


    /*
       Small style so the section
       looks good even if the existing
       CSS does not have related styles.
    */

    if (
        !document.getElementById(
            "peppy-related-style"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "peppy-related-style";


        style.innerHTML = `

        .related-products-section {

            margin-top: 50px;

            padding-top: 30px;

            border-top: 1px solid #eee;

        }


        .related-products h2 {

            text-align: center;

            margin-bottom: 25px;

        }


        .related-products .product-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        200px,
                        1fr
                    )
                );

            gap: 20px;

        }


        @media (
            max-width: 600px
        ) {

            .related-products
            .product-grid {

                grid-template-columns:
                    repeat(
                        2,
                        minmax(
                            0,
                            1fr
                        )
                    );

                gap: 10px;

            }

        }

        `;


        document.head.appendChild(
            style
        );

    }

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
                    .toLowerCase() ===
                category.toLowerCase()
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
   INITIAL LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        /* =================================
           CREATE SIZE PICKER
        ================================= */

        createSizePickerModal();


        /* =================================
           CART COUNT
        ================================= */

        if (
            typeof updateCartCount ===
            "function"
        ) {

            updateCartCount();

        }


        /* =================================
           WAIT FOR PRODUCTS
        ================================= */

        if (
            typeof loadProducts ===
            "function"
        ) {

            await loadProducts();

        }


        /* =================================
           HOME PAGE
        ================================= */

        if (
            document.getElementById(
                "productContainer"
            ) &&

            window.location.pathname
                .includes("index")
        ) {

            displayFeaturedProducts();

        }


        /* =================================
           SHOP PAGE
        ================================= */

        else if (
            document.getElementById(
                "productContainer"
            )
        ) {

            renderSubCategories();

            loadCategoryFromURL();

            applyFilters();

        }


        /* =================================
           PRODUCT DETAILS PAGE
        ================================= */

        if (
            document.getElementById(
                "productDetails"
            )
        ) {

            loadSingleProduct();

        }

    }
);
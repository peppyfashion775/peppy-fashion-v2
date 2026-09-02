/* =====================================
   PEPPY FASHION V5
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
        .forEach(btn => btn.classList.remove("active"));

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

    categoryConfig[
        selectedMainCategory
    ].forEach(sub => {

        area.innerHTML += `

<button
class="subcategory-btn ${sub==="All"?"active":""}"
onclick="changeSubCategory('${sub}',this)">
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
){

    selectedSubCategory = sub;

    document
        .querySelectorAll(".subcategory-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    button.classList.add("active");

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
        console.error("Products data not available");
        return;
    }

    let filtered = [...products];


    /* MAIN CATEGORY */

    if (selectedMainCategory !== "All") {

        const selectedCategory =
            normalizeText(selectedMainCategory);

        filtered = filtered.filter(product => {

            const productCategory =
                product.category ||
                product.Category ||
                product.mainCategory ||
                "";

            return normalizeText(productCategory)
                === selectedCategory;

        });

    }


    /* SUB CATEGORY */

    if (
        selectedMainCategory !== "All" &&
        selectedSubCategory !== "All"
    ) {

        const selectedSub =
            normalizeText(selectedSubCategory);

        filtered = filtered.filter(product => {

            const productSubCategory =
                product.subCategory ||
                product.subcategory ||
                product.SubCategory ||
                product["Sub Category"] ||
                "";

            return normalizeText(productSubCategory)
                === selectedSub;

        });

    }


    /* SEARCH */

    const searchInput =
        document.getElementById("searchInput");

    if (
        searchInput &&
        searchInput.value.trim() !== ""
    ) {

        const keyword =
            normalizeText(searchInput.value);

        filtered = filtered.filter(product => {

            const searchableText = [
                product.name,
                product.category,
                product.Category,
                product.subCategory,
                product.subcategory,
                product.collection,
                product.badge
            ]
            .map(item => normalizeText(item))
            .join(" ");

            return searchableText.includes(keyword);

        });

    }


    /* SORT */

    const sort =
        document.getElementById("sortProducts");

    if (sort) {

        switch (sort.value) {

            case "low":
                filtered.sort(
                    (a, b) =>
                    Number(a.price) - Number(b.price)
                );
                break;

            case "high":
                filtered.sort(
                    (a, b) =>
                    Number(b.price) - Number(a.price)
                );
                break;

            case "name":
                filtered.sort(
                    (a, b) =>
                    String(a.name)
                    .localeCompare(String(b.name))
                );
                break;

        }

    }

    console.log("Category:", selectedMainCategory);
    console.log("Subcategory:", selectedSubCategory);
    console.log("Products:", filtered);

    displayProducts(filtered);

}

/* =====================================
   SEARCH
===================================== */

function searchProducts(){

    applyFilters();

}

/* =====================================
   SORT
===================================== */

function sortProducts(){

    applyFilters();

}


/* =====================================
   DISPLAY PRODUCTS
===================================== */

function displayProducts(productList = products) {

    const container =
        document.getElementById("productContainer");

    if (!container) return;

    if (!productList || productList.length === 0) {

        container.innerHTML = `

<div class="empty-products">

<h2>No Products Found</h2>

<p>Try another category or search.</p>

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

        if (Number(product.stock) <= 0) {

            stockHTML =

            `<span class="out-stock">
            Out of Stock
            </span>`;

        }

        container.innerHTML += `

<div class="product-card">

<div class="product-image">

<img
src="${product.image}"
alt="${product.name}">

</div>

<div class="product-info">

${product.badge ?

`<span class="badge">${product.badge}</span>`

:

""

}

<h3>

${product.name}

</h3>

<p class="category">

${product.category}
>
${product.subCategory}

</p>

${priceHTML}

${stockHTML}

<div class="product-buttons">

<button
class="btn"
onclick="addToCart(${product.id})"
${Number(product.stock)<=0 ? "disabled" : ""}>

Add To Cart

</button>

<a
href="product.html?id=${product.id}"
class="btn btn-secondary">

View Details

</a>

</div>

</div>

</div>

`;

    });

}

/* =====================================
   FEATURED PRODUCTS
===================================== */

function displayFeaturedProducts() {

    const container =
        document.getElementById("productContainer");

    if (!container) return;

    const featured = products.filter(product =>

        String(product.featured).toLowerCase() === "yes"

    );

    displayProducts(featured);

}

/* =====================================
   LOAD SINGLE PRODUCT
===================================== */

function loadSingleProduct() {

    const container =
        document.getElementById("productDetails");

    if (!container) return;

    const params =
        new URLSearchParams(window.location.search);

    const id =
        Number(params.get("id"));

    const product =
        getProductById(id);

    if (!product) {

        container.innerHTML = `

<h2>Product Not Found</h2>

`;

        return;

    }

    let sizeOptions = "";

    if (
        product.sizes &&
        product.sizes.length > 0
    ) {

        sizeOptions = `

<div class="form-group">

<label>Select Size</label>

<select
id="selectedSize"
class="form-control">

${product.sizes.map(size=>`

<option value="${size}">

${size}

</option>

`).join("")}

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

<div class="product-single">

<div>

<img
src="${product.image}"
alt="${product.name}">

</div>

<div>

${product.badge ?

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

${product.category}
>
${product.subCategory}

</p>

<div class="price-group">

<span class="new-price">

৳${product.price}

</span>

${oldPrice}

</div>

${sizeOptions}

<p>

${product.description || ""}

</p>

<button
class="btn"
onclick="addCurrentProduct(${product.id})">

Add To Cart

</button>

</div>

</div>

`;

}

/* =====================================
   ADD CURRENT PRODUCT
===================================== */

function addCurrentProduct(id){

    let size = "";

    const sizeInput =
        document.getElementById("selectedSize");

    if(sizeInput){

        size = sizeInput.value;

    }

    addToCart(id,size);

}

/* =====================================
   LOAD SHOP BY URL CATEGORY
===================================== */

function loadCategoryFromURL() {

    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");

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
                btn.textContent.trim().toLowerCase() ===
                category.toLowerCase()
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

document.addEventListener("DOMContentLoaded", async function () {

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    /* Wait until products are loaded */

    if (typeof loadProducts === "function") {
        await loadProducts();
    }

    /* HOME PAGE */

    if (
        document.getElementById("productContainer") &&
        window.location.pathname.includes("index")
    ) {

        displayFeaturedProducts();

    }

    /* SHOP PAGE */

    else if (
        document.getElementById("productContainer")
    ) {

        renderSubCategories();

        loadCategoryFromURL();

        applyFilters();

    }

    /* PRODUCT DETAILS */

    if (
        document.getElementById("productDetails")
    ) {

        loadSingleProduct();

    }

});


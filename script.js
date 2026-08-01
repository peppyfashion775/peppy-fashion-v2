/* =====================================
   DISPLAY PRODUCTS GRID
===================================== */

function displayProducts(productList = products) {
    let container = document.getElementById("productContainer");
    if (!container) return;

    // Wait until products are loaded
    if (!productList || productList.length === 0) {
        container.innerHTML = `
            <div class="loading-products">
                <h3>Loading products...</h3>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    productList.forEach(product => {

        // Price Display
        let priceHTML = `<h3 class="price">৳${product.price}</h3>`;

        if (product.oldPrice) {
            priceHTML = `
                <h3 class="price" style="display:flex;align-items:center;gap:8px;">
                    <span style="color:#e63946;font-weight:bold;">৳${product.price}</span>
                    <span style="text-decoration:line-through;color:#888;font-size:.85em;font-weight:normal;">
                        ৳${product.oldPrice}
                    </span>
                    ${product.discount ? `
                        <span style="background:#28a745;color:#fff;padding:2px 8px;border-radius:4px;font-size:13px;">
                            ${product.discount}% OFF
                        </span>
                    ` : ""}
                </h3>
            `;
        }

        container.innerHTML += `
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="product-info">

                    ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    ${priceHTML}

                    <button class="btn"
                        onclick="addToCart(${product.id})">
                        Add To Cart
                    </button>

                    <a href="product.html?id=${product.id}"
                       class="btn btn-secondary">
                        View
                    </a>

                </div>

            </div>
        `;
    });
}


/* =====================================
   PRODUCT DETAILS PAGE
===================================== */

function loadSingleProduct() {

    let area = document.getElementById("productDetails");
    if (!area) return;

    // Wait until Google Sheet finishes loading
    if (products.length === 0) {
        area.innerHTML = `
            <div class="loading-products">
                <h3>Loading product...</h3>
            </div>
        `;
        return;
    }

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    let product = getProductById(id);

    if (!product) {
        area.innerHTML = `
            <div class="empty-state">
                <h2>Product not found.</h2>
                <a href="shop.html" class="btn">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }

    let sizeOptions = "";

    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            sizeOptions += `<option value="${size}">${size}</option>`;
        });
    }

    let priceHTML = `<h3 class="price" style="font-size:24px;">৳${product.price}</h3>`;

    if (product.oldPrice) {
        priceHTML = `
            <h3 class="price" style="font-size:24px;display:flex;align-items:center;gap:10px;">
                <span style="color:#e63946;font-weight:bold;">
                    ৳${product.price}
                </span>

                <span style="text-decoration:line-through;color:#888;font-size:.8em;font-weight:normal;">
                    ৳${product.oldPrice}
                </span>

                ${product.discount ? `
                    <span style="background:#28a745;color:#fff;padding:2px 8px;border-radius:4px;font-size:14px;">
                        ${product.discount}% OFF
                    </span>
                ` : ""}
            </h3>
        `;
    }

    area.innerHTML = `
        <div class="product-single">

            <div>
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div>

                <h2>${product.name}</h2>

                ${priceHTML}

                <p>${product.description || ""}</p>

                <br>

                ${sizeOptions ? `
                    <label>Select Size:</label>

                    <select id="selectedSize" class="form-control">
                        ${sizeOptions}
                    </select>

                    <br>
                ` : ""}

                <button class="btn"
                    onclick="addProductWithSize(${product.id})">
                    Add To Cart
                </button>

            </div>

        </div>
    `;
}

/* =====================================
   ADD PRODUCT WITH SIZE
===================================== */

function addProductWithSize(productId) {

    let sizeElement = document.getElementById("selectedSize");
    let size = sizeElement ? sizeElement.value : "";

    addToCart(productId, size);
}


/* =====================================
   SEARCH PRODUCTS
===================================== */

function searchProducts() {

    let search = document.getElementById("searchInput");
    if (!search) return;

    let keyword = search.value.trim().toLowerCase();

    // Show all products if search box is empty
    if (keyword === "") {
        displayProducts(products);
        return;
    }

    let filtered = products.filter(product => {

        let name = (product.name || "").toLowerCase();
        let category = (product.category || "").toLowerCase();
        let badge = (product.badge || "").toLowerCase();

        return (
            name.includes(keyword) ||
            category.includes(keyword) ||
            badge.includes(keyword)
        );

    });

    displayProducts(filtered);
}


/* =====================================
   CATEGORY FILTER
===================================== */

function filterCategory(category) {

    // Show all products
    if (category === "All") {
        displayProducts(products);
        return;
    }

    let filtered = products.filter(product => {

        return (
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        );

    });

    displayProducts(filtered);
}


/* =====================================
   SORT PRODUCTS
===================================== */

function sortProducts() {

    let select = document.getElementById("sortProducts");
    if (!select) return;

    let value = select.value;

    let sorted = [...products];

    switch (value) {

        case "low":
            sorted.sort((a, b) => a.price - b.price);
            break;

        case "high":
            sorted.sort((a, b) => b.price - a.price);
            break;

        case "name":
            sorted.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case "new":
            sorted.reverse();
            break;

        default:
            break;
    }

    displayProducts(sorted);
}

/* =====================================
   MOBILE MENU
===================================== */

function toggleMenu() {

    let menu = document.querySelector(".navbar");

    if (!menu) return;

    menu.style.display =
        menu.style.display === "flex" ? "none" : "flex";
}


/* =====================================
   INITIAL LOAD
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Update cart count immediately
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    // Wait until Google Sheet products are loaded
    const waitForProducts = setInterval(function () {

        if (products.length > 0) {

            clearInterval(waitForProducts);

            if (document.getElementById("productContainer")) {
                displayProducts();
            }

            if (document.getElementById("productDetails")) {
                loadSingleProduct();
            }

        }

    }, 100);

});
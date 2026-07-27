/* =====================================
   PEPPY FASHION V3
   MAIN JAVASCRIPT
===================================== */

/* DISPLAY PRODUCTS GRID */
function displayProducts(productList = products) {
    let container = document.getElementById("productContainer");
    if (!container) return;

    // Save products locally whenever the grid renders so product page can access them instantly[cite: 1]
    if (productList && productList.length > 0) {
        localStorage.setItem("peppy_products", JSON.stringify(productList));
    }

    container.innerHTML = "";

    productList.forEach(product => {
        // Price Display Logic: Show Old Price crossed out if discount exists
        let priceHTML = `<h3 class="price">৳${product.price}</h3>`;
        
        if (product.oldPrice) {
            priceHTML = `
                <h3 class="price" style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #e63946; font-weight: bold;">৳${product.price}</span>
                    <span style="text-decoration: line-through; color: #888; font-size: 0.85em; font-weight: normal;">
                        ৳${product.oldPrice}
                    </span>
                </h3>`;
        }

        container.innerHTML += `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">
                ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}

                <h3>${product.name}</h3>
                <p>${product.category}</p>

                ${priceHTML}

                <button class="btn" onclick="addToCart(${product.id})">
                    Add To Cart
                </button>

                <a href="product.html?id=${product.id}" class="btn btn-secondary">
                    View
                </a>
            </div>
        </div>`;
    });
}

/* PRODUCT DETAILS PAGE */
function loadSingleProduct() {
    let area = document.getElementById("productDetails");
    if (!area) return;

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    // Instantly check local storage first to eliminate delay[cite: 1]
    let savedProducts = JSON.parse(localStorage.getItem("peppy_products")) || [];
    let product = savedProducts.find(p => p.id == id || p.ID == id);

    // Fallback to global getProductById function if available and not found in storage[cite: 1]
    if (!product && typeof getProductById === "function") {
        product = getProductById(id);
    }

    if (!product) {
        area.innerHTML = "<h2>Product not found</h2>";
        return;
    }

    let sizeOptions = "";
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            sizeOptions += `<option value="${size}">${size}</option>`;
        });
    }

    // Single Product Price HTML
    let priceHTML = `<h3 class="price" style="font-size: 24px;">৳${product.price}</h3>`;
    if (product.oldPrice) {
        priceHTML = `
            <h3 class="price" style="font-size: 24px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #e63946; font-weight: bold;">৳${product.price}</span>
                <span style="text-decoration: line-through; color: #888; font-size: 0.8em; font-weight: normal;">
                    ৳${product.oldPrice}
                </span>
                ${product.discount ? `<span style="background: #28a745; color: white; padding: 2px 8px; font-size: 14px; border-radius: 4px;">${product.discount}% OFF</span>` : ''}
            </h3>`;
    }

    area.innerHTML = `
    <div class="product-single">
        <div>
            <img src="${product.image || product.Image}" alt="${product.name || product.Title}">
        </div>

        <div>
            <h2>${product.name || product.Title}</h2>
            ${priceHTML}
            <p>${product.description || product.Description || ''}</p>
            <br>

            ${sizeOptions ? `
                <label>Select Size:</label>
                <select id="selectedSize" class="form-control">
                    ${sizeOptions}
                </select>
                <br>
            ` : ''}

            <button class="btn" onclick="addProductWithSize(${product.id || product.ID})">
                Add To Cart
            </button>
        </div>
    </div>`;
}

/* ADD PRODUCT WITH SIZE */
function addProductWithSize(productId) {
    let sizeElement = document.getElementById("selectedSize");
    let size = sizeElement ? sizeElement.value : "";
    addToCart(productId, size);
}

/* SEARCH */
function searchProducts() {
    let search = document.getElementById("searchInput");
    if (!search) return;

    let value = search.value.toLowerCase();
    let filtered = products.filter(product => product.name.toLowerCase().includes(value));

    displayProducts(filtered);
}

/* CATEGORY FILTER */
function filterCategory(category) {
    let filtered = getProductsByCategory(category);
    displayProducts(filtered);
}

/* SORT PRODUCTS */
function sortProducts() {
    let select = document.getElementById("sortProducts");
    if (!select) return;

    let value = select.value;
    let sorted = [...products];

    if (value === "low") {
        sorted.sort((a, b) => a.price - b.price);
    }

    if (value === "high") {
        sorted.sort((a, b) => b.price - a.price);
    }

    displayProducts(sorted);
}

/* MOBILE MENU */
function toggleMenu() {
    let menu = document.querySelector(".navbar");
    if (menu) {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    }
}

/* INITIAL LOAD */
document.addEventListener("DOMContentLoaded", function() {
    if (typeof products !== 'undefined' && products) {
        displayProducts(products);
    } else {
        displayProducts();
    }
    loadSingleProduct();
    if (typeof updateCartCount === "function") updateCartCount();
});
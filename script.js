/* PRODUCT DETAILS PAGE - INSTANT LOAD */
function loadSingleProduct() {
    let area = document.getElementById("productDetails");
    if (!area) return;

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    // 1. Try to find the product from localStorage first
    let savedProducts = JSON.parse(localStorage.getItem("peppy_products")) || [];
    let product = savedProducts.find(p => p.id == id || p.ID == id);

    // 2. If not in localStorage, check the global products array instantly
    if (!product && typeof products !== "undefined") {
        product = products.find(p => p.id == id || p.ID == id);
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

    // Render instantly with zero delay
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
/* =====================================
   PEPPY FASHION V3
   DYNAMIC GOOGLE SHEETS PRODUCT LOADER
===================================== */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbHxHS5GuRH4Lr-L5wTs8aRjXbdgK60CyM0muAjRvhUKZ-1IzeFBGq7y6an9d0Kmg_/exec";

let products = [];

// Fetch products live from Google Sheets
async function fetchProductsFromSheet() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        
        if (data.success && data.products) {
            products = data.products;
            
            // Trigger UI updates if functions exist
            if (typeof displayProducts === "function") displayProducts();
            if (typeof loadSingleProduct === "function") loadSingleProduct();
        }
    } catch (error) {
        console.error("Error loading products from Google Sheet:", error);
    }
}

/* GET SINGLE PRODUCT */
function getProductById(id) {
    return products.find(product => product.id == id);
}

/* GET CATEGORY PRODUCTS */
function getProductsByCategory(category) {
    if (category === "All") return products;
    return products.filter(product => product.category === category);
}

// Automatically load products on page load
document.addEventListener("DOMContentLoaded", fetchProductsFromSheet);
/* =====================================
   PEPPY FASHION WEBSITE JAVASCRIPT
===================================== */

/* ===============================
   MOBILE MENU
=============================== */

function toggleMenu(){

const menu=document.getElementById("navMenu");

if(menu){

menu.classList.toggle("active");

}

}

/* ===============================
   PRODUCT SEARCH
=============================== */

function searchProducts(){

const search=document.getElementById("searchBox");

if(!search) return;

const value=search.value.toLowerCase();

const products=document.querySelectorAll(".product-card");

products.forEach(function(product){

const text=product.innerText.toLowerCase();

product.style.display=text.includes(value)?"block":"none";

});

}

/* ===============================
   PRODUCT FILTER
=============================== */

function filterProducts(category){

const products=document.querySelectorAll(".product-card");

products.forEach(function(product){

if(category==="all"){

product.style.display="block";

}

else if(product.classList.contains(category)){

product.style.display="block";

}

else{

product.style.display="none";

}

});

}

/* ===============================
   GO TO CHECKOUT
=============================== */

function goToCheckout(name,price,image){

const product={

name:name,

price:Number(price),

image:image

};

localStorage.setItem(

"checkoutProduct",

JSON.stringify(product)

);

window.location.href="checkout.html";

}

/* ===============================
   LOAD CHECKOUT PRODUCT
=============================== */

function loadCheckout(){

const product=

JSON.parse(

localStorage.getItem("checkoutProduct")

);

if(!product) return;

const productName=document.getElementById("productName");
const productPrice=document.getElementById("productPrice");
const summaryPrice=document.getElementById("summaryPrice");
const productImage=document.getElementById("productImage");

if(productName) productName.innerHTML=product.name;

if(productPrice) productPrice.innerHTML="৳"+product.price;

if(summaryPrice) summaryPrice.innerHTML="৳"+product.price;

if(productImage) productImage.src=product.image;

updateTotal();

}

/* ===============================
   UPDATE TOTAL
=============================== */

function updateTotal(){

const product=

JSON.parse(

localStorage.getItem("checkoutProduct")

);

if(!product) return;

const quantity=

parseInt(

document.getElementById("quantity")?.value

)||1;

const delivery=

parseInt(

document.getElementById("deliveryLocation")?.value

)||0;

const discount=

parseInt(

document.getElementById("summaryDiscount")

?.innerText

.replace("৳","")

)||0;

const total=

(product.price*quantity)-discount+delivery;

if(document.getElementById("summaryQuantity")){

document.getElementById("summaryQuantity").innerHTML=quantity;

}

if(document.getElementById("deliveryCharge")){

document.getElementById("deliveryCharge").innerHTML="৳"+delivery;

}

if(document.getElementById("grandTotal")){

document.getElementById("grandTotal").innerHTML="৳"+total;

}

}

/* ===============================
   APPLY PROMO CODE
=============================== */

function applyPromo(){

const product=
JSON.parse(
localStorage.getItem("checkoutProduct")
);

if(!product) return;

const promo=
document
.getElementById("promoCode")
.value
.trim()
.toUpperCase();

let discount=0;

switch(promo){

case "PEPPY10":
discount=Math.round(product.price*0.10);
break;

case "EID20":
discount=Math.round(product.price*0.20);
break;

case "WELCOME15":
discount=Math.round(product.price*0.15);
break;

default:
discount=0;

}

if(document.getElementById("summaryDiscount")){

document.getElementById("summaryDiscount").innerHTML=
"৳"+discount;

}

updateTotal();

}

/* ===============================
   PLACE ORDER
=============================== */

function placeOrder(){

const product=
JSON.parse(
localStorage.getItem("checkoutProduct")
);

if(!product){

alert("Product not found.");

return;

}

const name=
document.getElementById("customerName").value.trim();

const phone=
document.getElementById("customerPhone").value.trim();

const address=
document.getElementById("customerAddress").value.trim();

if(name==="" || phone==="" || address===""){

alert("Please fill all customer information.");

return;

}

const quantity=
document.getElementById("quantity").value;

const colour=
document.getElementById("colour").value;

const size=
document.getElementById("size").value;

const promo=
document.getElementById("promoCode").value;

const payment=
document.querySelector(
'input[name="payment"]:checked'
).value;

const total=
document.getElementById("grandTotal").innerText;

const delivery=
document.getElementById("deliveryCharge").innerText;

const discount=
document.getElementById("summaryDiscount").innerText;

const message=

`🛍️ PEPPY FASHION ORDER

━━━━━━━━━━━━━━

👕 Product
${product.name}

💰 Price
৳${product.price}

📦 Quantity
${quantity}

🎨 Colour
${colour}

📏 Size
${size}

🎟 Promo
${promo || "N/A"}

💸 Discount
${discount}

🚚 Delivery
${delivery}

🧾 Grand Total
${total}

━━━━━━━━━━━━━━

👤 Customer
${name}

📞 Phone
${phone}

📍 Address
${address}

💳 Payment
${payment}

Thank you ❤️`;

window.open(

"https://wa.me/8801710868775?text="+
encodeURIComponent(message),

"_blank"

);

}

/* ===============================
   PAGE LOAD
=============================== */

document.addEventListener(

"DOMContentLoaded",

function(){

loadCheckout();

const quantity=
document.getElementById("quantity");

if(quantity){

quantity.addEventListener(
"input",
updateTotal
);

}

const delivery=
document.getElementById("deliveryLocation");

if(delivery){

delivery.addEventListener(
"change",
updateTotal
);

}

}

);

/* ===============================
   SMOOTH SCROLL
=============================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(function(link){

link.addEventListener(

"click",

function(e){

const target=
document.querySelector(
this.getAttribute("href")
);

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});
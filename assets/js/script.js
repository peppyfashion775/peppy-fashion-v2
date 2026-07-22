/* =====================================
   PEPPY FASHION V3
   MAIN JAVASCRIPT
===================================== */



/* DISPLAY PRODUCTS */


function displayProducts(productList = products){


    let container =
    document.getElementById("productContainer");



    if(!container){

        return;

    }





    container.innerHTML = "";





    productList.forEach(product => {



        container.innerHTML += `



        <div class="product-card">



            <div class="product-image">


                <img 
                src="${product.image}" 
                alt="${product.name}">


            </div>





            <div class="product-info">



                <span class="badge">

                ${product.badge}

                </span>





                <h3>

                ${product.name}

                </h3>





                <p>

                ${product.category}

                </p>





                <h3 class="price">

                ৳${product.price}

                </h3>





                <button

                class="btn"

                onclick="addToCart(${product.id})">


                Add To Cart


                </button>





                <a

                href="product.html?id=${product.id}"

                class="btn btn-secondary">


                View


                </a>



            </div>


        </div>



        `;


    });


}








/* PRODUCT DETAILS PAGE */


function loadSingleProduct(){



    let area =
    document.getElementById("productDetails");



    if(!area){

        return;

    }





    let params =
    new URLSearchParams(
        window.location.search
    );



    let id =
    params.get("id");





    let product =
    getProductById(id);





    if(!product){


        area.innerHTML =
        "<h2>Product not found</h2>";


        return;


    }





    let sizeOptions = "";





    if(product.sizes){



        product.sizes.forEach(size => {


            sizeOptions += `


            <option value="${size}">

            ${size}

            </option>


            `;


        });


    }







    area.innerHTML = `




    <div class="product-single">





        <div>


            <img

            src="${product.image}"

            alt="${product.name}">


        </div>







        <div>



            <h2>

            ${product.name}

            </h2>





            <h3 class="price">

            ৳${product.price}

            </h3>





            <p>

            ${product.description}

            </p>





            <br>





            <label>

            Select Size:

            </label>



            <select

            id="selectedSize"

            class="form-control">


            ${sizeOptions}


            </select>





            <br>





            <button

            class="btn"

            onclick="addProductWithSize(${product.id})">


            Add To Cart


            </button>





        </div>



    </div>




    `;



}








/* ADD PRODUCT WITH SIZE */


function addProductWithSize(productId){



    let size =
    document.getElementById("selectedSize").value;



    addToCart(

        productId,

        size

    );


}








/* SEARCH */


function searchProducts(){



    let search =
    document.getElementById("searchInput");



    if(!search){

        return;

    }





    let value =
    search.value.toLowerCase();





    let filtered =
    products.filter(product =>



        product.name

        .toLowerCase()

        .includes(value)



    );





    displayProducts(filtered);



}








/* CATEGORY FILTER */


function filterCategory(category){



    let filtered =
    getProductsByCategory(category);



    displayProducts(filtered);



}








/* SORT PRODUCTS */


function sortProducts(){



    let select =
    document.getElementById("sortProducts");



    if(!select){

        return;

    }





    let value =
    select.value;





    let sorted =
    [...products];





    if(value === "low"){


        sorted.sort(
            (a,b)=>a.price-b.price
        );


    }





    if(value === "high"){


        sorted.sort(
            (a,b)=>b.price-a.price
        );


    }





    displayProducts(sorted);



}








/* MOBILE MENU */


function toggleMenu(){



    let menu =
    document.querySelector(".navbar");



    if(menu){



        menu.style.display =

        menu.style.display === "flex"

        ? "none"

        : "flex";



    }



}








/* PAGE LOAD */


document.addEventListener(

"DOMContentLoaded",

function(){



    displayProducts();



    loadSingleProduct();



    updateCartCount();



}

);
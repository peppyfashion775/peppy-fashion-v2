/* =====================================
   DISPLAY PRODUCTS
===================================== */


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





                <p>

                ${product.collection}

                </p>





                <h3 class="price">

                ৳${product.price}

                </h3>





                <a

                href="product.html?id=${product.id}"

                class="btn">


                Select Options


                </a>



            </div>


        </div>



        `;


    });


}

/* =====================================
   PRODUCT DETAILS PAGE
===================================== */


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





    let colorOptions = "";



    if(product.colors){


        product.colors.forEach(color => {


            colorOptions += `


            <option value="${color}">

            ${color}

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


            <option value="">

            Choose Size

            </option>


            ${sizeOptions}


            </select>





            <br>





            <label>

            Select Color:

            </label>



            <select

            id="selectedColor"

            class="form-control">


            <option value="">

            Choose Color

            </option>


            ${colorOptions}


            </select>







            <br>





            <button

            class="btn"

            onclick="addProductWithOptions(${product.id})">


            Add To Cart


            </button>





        </div>



    </div>




    `;



}

/* =====================================
   ADD PRODUCT WITH OPTIONS
===================================== */


function addProductWithOptions(productId){


    let size =
    document.getElementById("selectedSize").value;



    let color =
    document.getElementById("selectedColor").value;





    if(!size){


        alert("Please select size");


        return;


    }





    if(!color){


        alert("Please select color");


        return;


    }





    addToCart(

        productId,

        size,

        color

    );


}

/* =====================================
   CATEGORY FILTER
===================================== */

function filterCategory(category){

    let filtered =
    getProductsByCategory(category);


    displayProducts(filtered);

}

document.addEventListener(
"DOMContentLoaded",
function(){

    displayProducts();

    loadSingleProduct();

    updateCartCount();

}
);
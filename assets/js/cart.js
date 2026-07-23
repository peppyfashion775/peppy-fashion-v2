/* =====================================
   PEPPY FASHION V4
   CART SYSTEM
===================================== */


/* GET CART */

function getCart(){

    let cart = localStorage.getItem("peppyCart");


    if(cart){

        return JSON.parse(cart);

    }


    return [];

}





/* SAVE CART */

function saveCart(cart){

    localStorage.setItem(
        "peppyCart",
        JSON.stringify(cart)
    );

}





/* ADD TO CART */

function addToCart(productId, selectedSize = "", selectedColor = ""){


    let cart = getCart();



    let product = getProductById(productId);



    if(!product){

        return;

    }





    let existing = cart.find(item =>

        item.id === productId &&

        item.size === selectedSize &&

        item.color === selectedColor

    );





    if(existing){


        existing.quantity += 1;


    }

    else{


        cart.push({


            id: product.id,


            name: product.name,


            price: product.price,


            image: product.image,


            size: selectedSize,


            color: selectedColor,


            quantity: 1


        });


    }





    saveCart(cart);



    updateCartCount();



    alert(

        product.name +

        " added to cart"

    );


}
/* REMOVE FROM CART */


function removeFromCart(productId, size, color){


    let cart = getCart();




    cart = cart.filter(item => !(

        item.id === productId &&

        item.size === size &&

        item.color === color

    ));





    saveCart(cart);



    displayCart();



    updateCartCount();



}







/* CHANGE QUANTITY */


function changeQuantity(productId, size, color, action){


    let cart = getCart();



    let item = cart.find(product =>

        product.id === productId &&

        product.size === size &&

        product.color === color

    );





    if(!item){

        return;

    }





    if(action === "plus"){


        item.quantity++;


    }





    if(action === "minus"){


        if(item.quantity > 1){

            item.quantity--;

        }


    }





    saveCart(cart);



    displayCart();



    updateCartCount();



}







/* DISPLAY CART */


function displayCart(){


    let cartContainer =
    document.getElementById("cartItems");



    if(!cartContainer){

        return;

    }





    let cart = getCart();



    cartContainer.innerHTML = "";





    if(cart.length === 0){



        cartContainer.innerHTML = `


        <div class="empty-cart">


            <h3>

            Your cart is empty

            </h3>



            <br>



            <a href="shop.html" class="btn">

            Continue Shopping

            </a>


        </div>


        `;



        updateCartTotal();



        return;


    }





    cart.forEach(item => {



        cartContainer.innerHTML += `



        <div class="cart-item">


            <img 
            src="${item.image}" 
            alt="${item.name}">





            <div class="cart-details">



                <h3>

                ${item.name}

                </h3>



                <p>

                Size: ${item.size}

                </p>




                <p>

                Color: ${item.color}

                </p>



                <p>

                Price: ৳${item.price}

                </p>





                <div class="quantity-box">


                    <button 
                    onclick="changeQuantity(${item.id}, '${item.size}', '${item.color}', 'minus')">

                    -

                    </button>





                    <span>

                    ${item.quantity}

                    </span>





                    <button 
                    onclick="changeQuantity(${item.id}, '${item.size}', '${item.color}', 'plus')">

                    +

                    </button>



                </div>



            </div>





            <div>



                <h3>

                ৳${item.price * item.quantity}

                </h3>





                <button

                class="btn"

                onclick="removeFromCart(${item.id}, '${item.size}', '${item.color}')">


                Remove


                </button>



            </div>



        </div>



        `;



    });





    updateCartTotal();


}

/* =====================================
   CART TOTAL
===================================== */


function updateCartTotal(){



    let cart = getCart();



    let total = 0;




    cart.forEach(item => {



        total += item.price * item.quantity;



    });






    let subtotal =
    document.getElementById("cartSubtotal");



    if(subtotal){


        subtotal.innerText =

        "৳" + total;


    }





    return total;


}








/* CART COUNT */


function updateCartCount(){



    let cart = getCart();



    let count = 0;



    cart.forEach(item => {



        count += item.quantity;



    });





    let cartCount =
    document.getElementById("cartCount");



    if(cartCount){


        cartCount.innerText = count;


    }



}








/* CLEAR CART */


function clearCart(){



    localStorage.removeItem(
        "peppyCart"
    );



    updateCartCount();



}








/* LOAD CART */


document.addEventListener(

"DOMContentLoaded",

function(){



    displayCart();



    updateCartCount();



}

);

/* =====================================
   PEPPY FASHION WEBSITE JAVASCRIPT
===================================== */



// ===============================
// MOBILE MENU
// ===============================


function toggleMenu(){

    let menu = document.getElementById("navMenu");


    if(menu){

        menu.classList.toggle("active");

    }

}






// ===============================
// PRODUCT SEARCH
// ===============================


function searchProducts(){


    let searchBox = document.getElementById("searchBox");


    if(!searchBox){
        return;
    }



    let value = searchBox.value.toLowerCase();



    let products = document.querySelectorAll(".product-card");



    products.forEach(function(product){



        let text = product.innerText.toLowerCase();



        if(text.includes(value)){


            product.style.display="block";


        }

        else{


            product.style.display="none";


        }



    });



}








// ===============================
// PRODUCT CATEGORY FILTER
// ===============================


function filterProducts(category){



    let products =
    document.querySelectorAll(".product-card");



    products.forEach(function(product){



        if(category === "all"){


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








// ===============================
// WHATSAPP PRODUCT ORDER
// ===============================


function orderWhatsApp(productName){



    let phone =
    "8801710868775";



    let message =

    "Hello Peppy Fashion,%0A%0A"

    +

    "I want to order:%0A"

    +

    productName;



    let link =

    "https://wa.me/"

    +

    phone

    +

    "?text="

    +

    message;



    window.open(link,"_blank");



}








// ===============================
// ORDER FORM TO WHATSAPP
// ===============================


function sendOrder(){



    let name =
    document.getElementById("name")?.value;



    let phone =
    document.getElementById("phone")?.value;



    let address =
    document.getElementById("address")?.value;



    let product =
    document.getElementById("product")?.value;



    let quantity =
    document.getElementById("quantity")?.value;



    let message =
    document.getElementById("message")?.value;





    let whatsappNumber =
    "8801710868775";





    let orderMessage =


    "New Order - Peppy Fashion%0A%0A"

    +

    "Customer Name: "
    +
    name

    +

    "%0APhone: "

    +

    phone

    +

    "%0AAddress: "

    +

    address

    +

    "%0AProduct: "

    +

    product

    +

    "%0AQuantity: "

    +

    quantity

    +

    "%0AMessage: "

    +

    message;





    let whatsappURL =


    "https://wa.me/"

    +

    whatsappNumber

    +

    "?text="

    +

    orderMessage;





    window.open(
        whatsappURL,
        "_blank"
    );



}








// ===============================
// SMOOTH SCROLL
// ===============================


document
.querySelectorAll('a[href^="#"]')
.forEach(function(link){



    link.addEventListener(
    "click",
    function(event){



        let target =
        document.querySelector(
        this.getAttribute("href")
        );



        if(target){



            event.preventDefault();



            target.scrollIntoView({

                behavior:"smooth"

            });



        }



    });



});
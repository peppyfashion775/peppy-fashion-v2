/* =====================================
   PEPPY MART
   CART SYSTEM
   UPDATED SIZE + FREE SIZE VALIDATION
===================================== */


/* =====================================
   GET CART
===================================== */

function getCart() {

    let cart = localStorage.getItem("peppyCart");

    if (cart) {

        try {

            return JSON.parse(cart);

        } catch (error) {

            console.error(
                "Cart data error:",
                error
            );

            return [];

        }

    }

    return [];

}


/* =====================================
   SAVE CART
===================================== */

function saveCart(cart) {

    localStorage.setItem(
        "peppyCart",
        JSON.stringify(cart)
    );

}


/* =====================================
   NORMALIZE SIZE
===================================== */

function normalizeProductSize(size) {

    return String(size || "")
        .trim()
        .toLowerCase();

}


/* =====================================
   CHECK FREE SIZE
===================================== */

function isFreeSizeProduct(product) {

    if (!product) {
        return false;
    }

    if (
        !Array.isArray(product.sizes) ||
        product.sizes.length === 0
    ) {
        return false;
    }

    return product.sizes.some(size => {

        return normalizeProductSize(size) ===
            "free size";

    });

}


/* =====================================
   CHECK PRODUCT SIZE
   TRUE = CUSTOMER MUST SELECT SIZE
   FALSE = NO SIZE SELECTION REQUIRED
===================================== */

function productRequiresSize(product) {

    if (!product) {
        return false;
    }


    if (
        !Array.isArray(product.sizes) ||
        product.sizes.length === 0
    ) {

        return false;

    }


    /* FREE SIZE DOES NOT REQUIRE SELECTION */

    if (
        isFreeSizeProduct(product)
    ) {

        return false;

    }


    return true;

}


/* =====================================
   GET FREE SIZE VALUE
===================================== */

function getFreeSizeValue(product) {

    if (
        !product ||
        !Array.isArray(product.sizes)
    ) {

        return "Free Size";

    }


    const freeSize =
        product.sizes.find(size => {

            return normalizeProductSize(size) ===
                "free size";

        });


    return freeSize || "Free Size";

}


/* =====================================
   VALIDATE SELECTED SIZE
===================================== */

function isValidProductSize(
    product,
    selectedSize
) {

    /*
       Free Size product is always valid.
    */

    if (
        isFreeSizeProduct(product)
    ) {

        return true;

    }


    /*
       Product without size.
    */

    if (
        !productRequiresSize(product)
    ) {

        return true;

    }


    /*
       Empty size.
    */

    if (
        !selectedSize ||
        String(selectedSize).trim() === ""
    ) {

        return false;

    }


    const selected =
        normalizeProductSize(
            selectedSize
        );


    const sizes =
        product.sizes.map(size =>
            normalizeProductSize(size)
        );


    return sizes.includes(selected);

}


/* =====================================
   REPAIR CART PRICES FROM CURRENT PRODUCTS
===================================== */

function syncCartWithProducts() {

    const cart = getCart();
    if (!Array.isArray(cart) || !cart.length) return cart;

    let changed = false;

    cart.forEach(item => {
        const product =
            typeof getProductById === "function"
                ? getProductById(item.id)
                : null;

        if (product) {
            const price = Number(product.price) || 0;
            if (Number(item.price) !== price) {
                item.price = price;
                changed = true;
            }

            if (isFreeSizeProduct(product)) {
                const freeSize = getFreeSizeValue(product);
                if (String(item.size || "") !== String(freeSize)) {
                    item.size = freeSize;
                    changed = true;
                }
            }
        }
    });

    if (changed) saveCart(cart);
    return cart;
}


/* =====================================
   ADD TO CART
===================================== */

function addToCart(
    productId,
    selectedSize = ""
) {

    let cart = getCart();


    /* =================================
       FIND PRODUCT
    ================================= */

    let product =
        typeof getProductById === "function"
            ? getProductById(productId)
            : null;


    if (!product) {

        alert(
            "Product information is not available. Please refresh the page and try again."
        );

        return false;

    }


    /* =================================
       STOCK CHECK
    ================================= */

    if (
        Number(product.stock) <= 0
    ) {

        alert(
            "Sorry, this product is currently out of stock."
        );

        return false;

    }


    /* =================================
       FREE SIZE
    ================================= */

    if (
        isFreeSizeProduct(product)
    ) {

        /*
           Automatically assign Free Size.
        */

        selectedSize =
            getFreeSizeValue(product);

    }


    /* =================================
       REQUIRED SIZE CHECK
    ================================= */

    if (
        productRequiresSize(product)
    ) {

        /*
           DO NOT automatically select
           the first size.
        */

        if (
            !selectedSize ||
            String(selectedSize).trim() === ""
        ) {

            /*
               Open size picker.
            */

            if (
                typeof openSizePicker ===
                "function"
            ) {

                openSizePicker(productId);

            } else {

                alert(
                    "Please select a size before adding this product to cart."
                );

            }

            return false;

        }


        /* INVALID SIZE */

        if (
            !isValidProductSize(
                product,
                selectedSize
            )
        ) {

            alert(
                "Please select a valid size."
            );

            return false;

        }

    }


    /* =================================
       FINAL SIZE
    ================================= */

    let size = "";


    if (
        isFreeSizeProduct(product)
    ) {

        size =
            getFreeSizeValue(product);

    } else if (
        productRequiresSize(product)
    ) {

        size =
            String(selectedSize).trim();

    }


    /* =================================
       FIND EXISTING ITEM
    ================================= */

    let existing =
        cart.find(item =>

            String(item.id).trim() ===
                String(productId).trim()

            &&

            normalizeProductSize(
                item.size
            ) ===
            normalizeProductSize(
                size
            )

        );


    /* =================================
       ADD / UPDATE
    ================================= */

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price) || 0,

            image:
                product.image,

            size:
                size,

            quantity:
                1

        });

    }


    /* =================================
       SAVE
    ================================= */

    saveCart(cart);


    /* UPDATE CART COUNT */

    updateCartCount();


    /* SUCCESS MESSAGE */

    alert(
        product.name +
        " added to cart"
    );


    return true;

}


/* =====================================
   REMOVE FROM CART
===================================== */

function removeFromCart(
    productId,
    size
) {

    let cart = getCart();


    cart = cart.filter(item => !(

        Number(item.id) ===
            Number(productId)

        &&

        normalizeProductSize(
            item.size
        ) ===
        normalizeProductSize(
            size
        )

    ));


    saveCart(cart);


    displayCart();

    updateCartCount();

}


/* =====================================
   CHANGE QUANTITY
===================================== */

function changeQuantity(
    productId,
    size,
    action
) {

    let cart = getCart();


    let item = cart.find(product =>

        String(product.id).trim() ===
            String(productId).trim()

        &&

        normalizeProductSize(
            product.size
        ) ===
        normalizeProductSize(
            size
        )

    );


    if (!item) {

        return;

    }


    /* PLUS */

    if (action === "plus") {

        item.quantity++;

    }


    /* MINUS */

    if (action === "minus") {

        if (item.quantity > 1) {

            item.quantity--;

        }

    }


    saveCart(cart);


    displayCart();

    updateCartCount();

}


/* =====================================
   DISPLAY CART
===================================== */

function displayCart() {

    const cartContainer =
        document.getElementById(
            "cartItems"
        );


    if (!cartContainer) {

        return;

    }


    let cart = getCart();


    cartContainer.innerHTML = "";


    /* =================================
       EMPTY CART
    ================================= */

    if (cart.length === 0) {

        cartContainer.innerHTML = `

        <div class="empty-cart">

            <h3>
                Your cart is empty
            </h3>

            <br>

            <a
                href="shop.html"
                class="btn"
            >
                Continue Shopping
            </a>

        </div>

        `;


        updateCartTotal();

        return;

    }


    /* =================================
       CART ITEMS
    ================================= */

    cart.forEach(item => {


        const safeSize =
            String(item.size || "");


        const sizeText =
            safeSize !== ""
                ? safeSize
                : "Free Size";


        const escapedSize =
            safeSize.replace(
                /'/g,
                "\\'"
            );


        cartContainer.innerHTML += `

        <div class="cart-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >


            <div class="cart-details">

                <h3>
                    ${item.name}
                </h3>


                <p>
                    Size: ${sizeText}
                </p>


                <p>
                    Price: ৳${item.price}
                </p>


                <div class="quantity-box">

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            '${escapedSize}',
                            'minus'
                        )"
                    >
                        -
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            '${escapedSize}',
                            'plus'
                        )"
                    >
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
                    onclick="removeFromCart(
                        ${item.id},
                        '${escapedSize}'
                    )"
                >
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

function updateCartTotal() {

    let cart = getCart();


    let total = 0;


    cart.forEach(item => {

        total +=
            (
                Number(item.price) || 0
            )
            *
            (
                Number(item.quantity) || 0
            );

    });


    /* CART SUBTOTAL */

    let subtotal =
        document.getElementById(
            "cartSubtotal"
        );


    if (subtotal) {

        subtotal.innerText =
            "৳" + total;

    }


    /* CHECKOUT TOTAL */

    let checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    if (checkoutTotal) {

        checkoutTotal.innerText =
            "৳" + total;

    }


    return total;

}


/* =====================================
   CART COUNT
===================================== */

function updateCartCount() {

    let cart = getCart();


    let count = 0;


    cart.forEach(item => {

        count +=
            Number(item.quantity) || 0;

    });


    let cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.innerText =
            count;

    }

}


/* =====================================
   VALIDATE ENTIRE CART
   USED BEFORE CHECKOUT
===================================== */

function validateCartSizes() {

    let cart = getCart();


    if (
        !cart ||
        cart.length === 0
    ) {

        return {

            valid: false,

            message:
                "Your cart is empty."

        };

    }


    for (
        let i = 0;
        i < cart.length;
        i++
    ) {

        const item =
            cart[i];


        let product =
            typeof getProductById === "function"
                ? getProductById(item.id)
                : null;


        /*
           If product data is not
           available, don't incorrectly
           reject here.
        */

        if (!product) {

            continue;

        }


        /* =================================
           FREE SIZE
        ================================= */

        if (
            isFreeSizeProduct(product)
        ) {

            /*
               Free Size is automatically
               valid.
            */

            continue;

        }


        /* =================================
           PRODUCT REQUIRES SIZE
        ================================= */

        if (
            productRequiresSize(product)
        ) {

            /* NO SIZE */

            if (
                !item.size ||
                String(item.size).trim() === ""
            ) {

                return {

                    valid: false,

                    message:
                        "Please select a size for " +
                        product.name +
                        " before checkout."

                };

            }


            /* INVALID SIZE */

            if (
                !isValidProductSize(
                    product,
                    item.size
                )
            ) {

                return {

                    valid: false,

                    message:
                        "Please select a valid size for " +
                        product.name +
                        " before checkout."

                };

            }

        }

    }


    return {

        valid: true,

        message: ""

    };

}


/* =====================================
   CLEAR CART
===================================== */

function clearCart() {

    localStorage.removeItem(
        "peppyCart"
    );


    updateCartCount();

    displayCart();

}


/* =====================================
   LOAD CART
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCart();

        updateCartCount();

    }
);
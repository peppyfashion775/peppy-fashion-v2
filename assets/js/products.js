/* =====================================
   PEPPY FASHION V3
   PRODUCT DATABASE
===================================== */


const products = [

    {
        id: 1,

        name: "Premium Cotton Shirt",

        category: "Men",

        price: 1200,

        oldPrice: 1500,

        image: "assets/images/products/shirt-1.jpg",

        badge: "New",

        stock: 10,

        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],

        description:
        "Premium quality cotton shirt with comfortable fitting."
    },



    {
        id: 2,

        name: "Casual T-Shirt",

        category: "Men",

        price: 700,

        oldPrice: 900,

        image: "assets/images/products/tshirt-1.jpg",

        badge: "Sale",

        stock: 15,

        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],

        description:
        "Soft and comfortable everyday casual t-shirt."
    },



    {
        id: 3,

        name: "Women's Fashion Dress",

        category: "Women",

        price: 1800,

        oldPrice: 2200,

        image: "assets/images/products/dress-1.jpg",

        badge: "Popular",

        stock: 8,

        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ],

        description:
        "Elegant fashion dress for modern women."
    },



    {
        id: 4,

        name: "Kids Fashion Wear",

        category: "Kids",

        price: 1000,

        oldPrice: 1300,

        image: "assets/images/products/kids-1.jpg",

        badge: "New",

        stock: 12,

        sizes: [
            "2Y",
            "4Y",
            "6Y",
            "8Y",
            "10Y"
        ],

        description:
        "Comfortable and stylish kids clothing."
    },



    {
        id: 5,

        name: "Sports Jersey",

        category: "Sports",

        price: 850,

        oldPrice: 1100,

        image: "assets/images/products/jersey-1.jpg",

        badge: "Trending",

        stock: 20,

        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],

        description:
        "High quality sports jersey."
    },



    {
        id: 6,

        name: "Running Shoes",

        category: "Sports",

        price: 2500,

        oldPrice: 3000,

        image: "assets/images/products/shoes-1.jpg",

        badge: "Best Seller",

        stock: 6,

        sizes: [
            "39",
            "40",
            "41",
            "42",
            "43"
        ],

        description:
        "Comfortable running shoes for daily use."
    },



    {
        id: 7,

        name: "Premium Hoodie",

        category: "Men",

        price: 1600,

        oldPrice: 2000,

        image: "assets/images/products/hoodie-1.jpg",

        badge: "Winter",

        stock: 9,

        sizes: [
            "M",
            "L",
            "XL",
            "XXL"
        ],

        description:
        "Warm premium hoodie collection."
    },



    {
        id: 8,

        name: "Fashion Bag",

        category: "Women",

        price: 1400,

        oldPrice: 1700,

        image: "assets/images/products/bag-1.jpg",

        badge: "New",

        stock: 7,

        sizes: [
            "Free Size"
        ],

        description:
        "Stylish handbag for women."
    }

];





/* GET SINGLE PRODUCT */

function getProductById(id){

    return products.find(product => 
        product.id == id
    );

}





/* GET CATEGORY PRODUCTS */

function getProductsByCategory(category){


    if(category === "All"){

        return products;

    }


    return products.filter(product =>

        product.category === category

    );


}
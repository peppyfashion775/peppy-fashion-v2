/* =====================================
   CHANGE PRODUCT MAIN IMAGE
===================================== */

function changeProductMainImage(imageUrl) {

    const mainImage =
        document.getElementById(
            "productMainImage"
        );

    if (!mainImage || !imageUrl) return;

    mainImage.src = imageUrl;


    /* Update active thumbnail */

    document
        .querySelectorAll(
            ".product-gallery-thumb"
        )
        .forEach(thumb => {

            thumb.classList.remove(
                "active"
            );

            if (
                thumb.dataset.image ===
                imageUrl
            ) {

                thumb.classList.add(
                    "active"
                );

            }

        });

}
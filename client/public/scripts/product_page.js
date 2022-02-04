//-- Functions --//
function loadScript(url) {
    return new Promise((resolve, reject) => {
        $.getScript(url, () => {
            resolve();
        });
    });
}

//Load navbar
async function loadNavbar() {
    //Load required components
    await loadScript("/components/navbar.js");

    //Render the navbar
    const renderedNavbar = navbar.render("product");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//Gets the id of the product the user is currently viewing
function getProductId() {
    //Split the current url up by "/"
    const urlSegments = new URL(window.location.href).pathname.split('/');

    //Get the last /
    const productid = urlSegments.at(-1);

    //Return the result
    return productid;
}

//Queries for a product image
function getProductImage(productid, i) {
    return new Promise((resolve, reject) => {
        Product.query.image(productid, i, (data) => {
            //Get the image url
            const result = data.data;

            //Resolve the promise
            resolve(result);
        });
    });
}

//Renders the product image gallery
function renderProductImages() {
    //Get the id of the product the user is currently viewing
    const productid = getProductId();

    //Get the number of images the currently viewed product has
    Product.query.imageCount(productid, async (imageGalleryCount) => {
        //Checks if the number is larger than 0
        if (imageGalleryCount > 0) {
            //There is at least 1 image in the product's image gallery
            //Retrieve the images
            for (let i = 1; i <= imageGalleryCount; i++) {
                //Get the url of the image with the current sequence id
                const imageUrl = await getProductImage(productid, i);

                //Render components for the carousel
                const carouselIndicator = Product.render.carousel.imageIndicator("#imageCarousel", i - 1);
                const carouselSlide = Product.render.carousel.imageSlide(imageUrl, (i == 1));

                //Update the carousel with the rendered components
                $("#imageCarousel .carousel-indicators").append(carouselIndicator);
                $("#imageCarousel .carousel-inner").append(carouselSlide);
            }
        } else {
            //There are no images for this product, render the default image
            //Render components for the carousel
            const carouselIndicator = Product.render.carousel.imageIndicator("#imageCarousel", 0);
            const carouselSlide = Product.render.carousel.imageSlide(null, true);

            //Update the carousel with the rendered components
            $("#imageCarousel .carousel-indicators").append(carouselIndicator);
            $("#imageCarousel .carousel-inner").append(carouselSlide);
        }
    });
}

//Renders product price
function renderProductPrice(price, discount) {
    //Check if there are any discounts for the current item
    if (!discount) {
        //There are no ongoing discounts
        return(`<span>$${price.toFixed(2)}</span>`);
    } else {
        //There is a ongoing discount for the current item
        return (
            `
                <span class="text-decoration-line-through">$${price.toFixed(2)}</span>
                <span>$${(price - discount).toFixed(2)}</span>
            `
        );
    }
}

//Renders product info
function renderProductInfo() {
    //Get product id
    const productid = getProductId();

    //Retrieve product info
    Product.query.by.id(productid, (response) => {
        //Get response data
        const data = response.data;

        //Check if any data was obtained
        if (data) {
            //The product id is valid, render the data
            //-- Product Name --//
            $("#product-name").empty().html(data.name);

            //-- Product Price --//
            const renderedPrice = renderProductPrice(data.price);
            $("#product-price").empty().html(renderedPrice);

            //-- Product Description --//
            $("#product-desc").empty().html(data.description);
        }
    });

    //Retrieve product rating
    Product.query.averageRating(productid, (response) => {
        //Check if any data was obtained
        if (response) {
            //This product has at least 1 rating
            //Render the product rating component
            const renderedComponent = Product.render.product.rating(response);

            //Append the rendered component to the DOM
            $("#productRating").append(renderedComponent);
        }
    });
}

//Renders related products
function renderRelatedProducts() {
    //Get product id
    const productid = getProductId();

    //Retrieve category of product
    Product.query.by.id(productid, (response) => {
        //Check if any data was returned
        if (response.data) {
            //Get the category id of the product
            const categoryid = response.data.categoryid;

            //Get all products under the same category
            Product.query.by.category(categoryid, async (response) => {
                //Get response data
                const data = response.data;
                
                //Check if any data was returned
                if (data != null && data.length > 0) {
                    //At least 1 item was returned
                    //Loop though the data
                    for (let i = 0; i < data.length; i++) {
                        //Select the product at the current index
                        const currProduct = data[i];

                        //Check if the current product is the product the user is currently viewing
                        if (currProduct.productid != productid) {
                            //Check if we need to clear the #recommended div to make space for content
                            if ($("#recommended-none")) {
                                //Clear the target div
                                $("#recommended").empty();

                                //Prepare the target div's class to hold item cards
                                $("#recommended").addClass(["row-cols-2", "row-cols-md-3", "row-cols-xl-4"]);

                                //Remove classes from the footer
                                $("footer").removeClass(["position-absolute", "bottom-0", "container-fluid"]);
                            }

                            //This is a different product
                            //Render the product
                            const renderedProductCard = await Product.render.product.relatedCard(currProduct.productid, currProduct.name, currProduct.price);

                            //Add the rendered product card to the DOM
                            $("#recommended").append(renderedProductCard);
                        }
                    }
                }
            });
        }
    });
}

//-- On document load --//
$(document).ready(async () => {
    //Load required components
    await loadScript("/scripts/Product.js");
    
    //Product image
    renderProductImages();

    //Render product info
    renderProductInfo();

    //Render related products
    renderRelatedProducts();
});


//Initialise components
loadNavbar();
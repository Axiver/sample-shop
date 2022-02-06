//-- Global variables --//
let imageQueue = [];
let deletedImages = [];
let newProductid = null;

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

    //Perform a GET request to the server in order to retrieve a list of category names
    Category.query.getAll(async (response) => {
        //Get the data
        const categories = response.data;

        //Render the navbar
        const renderedNavbar = await navbar.render("product", categories);

        //Add it to the DOM
        $("body").prepend(renderedNavbar);
    });
}

//Gets the id of the product the user is currently editing
function getProductId() {
    //Retrieve url parameters
    const urlParams = new URLSearchParams(window.location.search);

    //Get product id if it exists
    let productid = null;
    if (urlParams.has('productid')) {
        productid = urlParams.get('productid');
    }

    if (newProductid)
        productid = newProductid;

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

    //Check if the user is editing a existing product
    if (productid != null) {
        //User is editing an existing product
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
                    const carouselSlide = Product.render.carousel.imageSlide(imageUrl, (i == 1), false, i);

                    //Update the carousel with the rendered components
                    $("#imageCarousel .carousel-indicators").append(carouselIndicator);
                    $("#imageCarousel .carousel-inner").append(carouselSlide);
                }
            } else {
                //There are no images for this product, render the default image
                //Render components for the carousel
                const carouselIndicator = Product.render.carousel.imageIndicator("#imageCarousel", 0);
                const carouselSlide = Product.render.carousel.imageSlide("/assets/img/blank.png", true, true);

                //Update the carousel with the rendered components
                $("#imageCarousel .carousel-indicators").append(carouselIndicator);
                $("#imageCarousel .carousel-inner").append(carouselSlide);
            }
        });
    } else {
        //There are no images for this product, render the default image
        //Render components for the carousel
        const carouselIndicator = Product.render.carousel.imageIndicator("#imageCarousel", 0);
        const carouselSlide = Product.render.carousel.imageSlide("/assets/img/blank.png", true, true);

        //Update the carousel with the rendered components
        $("#imageCarousel .carousel-indicators").append(carouselIndicator);
        $("#imageCarousel .carousel-inner").append(carouselSlide);
    }
}

//Renders product categories
function renderCategories() {
    return new Promise((resolve, reject) => {
        //Retrieves all available categories
        Category.query.getAll((response) => {
            //Check if we got any results
            const results = response.data;

            if (results && results.length > 0) {
                //We got at least 1 row
                //Loop through the results
                for (let i = 0; i < results.length; i++) {
                    //Select the category at the current index
                    const category = results[i];

                    //Render the category
                    const renderedCategory = Category.render.selectOption(category.category, category.categoryid);

                    //Update the DOM
                    $("#categorySelect").append(renderedCategory);
                }
            }

            //Resolve the promise
            resolve();
        });
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

    //Check if the user is editing a existing product
    if (productid != null) {
        //User is editing an exisitng product
        //Retrieve product info
        Product.query.by.id(productid, (response) => {
            //Get response data
            const data = response.data;

            //Check if any data was obtained
            if (data) {
                //The product id is valid, render the data
                //-- Product Name --//
                $("#inputProductName").val(data.name);

                //-- Product Price --//
                $("#inputProductPrice").val(data.price.toFixed(2));

                //-- Product Description --//
                $("#inputProductDesc").val(data.description);

                //-- Product Category --//
                $(`#categorySelect option[value="${data.categoryname}"]`).attr("selected", true);

                //-- Product Brand --//
                $("#inputProductBrand").val(data.brand);

                //-- Modify create button text --//
                $("#createButton").text("Modify");
            }
        });
    }
}

//Adds image to queue
function addImage(e) {
    //Check if a file was uploaded
    if (e.target.files.length > 0) {
        //A file was uploaded, make it a previewiable url
        var src = URL.createObjectURL(e.target.files[0]);

        //Check if this is the default image being replaced
        const fistSlide = $(".carousel-item img").eq(0);
        if (imageQueue.length == 0 && fistSlide.attr("src") == "/assets/img/blank.png") {
            //This is the first image, modify the first slide of the carousel
            fistSlide.attr("src", src);
        } else {
            //We are adding another image
            //Remove the active class from the active slide and indicator
            $(".carousel-item.active").eq(0).removeClass("active");
            $(".carousel-indicators button[data-bs-target='#imageCarousel'].active").eq(0).removeClass("active");

            //Render components for the carousel
            const carouselIndicator = Product.render.carousel.imageIndicator("#imageCarousel", $(".carousel-item").length, true);
            const carouselSlide = Product.render.carousel.imageSlide(src, true, true, null, imageQueue.length);

            //Update the carousel with the rendered components
            $("#imageCarousel .carousel-indicators").append(carouselIndicator);
            $("#imageCarousel .carousel-inner").append(carouselSlide);
        }

        //Add the image to the image queue
        imageQueue.push(e.target.files[0]);

        //Clear the file input
        $("#inputImage").val("");
    }
}

//Deletes image from queue
function deleteImage() {
    //Retrieves the image that is currently being displayed
    const image = $(".carousel-item.active").eq(0);

    //Checks if this is the default image
    if (image.attr("src") == "/assets/img/blank.png") {
        //This is the default image, do not delete.
        return;
    }

    //Get the id of the carousel slide
    const images = $(".carousel-item");
    let index = 0;
    for (let i = 0; i < images.length; i++) {
        if (image.is(images.eq(i))) {
            //This is the index of the image that is to be deleted
            index = i;
            break;
        }
    }

    //Check if this is an image that was uploaded or a image that already exists on the server
    if (image.attr("data-localimageid")) {
        //This is a local iamge
        //Pop the image from the imagequeue array
        imageQueue.splice(image.attr("data-localimageid"), 1);
    } else {
        //This is not a local image
        //Retrieve the imageid from the carousel slide and add it to the deleted images array
        deletedImages.push(image.attr("data-imageid"));
    }

    //Checks if this is the first and only image
    if (index == 0 && imageQueue.length == 0) {
        //This is the first and only image, just set it to the default image and return
        image.find("img").attr("src", "/assets/img/blank.png");
        return;
    } else {
        //This is not the first and only image
        //Get associated indicator
        const indicator = $(`button[data-bs-slide-to='${index}']`).eq(0);

        //Update the DOM
        image.remove();
        indicator.remove();

        //Mark first image as active
        const firstSlide = $(".carousel-item").eq(0);
        if (!firstSlide.hasClass("active")) {
            firstSlide.eq(0).addClass("active");
        }

        //Mark first indicator as active
        const firstIndicator = $(".carousel-indicators button[data-bs-target='#imageCarousel']").eq(0);
        if (!firstIndicator.hasClass("active")) {
            firstIndicator.addClass("active");
        }

        //Modify the values of the other indicators
        const indicators = $(".carousel-indicators button[data-bs-target='#imageCarousel']");
        for (let i = index; i < indicators.length; i++) {
            indicators.eq(i).attr("data-bs-slide-to", indicators.eq(i).attr("data-bs-slide-to") - 1);
        }
    }
}

//Deletes product images
function deleteProductImages(productid, imagesToDelete, token) {
    return new Promise(async (resolve, reject) => {
        //Checks if there are any images to delete
        if (imagesToDelete.length > 0) {
            //We need to delete images
            //Loop through the deleted images array
            for (let i = 0; i < imagesToDelete.length; i++) {
                //Delete the image with the id at the current index
                await Product.delete.image(productid, imagesToDelete[i], token, (err, response) => {
                    //Checks if there was an error
                    if (err) {
                        //An error occured 
                        console.log("error occured while trying to delete image with id: " + imagesToDelete[i], err);

                        resolve(err);
                    }
                });
            }

            //Loop over, resolve promise
            resolve();
        } else {
            //There are none to delete
            resolve();
        }
    });
}

//Uploads product images
function uploadProductImages(productid, imagesToUpload, token) {
    return new Promise(async (resolve, reject) => {
        //Checks if there are any images to upload
        if (imagesToUpload.length > 0) {
            //There is at least 1 image to upload
            for (let i = 0; i < imagesToUpload.length; i++) {
                //Select the image at the current index
                const currImage = imagesToUpload[i];
        
                //Upload the image
                await Product.create.image(productid, currImage, token, (err, result) => {
                    //Checks if it was successful
                    if (err) {
                        //An error occured
                        console.log("error occured trying to upload images: ", err);
        
                        resolve(err);
                    }
                });
            }

            //Loops over, resolve promise
            resolve();
        } else {
            //There are no images to upload
            resolve();
        }
    });
}

//Populate promotions table
function populatePromotionsTable() {
    //Get product id
    const productid = getProductId();

    //Check if this is an existing product
    if (productid) {
        //Retrieve all promotions for the product
        Product.query.allPromotions(productid, (promotions) => {
            //Check if theere are any promotions for this product
            if (promotions && promotions.length > 0) {
                //There is at least 1 promotion, render the promotions
                for (let i = 0; i < promotions.length; i++) {
                    //Select the promotion at the current index
                    const promotion = promotions[i];

                    //Render the promotion
                    const renderedPromotion = Product.render.table.promotionRow(promotion, i + 1);

                    //Update the DOM
                    $("#promotion-list-content").append(renderedPromotion);
                }
            }
        });
    }
}

//Create promotion
function createPromotion() {
    //-- Verify validity of user input --//
    //Create a new validator
    const validator = new Validator("#promotionErrorMessage");

    //Verify promotional value
    const discount = validator.validate.promotion.value("#discountInput");
    if (!discount) {
        return;
    }

    //Verify promotion start date and time
    let startTime = validator.validate.promotion.start("#promotion-start-input");
    if (!startTime) {
        return;
    }
    startTime = startTime.replace("T", " ");

    //Verify promotion end date and time
    let endTime = validator.validate.promotion.end("#promotion-end-input");
    if (!endTime) {
        return;
    }
    endTime = endTime.replace("T", " ");

    //All checks passed, get product id
    const productid = getProductId();
    
    //Get bearer token
    User.retrieveSessionData((userData) => {
        //Create promotion
        Product.create.promotion(productid, discount, startTime, endTime, userData.token, (err, response) => {
            //Check if there was an error
            if (err) {
                //There was an error

                //Check what error it is
                if (err.response.data && err.response.data.error == "PROMO_OVERLAP") {
                    //Render a error message
                    $("#promotionErrorMessage").removeClass("text-success").addClass("text-danger");
                    $("#promotionErrorMessage").text("Promotion overlaps with an existing one");
                } else {
                    //Render a error message
                    $("#promotionErrorMessage").removeClass("text-success").addClass("text-danger");
                    $("#promotionErrorMessage").text("An error occured. Please try again later");
                }
                return;
            }

            //There was no error, render a success message
            $("#promotionErrorMessage").removeClass("text-danger").addClass("text-success");
            $("#promotionErrorMessage").text("Promotion created");

            //Clear input fields
            $("#discountInput").val();
            $("#promotion-start-input").val();
            $("#promotion-end-input").val();

            //Reload the promotions table
            $("#promotion-list-content").empty();
            populatePromotionsTable();
        });
    });
}

//Create product
function createProduct() {
    //-- Verify validity of user input --//
    //Create a new validator
    const validator = new Validator("#errorMessage")
    
    //Validate product name
    const productName = validator.validate.product.name("#inputProductName");
    if (!productName) {
        return;
    }

    //Validate product price
    const productPrice = validator.validate.product.price("#inputProductPrice");
    if (!productPrice) {
        return;
    }

    //Validate product description
    const productDescription = validator.validate.product.description("#inputProductDesc");
    if (!productDescription) {
        return;
    }

    //Validate product category
    const productCategory = validator.validate.product.category("#categorySelect");
    if (!productCategory) {
        return;
    }
    const productCategoryid = $("#categorySelect").find("option:selected").eq(0).attr("data-categoryid");

    //Validate product brand
    const productBrand = validator.validate.product.brand("#inputProductBrand");
    if (!productBrand) {
        return;
    }

    //Validate product images
    let productImages = validator.validate.product.images("#imageCarousel", $(".carousel-item"));
    if (!productImages) {
        return;
    }
    productImages = imageQueue;

    //All validation passed, create/modify product!
    //Get bearer token
    User.retrieveSessionData((userData) => {
        const token = userData.token;

        //Check whether to create or modify product
        //Get product id
        const productid = getProductId();

        if (productid) {
            //Modify existing product
            Product.modify.product(productid, productName, productPrice, productCategoryid, productDescription, productBrand, token, async (error, result) => {
                //Check if it was successful
                if (error) {
                    //An error occured 
                    console.log("error occured while trying to modify product: ", error);

                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                }

                //Success, check if we need to delete any images
                error = await deleteProductImages(productid, deletedImages, token);

                //Checks if there was any error
                if (error) {
                    //There was an error
                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                }

                //Success, check if we need to upload any images
                error = await uploadProductImages(productid, productImages, token);

                //Checks if there was any error
                if (error) {
                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                } else {
                    //Successfully updated product info
                    //Render a success message
                    $("#errorMessage").removeClass("text-danger").addClass("text-success");
                    $("#errorMessage").text("Product updated successfully");
                }
            });
        } else {
            //Create new product
            Product.create.product(productName, productPrice, productCategoryid, productDescription, productBrand, token, async (error, result) => {
                //Check if it was successful
                if (error) {
                    //An error occured 
                    console.log("error occured while trying to create product: ", error);

                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                }
                
                //Success, obtain productid
                const productid = result.data.productid;

                //Loop through the product images and upload them
                const err = await uploadProductImages(productid, productImages, token);
                
                //Check if the operation was successful
                if (!error && !err) {
                    //Render a success message
                    $("#errorMessage").removeClass("text-danger").addClass("text-success");
                    $("#errorMessage").text("Product created successfully");

                    //Modify create button text
                    $("#createButton").text("Modify");

                    //Add product id to global varaible
                    newProductid = productid;
                } else {
                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                }
            });
        }
        
    });
}

//-- On document load --//
$(document).ready(async () => {
    //Load required components
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/Product.js");
	await loadScript("/scripts/User.js");
    await loadScript("/scripts/InputValidation.js");

    //Load navbar
    loadNavbar();

    //Product image
    renderProductImages();

    //Render available categories
    await renderCategories();

    //Render product info
    renderProductInfo();

    //Populate promotions table
    populatePromotionsTable();
});
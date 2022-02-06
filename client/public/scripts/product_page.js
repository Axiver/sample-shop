//-- Global variables --//
let previousStarRating = 0;

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

//Disables the review input
function disableReviewInput(reason) {
    //Disable the review input
    $("#userReview").attr("disabled", "disabled");
    $("#submitReviewButton").attr("disabled", "disabled");
    $("label > i").off("mouseenter");
    $("label > i").off("mouseoff");
    $("label > i").off("click");
    $("label > i").removeClass("enabledRating");

    //Display a reason
    $("#reviewLabel").text(reason);

    console.log("complete");
}

//Enables the review input
function enableReviewInput() {
    //The user is logged in, enable the textarea and button
    $("#userReview").removeAttr("disabled");
    $("#submitReviewButton").removeAttr("disabled");
    $("label > i").addClass("enabledRating");

    //Modify the label text
    $("#reviewLabel").text("Review");

    //Star rating hover handler
    $("label > i").on("mouseenter", (e) => {
        //Handle the hover event
        RatingHandler.handlers.hoverHandler(e);
    });

    //Star rating mouse off handler
    $("label > i").on("mouseout", (e) => {
        //Handle the mouse off event
        RatingHandler.handlers.mouseOffHandler(e, previousStarRating);
    });

    //Star rating on click handler
    $("label > i").on("click", (e) => {
        //Handle the click event
        RatingHandler.handlers.click(e);
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
                <span class="text-decoration-line-through text-danger fs-6">$${price.toFixed(2)}</span>
                <span>$${(price - discount).toFixed(2)}</span>
            `
        );
    }
}

//Gets the time left to a certain date and returns the result as a string
function timeToDate(date) {
    //Get current time
    const firstDate = moment(new Date());

    //Convert date object to moment object
    const secondDate = moment(date);

    //Get the time difference
    const timeDiff = moment.duration(secondDate.diff(firstDate));

    //Format a string
    const result = `${(timeDiff.days() != 0) ? `${timeDiff.days()} days, ` : ""}${timeDiff.hours()}:${timeDiff.minutes()}:${timeDiff.seconds()}`;

    //Return the result
    return result;
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
            //The product id is valid, check if there are any ongoing promotions for the product
            Product.query.ongoingPromotions(productid, (promotion) => {
                //Render the data
                //-- Product Category --//
                $("#category-name").empty().text(data.categoryname);

                //-- Product Name --//
                $("#product-name").empty().html(data.name);

                //-- Product Price --//
                const renderedPrice = renderProductPrice(data.price, promotion.discount);
                $("#product-price").empty().html(renderedPrice);

                //-- Product Description --//
                $("#product-desc").empty().html(data.description);

                //Check if there are any ongoing promotions
                if (promotion) {
                    //Convert validity deadline from ms to dd hh:mm:ss
                    let renderedValidity = timeToDate(promotion.end_date);

                    //Render the promotion validity component every 1s
                    $("#promotion-validity-container").removeClass("d-none");
                    $("#promotion-validity").text("Promotion ends in " + renderedValidity);

                    setInterval(() => {
                        renderedValidity = timeToDate(promotion.end_date);
                        $("#promotion-validity").text("Promotion ends in " + renderedValidity);
                    }, 1000);
                }
            });
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

//Renders product reviews
function renderProductReviews() {
    //Get product id
    const productid = getProductId();

    //Retrieve reviews for the product
    Product.query.reviews(productid, (reviews) => {
        //Check if any data was returned
        if (reviews) {
            //There is at least 1 review, clear the reviews div
            $("#reviews").empty();

            //Loop through the reviews and render each one
            for (let i = 0; i < reviews.length; i++) {
                //Select the review at the current index
                const review = reviews[i];
                
                //Format the time the review was created at
                const createdDateSplit = review.created_at.split(" ")[0].split("-");
                const createdDate = createdDateSplit[2] + "/" + createdDateSplit[1] + "/" + createdDateSplit[0];
                const createdTime = review.created_at.split(" ")[1];

                //Render the review
                const renderedReview = (
                    `
                    <div class="col-12 p-4 mt-4 shadow rounded-3">
                        <div class="row">
                            <div class="col">
                                <img height="100%" width="100%" class="img-profile rounded-circle d-inline-block" src="${User.parseProfilePicUrl(review.profile_pic_url)}">
                                <h6 class="ms-2 d-inline-block">${review.username}</h6>
                            </div>
                            <div class="col">
                                <p class="fs-6 text-end">${createdTime + " " + createdDate}</p>
                            </div>
                        </div>
                        <div class="mt-2">
                            ${Product.render.product.rating(review.rating)}
                        </div>
                        <div>
                            <p>${review.review}</p>
                        </div>
                    </div>
                    `
                );

                //Update the DOM
                $("#reviews").append(renderedReview);

                //Check if the reviewer is the currently logged in user
                User.retrieveSessionData((userInfo) => {
                    if (review.userid == userInfo.userid) {
                        //Disable the review input
                        disableReviewInput("You can only review this product once");
                    }
                });
            }
        }
    });
}

//Checks whether or not the user is allowed to write reviews
function checkReviewEligibility() {
    //Checks whether or not the user is logged in
    User.retrieveSessionData((data) => {
        if (data) {
            //Check if the input is disabled for other reasons
            if ($("#reviewLabel").text() == "You need to login to write a review") {
                //The input is not disabled for other reasons
                enableReviewInput();
            }
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
                                $("footer").removeClass("container-fluid");
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

//Submits a review
function submitReview() {
    //Verify review input
    const validator = new Validator("#errorMessage");

    //Verify the review input field
    const review = validator.validate.review("#userReview");

    //Check the outcome
    if (!review) {
        //The review input is not valid
        return;
    }

    //Get the current rating
    const ratingLabels = $("label > i");
    let rating = 0;
    for (let i = 0; i < ratingLabels.length; i++) {
        //Check if the rating at the current index is selected
        if (ratingLabels.eq(i).hasClass("fas")) {
            rating++;
        }
    }

    //Check if the rating is more than 0
    if (rating == 0) {
        //Invalid rating
        $("#errorMessage").text("Rating cannot be 0");

        return;
    }

    //Get product id
    const productid = getProductId();

    //All checks passed, review is valid. Submit the review.
    //Retrieve session data
    User.retrieveSessionData((sessionData) => {
        //Submit the review
        Product.create.review(sessionData.userid, productid, rating, review, sessionData.token,(err, response) => {
            //Check if there was an error
            if (!response.data) {
                //There was an error
                console.log(err);
                
                //Display an error message
                $("#errorMessage").text("An error occured while trying to publish the review. Please try again later");
                return;
            }

            //There was no error
            //Clear the textarea input
            $("#userReview").val("");

            //Retrieve the new review from the database
            Product.query.review(productid, response.data.reviewid, (review) => {
                console.log(review);
                //Render the review
                const renderedReview = (
                    `
                    <div class="col-12 p-4 mt-4 shadow rounded-3">
                        <div>
                            <img height="100%" width="100%" class="img-profile rounded-circle d-inline-block" src="${User.parseProfilePicUrl(review.profile_pic_url)}">
                            <h6 class="ms-2 d-inline-block">${review.username}</h6>
                        </div>
                        <div class="mt-2">
                            ${Product.render.product.rating(review.rating)}
                        </div>
                        <div>
                            <p>${review.review}</p>
                        </div>
                    </div>
                    `
                );

                //Update the DOM
                $("#reviews").append(renderedReview);

                //Render a success text
                $("#errorMessage").removeClass("text-danger").addClass("text-success");
                $("#errorMessage").text("Review posted!");

                //Reset review input
                $("#userRating").text("0");
                $("#userReview").removeClass("is-valid");

                //Clear stars
                for (let j = 0; j < ratingLabels.length; j++) {
                    //Get the current label
                    const currLabel = ratingLabels.eq(j);

                    //Make it a outline
                    currLabel.removeClass("fas");
                    currLabel.addClass("far");
                }

                //Disable the review input
                disableReviewInput("You can only review this product once");
            });
        });
    });
}


//-- On document load --//
$(document).ready(async () => {
    //Load required components
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/Product.js");
	await loadScript("/scripts/User.js");
    await loadScript("/scripts/InputValidation.js");
    await loadScript("/scripts/RatingHandler.js");

    //Load navbar
    loadNavbar();

    //Product image
    renderProductImages();

    //Render product info
    renderProductInfo();

    //Check if user is allowed to write reviews
    checkReviewEligibility();

    //Render product reviews
    renderProductReviews();

    //Render related products
    renderRelatedProducts();
});
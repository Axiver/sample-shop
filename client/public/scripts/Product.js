//-- Global variables --//
const baseUrl = window.location.origin.replace(":3001", ":3000");

//-- Functions --//
//Query requests
let Product = {};
Product.query = {
    /**
     * Queries the server for products to feature
     * Has a timeout of 1000ms
     * TODO: calculate products to feature instead of just pulling from /ratings/
     * @param {()} callback Invoked when the operation is completed
     */
    featured: (callback) => {
        const reqUrl = baseUrl + '/api/product/sort/ratings/';
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(response);
            return response;
        }).catch((err) => {
            //Error encountered, return null
            console.log("Error encountered rendering featured items: ", err.message);
            if (callback)
                callback({data: null});
            return {data: null};
        });
    },
    /**
     * Queries the server for all products within a certain category
     * Has a timeout of 1000ms
     * @param {number} categoryid The id of the category
     * @param {()} callback Invoked when the operation is completed
     */
    byCategory: (categoryid, callback) => {
        return new Promise((resolve, reject) => {
            const reqUrl = baseUrl + '/api/product/filter/category/' + categoryid;
            axios({
                method: 'get',
                url: reqUrl,
                timeout: 1000
            }).then((response) => {
                //Invoke callback with the response data
                if (callback)
                    callback(response);
                resolve(response);
            }).catch((err) => {
                //Error encountered, return null
                console.log("Error encountered querying for products with category id #" + categoryid + ": ", err.message);
                if (callback)
                    callback({data: null});
                resolve({data: null});
            });
        });
    },
    /**
     * Queries the server for information regarding the product matching the specified id
     * Has a timeout of 1000ms
     * @param {number} productid The id of the product
     * @param {()} callback Invoked when the operation is completed
     */
    byId: (productid, callback) => {
        return new Promise((resolve, reject) => {
            const reqUrl = baseUrl + '/api/product/' + productid;
            axios({
                method: 'get',
                url: reqUrl,
                timeout: 1000
            }).then((response) => {
                //Invoke callback with the response data
                if (callback)
                    callback(response);
                resolve(response);
            }).catch((err) => {
                //Error encountered, return null
                console.log("Error encountered querying for product #" + productid + ": ", err.message);
                if (callback)
                    callback({data: null});
                resolve({data: null});
            });
        });
    },
    /**
     * Queries the cover image for a product
     * @param {number} productid The id of the product to retrieve the cover image for
     * @param {number} sequenceid The id of the image to be retrieved
     * @param {()} callback Invoked when the operation is completed
     */
    image: (productid, sequenceid, callback) => {
        const reqUrl = baseUrl + `/api/product/${productid}/image/${sequenceid}`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(response);
            return response;
        }).catch((err) => {
            //Error encountered, check if it is an unknown error
            if (err.status != 404) {
                //Unknown error
                console.log(`Error encountered querying for product image #${sequenceid} for the product with id #${productid}: `, err.message);
            }
            //Return null
            if (callback)
                callback({data: null});
            return {data: null};
        });
    },
    /**
     * Queries the image gallery for a product
     * @param {number} productid The id of the product to retrieve the image gallery for
     * @param {()} callback Invoked when the operation is completed
     */
    imageCount: (productid, callback) => {
        //Get the number of images a product has
        const reqUrl = baseUrl + `/api/product/${productid}/image/`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Get the total number of images the product has
            const totalImages = response.data.count;

            //Return the result
            if (callback)
                callback(totalImages);
            return totalImages;
        }).catch((err) => {
            //Error encountered, check if it is an unknown error
            if (err.status != 404) {
                //Unknown error
                console.log("Error encountered querying for the image count of product with id #" + productid + ": ", err.message);
            }
            //Return 0
            if (callback)
                callback(0);
            return 0;
        });
    },
    /**
     * Queries the average rating of a product
     * @param {number} productid The id of the product to retrieve the average ratings for
     * @param {()} callback Invoked when the operation is completed 
     */
    averageRating: (productid, callback) => {
        //Get the number of images a product has
        const reqUrl = baseUrl + `/api/product/${productid}/reviews/average/`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            console.log("response: ", response);
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, check if it is an unknown error
            if (err.status != 404) {
                //Unknown error
                console.log("Error encountered querying for the average ratings of product with id #" + productid + ": ", err.message);
            }
            //Return null
            if (callback)
                callback(null);
            return null;
        });
    }
}

//-- Main component --//
//Renders a product component
Product.render = {
    productRating: (avgRating) => {
        //Check if the product has any ratings at all
        console.log(avgRating);
        if (avgRating) {
            //The product has at least 1 review
            //Calculate the number of stars we need to render
            const filledStarsCount = Math.floor(avgRating);
            const emptyStarsCount = Math.floor(5 - avgRating);
            const partialStarCount = (avgRating - filledStarsCount) * 100;

            //Render the stars
            let renderedStars = "";
            
            //Render the filled stars
            if (filledStarsCount > 0) {
                for (let i = 1; i <= filledStarsCount; i++) {
                    renderedStars += `<i class="fas fa-star"></i>`;
                }
            }

            //Render partial star
            if (partialStarCount > 0) {
                renderedStars += `<span class="stacked-star"><i style="width: ${partialStarCount.toFixed(0)}%;" class="fa fa-star overflow-hidden"></i><i class="far fa-star"></i></span>`;
            }

            //Render empty star
            if (emptyStarsCount > 0) {
                for (let j = 1; j <= emptyStarsCount; j++) {
                    renderedStars += `<i class="far fa-star"></i>`;
                }
            }

            //Stars rendered, return the result
            return (
                `
                    <!-- Product ratings-->
                    <div class="d-flex small mb-2">
                        <div class="d-flex text-warning align-items-center">${renderedStars}</div>
                        <div class="ms-2">
                            <h6 class="fw-normal m-0">${avgRating.toFixed(1)}/5.0</h6>
                        </div>
                    </div>
                `
            );
        } else {
            return "";
        }
    },
     /**
     * Renders a product card
     * @param {number} productid The id of the product
     * @param {string} productName The name of the product
     * @param {number} productPrice The price of the product
     * @param {number} discount Discounts on the product, if any
     * @returns {string} Rendered component
     */
    productCard: (productid, productName, productPrice, discount) => {
        return new Promise(async (resolve, reject) => {
            //Render the price
            let renderedPrice = "";

            //Obtain the product image if any
            Product.query.image(productid, 1, (result) => {
                //Check if there are any product images for this item
                let productImageUrl = baseUrl + result.data;
                if (result.data == null)
                    productImageUrl = "/assets/img/default.png";
                //Check if there are any discounts for the current item
                if (!discount) {
                    //There are no ongoing discounts
                    renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;">$${productPrice.toFixed(2)}</h6>`;
                } else {
                    //There is a ongoing discount for the current item
                    renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;"><span class="text-decoration-line-through">$${productPrice.toFixed(2)}</span> $${(productPrice - discount).toFixed(2)}</h6>`;
                }

                //Get the average ratings of the product
                Product.query.averageRating(productid, (avgRating) => {
                    //Render the rating stars for the product
                    const productRating = Product.render.productRating(avgRating);
                    //Return the component
                    resolve (`
                        <div class="col d-flex">
                            <div class="card px-0 shadow border-0">
                                <!-- Product image-->
                                <img height="55%" width="100%" style="object-fit: cover;" class="card-img-top" src="${productImageUrl}" alt="..." />
                                <!-- Product details-->
                                <div class="card-body p-4">
                                    <div>
                                        <!-- Product name-->
                                        <h5 class="card-title">${productName}</h5>
                                        ${productRating}
                                    </div>
                                </div>
                                <!-- Product Footer-->
                                <div class="card-footer d-flex p-4 pt-0 border-top-0 bg-transparent justify-content-between align-items-center">
                                    <!-- Product price-->
                                    <div class="d-inline-block">
                                        ${renderedPrice}
                                    </div>
                                    <!-- View Item Button -->
                                    <div class="text-center d-inline-block"><a class="btn btn-outline-success mt-auto" href="/product/${productid}">View item</a></div>
                                </div>
                            </div>
                        </div>
                    `);
                });
            });
        });
    },
    /**
     * Renders a product card for the related section of product pages
     * @param {number} productid The id of the product
     * @param {string} productName The name of the product
     * @param {number} productPrice The price of the product
     * @param {number} discount Discounts on the product, if any
     * @returns {string} Rendered component
     */
    relatedProductCard: (productid, productName, productPrice, discount) => {
        return new Promise(async (resolve, reject) => {
            //Render the price
            let renderedPrice = "";

            //Obtain the product image if any
            Product.query.image(productid, 1, (result) => {
                //Format the product image url
                let productImageUrl = baseUrl + result.data;

                //Check if there are any product images for this item
                if (result.data == null)
                    productImageUrl = "/assets/img/default.png";

                //Check if there are any discounts for the current item
                if (!discount) {
                    //There are no ongoing discounts
                    renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;">$${productPrice.toFixed(2)}</h6>`;
                } else {
                    //There is a ongoing discount for the current item
                    renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;"><span class="text-decoration-line-through">$${productPrice.toFixed(2)}</span> $${(productPrice - discount).toFixed(2)}</h6>`;
                }

                //Get the average ratings of the product
                Product.query.averageRating(productid, (avgRating) => {
                    //Render the rating stars for the product
                    const productRating = Product.render.productRating(avgRating);

                    //Return the component
                    resolve (`
                        <div class="col mb-5 d-flex">
                            <div class="card px-0 shadow border-0">
                                <!-- Product image-->
                                <img height="55%" width="100%" style="object-fit: cover;" class="card-img-top" src="${productImageUrl}" alt="..." />
                                <!-- Product details-->
                                <div class="card-body p-4">
                                    <div>
                                        <!-- Product name-->
                                        <h5 class="card-title">${productName}</h5>
                                        ${productRating}
                                    </div>
                                </div>
                                <!-- Product Footer-->
                                <div class="card-footer d-flex p-4 pt-0 border-top-0 bg-transparent justify-content-between align-items-center">
                                    <!-- Product price-->
                                    <div class="d-inline-block">
                                        ${renderedPrice}
                                    </div>
                                    <!-- View Item Button -->
                                    <div class="text-center d-inline-block"><a class="btn btn-outline-success mt-auto" href="/product/${productid}">View item</a></div>
                                </div>
                            </div>
                        </div>
                    `);
                });
            });
        });
    },
    /**
     * Renders a indicator to be used within a product's image carousel
     * @param {string} elementSelector Selector for the image carousel
     * @param {number} id The id of the carousel indicator
     * @returns {string} Rendered component
     */
    imageCarouselIndicator: (elementSelector, id) => {
        //Return the component
        return (
            `
                <button type="button" data-bs-target="${elementSelector}" data-bs-slide-to="${id}" class="${(id == 0) ? "active" : null}" aria-current="${(id == 0)}" aria-label="Slide ${id+1}"></button>
            `
        )
    },
    /**
     * Renders a carousel slide to be used within a product's image carousel
     * @param {string} imageUrl A url to the image
     * @param {boolean} active Whether or not this is the active slide in the carousel
     */
    imageCarouselSlide: (imageUrl, active) => {
        //Format the product image url
        let productImageUrl = baseUrl + imageUrl;
        if (imageUrl == null)
            productImageUrl = "/assets/img/default.png";
        //Return the component
        return (
            `
                <div class="carousel-item ${active ? "active" : null}">
                    <img height="100%" width="100%" class="d-block w-100" src="${productImageUrl}" />
                </div>
            `
        )
    }
}
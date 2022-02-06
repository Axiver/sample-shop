//-- Class --//
class Product {
    //-- Static properties --//
    //Query url
    static baseUrl = window.location.origin.replace(":3001", ":3000");

    //-- Query Methods --//
    /**
     * Queries the server for products to feature
     * Has a timeout of 1000ms
     * TODO: calculate products to feature instead of just pulling from /ratings/
     * @param {()} callback Invoked when the operation is completed
     */
    static _featured(callback) {
        const reqUrl = Product.baseUrl + '/api/product/sort/ratings/';
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
    }

    /**
     * Queries the server for all products within a certain category
     * Has a timeout of 1000ms
     * @param {number} categoryid The id of the category
     * @param {()} callback Invoked when the operation is completed
     */
    static _byCategoryId(categoryid, callback) {
        return new Promise((resolve, reject) => {
            const reqUrl = Product.baseUrl + '/api/product/filter/category/' + categoryid;
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
    }

    /**
     * Queries the server for all products within a certain category
     * Has a timeout of 1000ms
     * @param {string} categoryname The name of the category
     * @param {()} callback Invoked when the operation is completed
     */
    static _byCategoryName(categoryname, callback) {
        const reqUrl = Product.baseUrl + '/api/product/filter/category/name/' + categoryname;
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
            console.log("Error encountered querying for products with category name " + categoryname + ": ", err.message);
            if (callback)
                callback({data: null});
            return({data: null});
        });
    }

    /**
     * Queries the server for information regarding the product matching the specified id
     * Has a timeout of 1000ms
     * @param {number} productid The id of the product
     * @param {()} callback Invoked when the operation is completed
     */
    static _byId(productid, callback) {
        return new Promise((resolve, reject) => {
            const reqUrl = Product.baseUrl + '/api/product/' + productid;
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
    }

    /**
     * Queries the server for products matching the search term and category
     * @param {string} searchTerms The search terms to match against
     * @param {()} callback Invoked when the operation is completed
     */
    static _bySearchTerms(searchTerms, callback) {
        const reqUrl = Product.baseUrl + '/api/product/sort/searchterms/' + searchTerms;
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
            console.log("Error encountered querying for products matching search terms: " + searchTerms, err.message);
            if (callback)
                callback({data: null});
            return({data: null});
        });
    }

    /**
     * Queries the cover image for a product
     * @param {number} productid The id of the product to retrieve the cover image for
     * @param {number} sequenceid The id of the image to be retrieved
     * @param {()} callback Invoked when the operation is completed
     */
    static _image(productid, sequenceid, callback) {
        const reqUrl = Product.baseUrl + `/api/product/${productid}/image/${sequenceid}`;
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
    }

    /**
     * Queries the image gallery for a product
     * @param {number} productid The id of the product to retrieve the image gallery for
     * @param {()} callback Invoked when the operation is completed
     */
    static _imageCount(productid, callback) {
        //Get the number of images a product has
        const reqUrl = Product.baseUrl + `/api/product/${productid}/image/`;
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
    }

    /**
     * Queries the average rating of a product
     * @param {number} productid The id of the product to retrieve the average ratings for
     * @param {()} callback Invoked when the operation is completed 
     */
    static _averageRating(productid, callback) {
        //Get the number of images a product has
        const reqUrl = Product.baseUrl + `/api/product/${productid}/reviews/average/`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
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

    /**
     * Queries the reviews of a product
     * @param {number} productid The id of the product to retrieve the reviews for
     * @param {()} callback Invoked when the operation is completed 
     */
    static _reviews(productid, callback) {
        //Get the reviews a product has
        const reqUrl = Product.baseUrl + `/api/product/${productid}/reviews/`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, return null
            if (callback)
                callback(null);
            return null;
        });
    }

    /**
     * Retrieves a review based on a product id and review id
     * @param {number} productid The product id
     * @param {number} reviewid The id of the review
     * @param {()} callback Invoked when the operation is completed 
     */
    static _reviewById(productid, reviewid, callback) {
        //Get a specific review of a product
        const reqUrl = Product.baseUrl + `/api/product/${productid}/review/${reviewid}`;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, return null
            if (callback)
                callback(null);
            return null;
        });
    }

    /**
     * Creates a new review for a particular product
     * @param {number} rating The rating of the product
     * @param {string} review The review of the product
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed 
     */
    static _createReview(userid, productid, rating, review, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/product/${productid}/review`;
        axios.post(reqUrl, {
            userid: userid,
            rating: rating,
            review: review
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Creates a new product
     * @param {string} productName The name of the product 
     * @param {number} productPrice The price of the product
     * @param {number} categoryid The id of the category of the product
     * @param {string} productDescription The desciprtion of the product
     * @param {string} productBrand The brand of the product
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
    static _createProduct(productName, productPrice, categoryid, productDescription, productBrand, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/product/`;
        axios.post(reqUrl, {
            name: productName,
            description: productDescription,
            categoryid: categoryid,
            brand: productBrand,
            price: productPrice
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Modifes an existing product
     * @param {number} productid The id of the product
     * @param {string} productName The name of the product 
     * @param {number} productPrice The price of the product
     * @param {number} categoryid The id of the category of the product
     * @param {string} productDescription The desciprtion of the product
     * @param {string} productBrand The brand of the product
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
     static _modifyProduct(productid, productName, productPrice, categoryid, productDescription, productBrand, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/product/` + productid;
        axios.put(reqUrl, {
            name: productName,
            description: productDescription,
            categoryid: categoryid,
            brand: productBrand,
            price: productPrice
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Uploads image for a product
     * @param {number} productid The id of the product
     * @param {object} image Image file to be uploaded
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
     static _createImage(productid, image, bearerToken, callback) {
        return new Promise((resolve, reject) => {
            const reqUrl = User.baseUrl + `/api/product/${productid}/image`;
            //Construct payload
            let payload = new FormData();
            payload.append("image", image);
            axios.post(reqUrl, payload,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + bearerToken 
                }
            }).then((response) => {
                //Invoke callback with the response data
                if (callback)
                    callback(null, response);
                resolve();
            }).catch((err) => {
                //Error encountered, return the error message
                if (callback)
                    callback(err);
                resolve();
            });
        });
    }

    /**
     * Deletes a specific image of a product
     * @param {number} productid The id of the product
     * @param {number} imageid The id of the image
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
    static _deleteImage(productid, imageid, bearerToken, callback) {
        return new Promise((resolve, reject) => {
            const reqUrl = User.baseUrl + `/api/product/${productid}/image/${imageid}`;
            //Construct payload
            axios.delete(reqUrl,
            {
                headers: {
                    "Authorization": "Bearer " + bearerToken 
                }
            }).then((response) => {
                //Invoke callback with the response data
                if (callback)
                    callback(null, response);
                resolve();
            }).catch((err) => {
                //Error encountered, return the error message
                if (callback)
                    callback(err);
                resolve();
            });
        });
    }

    /**
     * Retrieves every product in order of productid, starting from index
     * @param {number} index Index to start from
     * @param {()} callback Invoked upon completion
     */
    static _queryFromIndex(index, callback) {
        //Get a specific review of a product
        const reqUrl = Product.baseUrl + `/api/product/from/` + index;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000,
        }).then((response) => {
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, return null
            if (callback)
                callback(null);
            return null;
        });
    }

    /**
     * Queries for all promotions for a particular product
     * @param {number} productid The id of the product
     * @param {()} callback Invoked upon completion
     */
    static _queryAllPromotions(productid, callback) {
        //Get a specific review of a product
        const reqUrl = Product.baseUrl + `/api/promotions/product/` + productid;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000,
        }).then((response) => {
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, return null
            if (callback)
                callback(null);
            return null;
        });
    }

    /**
     * Queries for all ongoing promotions for a particular product
     * @param {number} productid The id of the product
     * @param {()} callback Invoked upon completion
     */
    static _queryOngoingPromotion(productid, callback) {
        //Queries for all promotions for the product
        Product.query.allPromotions(productid, (data) => {
            //Check if any rows were returned
            if (data && data.length > 0) {
                //At least 1 row was returned
                const promotions = data;

                //Loop through the promotions and find one that is currently ongoing
                for (let i = 0; i < promotions.length; i++) {
                    //Select the promotion at the current index
                    const promotion = promotions[i];
                    const startDate = new Date(promotion.start_date);
                    const endDate = new Date(promotion.end_date);

                    //Check if the promotion at the current index is ongoing
                    const currDate = new Date();
                    if (startDate <= currDate && endDate >= currDate) {
                        //The current promotion is ongoing, invoke the callback with the promotion
                        console.log("promotion found: ", promotion)
                        callback(promotion);

                        return;
                    }
                }

                //Loop ended and no promotions were found
                resolve(null);
            } else {
                callback(null);
                return;
            }
        });
    }

    /**
     * Creates a new promotion for a particular product
     * @param {number} productid The id of the product
     * @param {number} value The discount value of the promotion
     * @param {string} start The start date and time of the promotion
     * @param {string} end The end date and time of the promotion
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked upon completion
     */
    static _createPromotion(productid, value, start, end, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/promotions/`;
        axios.post(reqUrl, {
            productid: productid,
            discount: value,
            start_date: start,
            end_date: end
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }


    //-- Render Methods --//
    static _productRating(avgRating) {
        //Check if the product has any ratings at all
        if (avgRating !== null && avgRating !== "undefined") {
            //The product has at least 1 review
            //Calculate the number of stars we need to render
            const filledStarsCount = Math.floor(avgRating);
            const halfStarsCount = Math.floor((avgRating - filledStarsCount) / 0.5);
            const emptyStarsCount = 5 - filledStarsCount - halfStarsCount;

            //Render the stars
            let renderedStars = "";
            
            //Render the filled stars
            if (filledStarsCount > 0) {
                for (let i = 1; i <= filledStarsCount; i++) {
                    renderedStars += `<i class="fas fa-star"></i>`;
                }
            }

            //Render the half stars
            if (halfStarsCount > 0) {
                for (let j = 1; j <= emptyStarsCount; j++) {
                    renderedStars += `<i class="fas fa-star-half"></i>`;
                }
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
    }

     /**
     * Renders a product card
     * @param {number} productid The id of the product
     * @param {string} productName The name of the product
     * @param {number} productPrice The price of the product
     * @param {number} discount Discounts on the product, if any
     * @returns {string} Rendered component
     */
    static _productCard(productid, productName, productPrice, discount) {
        return new Promise(async (resolve, reject) => {
            //Render the price
            let renderedPrice = "";

            //Obtain the product image if any
            Product.query.image(productid, 1, (result) => {
                //Check if there are any product images for this item
                let productImageUrl = Product.baseUrl + result.data;
                if (result.data == null)
                    productImageUrl = "/assets/img/default.png";

                //Get the average ratings of the product
                Product.query.averageRating(productid, (avgRating) => {
                    //Render the rating stars for the product
                    const productRating = Product.render.product.rating(avgRating);

                    //Check if the product has any ongoing promotions
                    Product.query.ongoingPromotions(productid, (promotion) => {
                        //Check if any data was returned
                        if (promotion && !discount) {
                            //Set the discount
                            discount = promotion.discount;
                        }

                        //Check if there are any discounts for the current item
                        if (!discount) {
                            //There are no ongoing discounts
                            renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;">$${productPrice.toFixed(2)}</h6>`;
                        } else {
                            //There is a ongoing discount for the current item
                            renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;"><span class="text-decoration-line-through text-danger fs-6">$${productPrice.toFixed(2)}</span> $${(productPrice - discount).toFixed(2)}</h6>`;
                        }

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
                                        <div class="text-center d-inline-block"><a class="btn btn-outline-success mt-auto text-nowrap" href="/product/${productid}">View item</a></div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                });
            });
        });
    }

    /**
     * Renders a product card for the related section of product pages
     * @param {number} productid The id of the product
     * @param {string} productName The name of the product
     * @param {number} productPrice The price of the product
     * @param {number} discount Discounts on the product, if any
     * @returns {string} Rendered component
     */
    static _relatedProductCard(productid, productName, productPrice, discount) {
        return new Promise(async (resolve, reject) => {
            //Render the price
            let renderedPrice = "";

            //Check if the product has any ongoing promotions
            Product.query.ongoingPromotions(productid, (promotion) => {
                //Check if any data was returned
                if (promotion && !discount) {
                    //Set the discount
                    discount = promotion.discount;
                }

                //Obtain the product image if any
                Product.query.image(productid, 1, (result) => {
                    //Format the product image url
                    let productImageUrl = Product.baseUrl + result.data;

                    //Check if there are any product images for this item
                    if (result.data == null)
                        productImageUrl = "/assets/img/default.png";

                    //Check if there are any discounts for the current item
                    if (!discount) {
                        //There are no ongoing discounts
                        renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;">$${productPrice.toFixed(2)}</h6>`;
                    } else {
                        //There is a ongoing discount for the current item
                        renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;"><span class="text-decoration-line-through text-danger fs-6">$${productPrice.toFixed(2)}</span> $${(productPrice - discount).toFixed(2)}</h6>`;
                    }

                    //Get the average ratings of the product
                    Product.query.averageRating(productid, (avgRating) => {
                        //Render the rating stars for the product
                        const productRating = Product.render.product.rating(avgRating);

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
                                        <div class="text-center d-inline-block"><a class="btn btn-outline-success mt-auto text-nowrap" href="/product/${productid}">View item</a></div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                });
            });
        });
    }

    /**
     * Renders a indicator to be used within a product's image carousel
     * @param {string} elementSelector Selector for the image carousel
     * @param {number} id The id of the carousel indicator
     * @param {boolean} active Whether or not this indicator is active
     * @returns {string} Rendered component
     */
    static _imageCarouselIndicator(elementSelector, id, active) {
        //Return the component
        return (
            `
                <button type="button" data-bs-target="${elementSelector}" data-bs-slide-to="${id}" class="${(id == 0 || active) ? "active" : ""}" aria-current="${(id == 0)}" aria-label="Slide ${id+1}"></button>
            `
        )
    }

    /**
     * Renders a carousel slide to be used within a product's image carousel
     * @param {string} imageUrl A url to the image
     * @param {boolean} active Whether or not this is the active slide in the carousel
     * @param {boolean} clientSide Whether or not the image is on the user's computer
     * @param {number} imageId The id of the image
     * @param {number} localimageid The local id of the image
     */
    static _imageCarouselSlide(imageUrl, active, clientSide, imageId, localimageid) {
        //Format the product image url
        let productImageUrl = imageUrl;
        
        //Checks if the image is on the user's computer
        if (!clientSide) {
            productImageUrl = Product.baseUrl + imageUrl;
        }

        //Checks if a image url was supplied
        if (imageUrl == null)
            productImageUrl = "/assets/img/default.png";

        //Return the component
        return (
            `
                <div class="carousel-item ${active ? "active" : ""}" ${imageId ? `data-imageid="${imageId}"` : ""} ${(localimageid != null) ? `data-localimageid="${localimageid}"` : ""}>
                    <img height="100%" width="100%" class="d-block w-100" src="${productImageUrl}" />
                </div>
            `
        )
    }

    /**
     * Renders a table row
     * @param {number} rownumber The id of the current row being rendered
     * @param {number} productid The id of the product 
     * @param {string} productName The name of the product
     * @param {string} productDescription The description of the product
     * @param {string} categoryName The name of the product
     * @param {string} brand The brand of the product
     * @param {number} price The price of the product
     * @param {number} upcomingDiscounts Number of upcoming discounts for the product
     * @returns Rendered component
     */
    static _renderTableRow(rownumber, productid, productName, productDescription, categoryName, brand, price, upcomingDiscounts) {
        //Formats the product name
        if (productName.length > 40) {
             //Cut the name short
            productName = productName.substring(0, 39).trim() + "...";
        }

        //Formats the product description
        if (productDescription.length > 50) {
            //Cut the description short
            productDescription = productDescription.substring(0, 49).trim() + "...";
        }
        //Return the component
        return (
            `
            <tr class="text-center">
                <th class="align-middle" scope="row">${rownumber}</th>
                <td class="align-middle text-start">${productName}</td>
                <td class="align-middle text-start">${productDescription}</td>
                <td class="align-middle text-start">${categoryName}</td>
                <td class="align-middle">${brand}</td>
                <td class="align-middle">$${price.toFixed(2)}</td>
                <td class="align-middle">${upcomingDiscounts}</td>
                <td class="align-middle text-end px-3"><a class="btn btn-primary rounded-pill px-4" href="/admin/edit/product/?productid=${productid}">Edit</a></td>
            </tr>
            `
        )
    }

    /**
     * Renders a promotion table row
     * @param {{}} promotion Object containing promotion details
     * @param {number} rownumber The id of the row being rendered
     */
    static _renderTablePromotionRow(promotion, rownumber) {
        //Return the component
        return (
            `
            <tr class="text-center">
                <th class="align-middle" scope="row">${rownumber}</th>
                <td class="align-middle text-start">${promotion.discount.toFixed(2)}</td>
                <td class="align-middle">${promotion.start_date}</td>
                <td class="align-middle">${promotion.end_date}</td>
            </tr>
            `
        )
    }


    //-- Expose Methods --//
    static create = {
        review: this._createReview,
        product: this._createProduct,
        image: this._createImage,
        promotion: this._createPromotion
    }

    static modify = {
        product: this._modifyProduct
    }

    static delete = {
        image: this._deleteImage
    }

    static query = {
        fromIndex: this._queryFromIndex,
        featured: this._featured,
        by: {
            category: this._byCategoryId,
            categoryName: this._byCategoryName,
            id: this._byId,
            searchTerms: this._bySearchTerms
        },
        image: this._image,
        imageCount: this._imageCount,
        averageRating: this._averageRating,
        reviews: this._reviews,
        review: this._reviewById,
        allPromotions: this._queryAllPromotions,
        ongoingPromotions: this._queryOngoingPromotion
    }

    static render = {
        product: {
            rating: this._productRating,
            card: this._productCard,
            relatedCard: this._relatedProductCard
        },
        carousel: {
            imageIndicator: this._imageCarouselIndicator,
            imageSlide: this._imageCarouselSlide
        },
        table: {
            row: this._renderTableRow,
            promotionRow: this._renderTablePromotionRow
        }
    }
}
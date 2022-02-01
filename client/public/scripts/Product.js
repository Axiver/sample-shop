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
        const baseUrl = window.location.origin;
        const reqUrl = baseUrl.replace(":3001", "") + ':3000/product/sort/ratings/';
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
            const baseUrl = window.location.origin;
            const reqUrl = baseUrl.replace(":3001", "") + ':3000/product/filter/category/' + categoryid;
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
     * Queries the cover image for a product
     * @param {number} productid The id of the product to retrieve the cover image for
     * @param {()} callback Invoked when the operation is completed
     */
    coverImage: (productid, callback) => {
        const baseUrl = window.location.origin;
        const reqUrl = baseUrl.replace(":3001", "") + `:3000/product/${productid}/image/1`;
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
                console.log("Error encountered querying for cover image for the product with id #" + productid + ": ", err.message);
            }
            //Return null
            if (callback)
                callback({data: null});
            return {data: null};
        });
    }
}

//-- Main component --//
/**
 * Renders the component
 * @param {number} productid The id of the product
 * @param {string} productName The name of the product
 * @param {number} productPrice The price of the product
 * @param {number} discount Discounts on the product, if any
 */
 Product.render = (productid, productName, productPrice, discount) => {
    return new Promise(async (resolve, reject) => {
        //Render the price
        let renderedPrice = "";

        //Obtain the product image if any
        Product.query.coverImage(productid, (productImageUrl) => {
            //Check if there are any discounts for the current item
            if (!discount) {
                //There are no ongoing discounts
                renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;">$${productPrice.toFixed(2)}</h6>`;
            } else {
                //There is a ongoing discount for the current item
                renderedPrice = `<h6 class="card-text lead fw-normal" style="color: #17E300 !important;"><span class="text-decoration-line-through">$${productPrice.toFixed(2)}</span> $${(productPrice - discount).toFixed(2)}</h6>`;
            }

            //Return the component
            resolve (`
                <div class="col d-flex">
                    <div class="card px-0 shadow border-0">
                        <!-- Product image-->
                        <img height="55%" width="100%" style="object-fit: cover;" class="card-img-top" src="/assets/productImages/goliathus.jpg" alt="..." />
                        <!-- Product details-->
                        <div class="card-body p-4">
                            <div>
                                <!-- Product name-->
                                <h5 class="card-title">${productName}</h5>
                            </div>
                        </div>
                        <!-- Product Footer-->
                        <div class="card-footer d-flex p-4 pt-0 border-top-0 bg-transparent justify-content-between align-items-center">
                            <!-- Product price-->
                            <div class="d-inline-block">
                                ${renderedPrice}
                            </div>
                            <!-- View Item Button -->
                            <div class="text-center d-inline-block"><a class="btn btn-outline-success mt-auto" href="/">View item</a></div>
                        </div>
                    </div>
                </div>
            `);
        });
    });
}
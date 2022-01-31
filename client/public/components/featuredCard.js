//-- Main component --//
/**
 * Renders the component
 * @param {string} url The url to redirect the user to
 * @param {string} imageUrl The url of the image to be used for the card image
 * @param {string} productName The name of the product
 * @param {number} productPrice The price of the product
 * @param {number} discount Discounts on the product, if any
 */
const featuredCard = (url, imageUrl, productName, productPrice, discount) => {
    //Render the price
    let renderedPrice = "";

    //Check if there are any discounts for the current item
    if (!discount) {
        //There are no ongoing discounts
        renderedPrice = `<p class="card-text">$${productPrice}</p>`;
    } else {
        //There is a ongoing discount for the current item
        renderedPrice = `<p class="card-text"><span class="text-decoration-line-through">$${productPrice}</span> $${productPrice - discount}</p>`;
    }

    //Return the component
    return (`
        <div class="col">
            <div class="card px-0 shadow border-0">
                <!-- Product image-->
                <img height="100%" width="100%" style="object-fit: cover;" class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="card-title">${productName}</h5>
                        <!-- Product price-->
                        ${renderedPrice}
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-outline-success mt-auto" href="${url}">View item</a></div>
                </div>
            </div>
        </div>
    `);
};
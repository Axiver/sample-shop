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
    const renderedNavbar = navbar.render("shop");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//On document load
$(document).ready(async () => {
    //-- Load required scripts --//
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/Product.js");

    //-- Featured Products --//
    //Perform a GET request to the server in order to retrieve the items with the best ratings
    Product.query.featured(async (response) => {
        //Render the featured items
        const data = response.data;

        //Checks if any data was returned
        if (data && data.length > 0) {
            //Loop through the response object
            for (let i = 0; i < data.length; i++) {
                //Select the current index
                let currProduct = data[i];

                //Render the product card
                const result = await Product.render.product.card(currProduct.productid, currProduct.name, currProduct.price);

                //Append to html view
                $("#featured-items").append(result);
            }
        } else {
            //No data was received, render a message
            const result = "<h3 class='col-12 display-6 text-center'>Oops! No items are featured. Try checking out our other products instead!</h3>";

            //Append to html view
            $("#featured-items").append(result);
        }
    });

    //-- Product Categories --//
    //Perform a GET request to the server in order to retrieve a list of category names
    Category.query.getAll(async (response) => {
        //Get the data
        const categories = response.data;

        //Checks if any data was returned
        if (categories && categories.length > 0) {
            //Loop through the response object
            for (let i = 0; i < categories.length; i++) {
                //Select the category at the current index
                const category = categories[i];
                const categoryName = category.category;

                //Perform a GET request to the server to retrieve all products under the current category
                await Product.query.by.category(category.categoryid, async (response) => {
                    //Check if any data was returned
                    const products = response.data;
                    
                    if (products && products.length > 0) {
                        //Render the category wrapper
                        const categoryWrapper = Category.render.wrapper(categoryName);
                        $("#categories").append(categoryWrapper);

                        //Loop through the response object
                        for (let j = 0; j < products.length; j++) {
                            //Select the product at the current index
                            const product = products[j];
                            
                            //Render the product card
                            const productCard = await Product.render.product.card(product.productid, product.name, product.price);

                            //Append to html view
                            $(`#${categoryName.replace(" ", "_")}-content`).append(productCard);
                        }
                    }
                });
            }
        } else {
            //No data was received, render nothing.
            return;
        }
    });
});

//Initialise components
loadNavbar();
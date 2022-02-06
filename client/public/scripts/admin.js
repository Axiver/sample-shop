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
        const renderedNavbar = await navbar.render("settings", categories);

        //Add it to the DOM
        $("body").prepend(renderedNavbar);
    });
}

//Check if the user is logged in
function isLoggedIn() {
    //Retrieve session data
    User.retrieveSessionData((data) => {
        if (!data) {
            //The user is not logged in, redirect back to the login page
            window.location.replace("/login");

            //Check if the user is an admin user
            if (data.type != "Admin") {
                //User is not an admin user, redirect back to the shop page
                window.location.replace("/shop");
            }
        }
    });
}

//Populates the products table
function populateProductsTable() {
    //Retrieve all products
    Product.query.fromIndex(1, (results) => {
        //Check if we got any data
        if (results && results.results.length > 0) {
            //At least 1 row was returned, loop through the results
            const products = results.results;

            for (let i = 0; i < products.length; i++) {
                //Select the product at the current index
                const product = products[i];

                //Render the product at the current index
                const renderedProduct = Product.render.table.row(i + 1, product.productid, product.name, product.description, product.categoryname, product.brand, product.price, 0);

                //Update the DOM
                $("#product-list-content").append(renderedProduct);

                //Calculate max pages
                const maxPages = Math.ceil(results.totalrows / 15);

                //Update the DOM
                $("#maxProductPageIndicator").text(maxPages);
            }
        }
    });
}

//Populates the categories table
function populateCategoriesTable() {
    //Retrieve all categories
    Category.query.getAll((results) => {
        //Check if any data was returned
        if (results.data && results.data.length > 0) {
            //At least 1 row was returned, loop through the results
            const categories = results.data;

            for (let i = 0; i < categories.length && i < 15; i++) {
                //Select the category at the current index
                const category = categories[i];

                //Render the category at the current inedx
                const renderedCategory = Category.render.table.row(i + 1, category.categoryid, category.category, category.description);

                //Update the DOM
                $("#category-list-content").append(renderedCategory);

                //Calculate the max pages
                const maxPages = Math.ceil(categories.length / 15);

                //Update the DOM
                $("#maxCategoryPageIndicator").text(maxPages);
            }
        }
    });
}

//-- On document ready --//
$(document).ready(async () => {
    //Load required components
    await loadScript("/scripts/User.js");
	await loadScript("/scripts/Product.js");
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/InputValidation.js");

    //Load navbar
    loadNavbar();

    //Check if the user is logged in
    isLoggedIn();

    //Populates the products table
    populateProductsTable();

    //Populates the categories table
    populateCategoriesTable();
});
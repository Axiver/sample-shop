//-- Global Variables --//
let searchResults = [];

//-- Functions --//
function loadScript(url) {
    return new Promise((resolve, reject) => {
        $.getScript(url, () => {
            resolve();
        });
    });
}

//Load navbar
function loadNavbar() {
    return new Promise(async (resolve, reject) => {
        //Load required components
        await loadScript("/components/navbar.js");

        //Perform a GET request to the server in order to retrieve a list of category names
        Category.query.getAll(async (response) => {
            //Get the data
            const categories = response.data;

            //Render the navbar
            const renderedNavbar = await navbar.render("search", categories);

            //Add it to the DOM
            $("body").prepend(renderedNavbar);

            //Resolve promise
            resolve();
        });
    });
}

//Checks for search params
function checkSearchParams() {
    //Retrieve search parameters
    const searchParams = new URLSearchParams(window.location.search);

    //Get category if it exists
    let category = null;
    if (searchParams.has('category')) {
        category = searchParams.get('category');
    }

    //Get search terms if it exists
    let searchTerms = null;
    if (searchParams.has('searchterms')) {
        searchTerms = searchParams.get('searchterms');
    }

    //Redirect the user back to the shop page if there are no search params
    if (!category && !searchTerms) {
        //Redirect the user
        window.location.replace("/shop");
    }
}

//Sets the default search params based on the url
function setDefaultSearchParams() {
    //Retrieve search parameters
    const searchParams = new URLSearchParams(window.location.search);

    //Get category if it exists
    let category = null;
    if (searchParams.has('category')) {
        category = searchParams.get('category');
    }

    //Get search terms if it exists
    let searchTerms = null;
    if (searchParams.has('searchterms')) {
        searchTerms = searchParams.get('searchterms');
    }

    //Check if category param exists
    if (category) {
        //Category param is set, remove the selected attribute from the default option
        $("select > option").eq(0).removeAttr("selected");

        //Find the matching value in select options
        //Get all select options
        const options = $("select > option");

        //Loop through the result
        for (let i = 0; i < options.length; i++) {
            //Select the option at the current index
            const option = options.eq(i);

            //Check if the option at the current index is the one we are looking for
            if (option.text() == category) {
                //This is the one we are looking for, add the selected attribute to it
                option.attr("selected", "selected");

                //Break the loop
                break;
            }
        }
    }

    //Check if search terms params exists
    if (searchTerms) {
        //There are search terms used, use it as the value of the search bar
        $("input[name='searchterms']").val(searchTerms);
    }
}

//Renders search results
async function renderSearchResults(products, isBaseSearchResults) {
    //Clear the searchResults div
    $("#searchResults").empty();

    //Check if we got any results
    if (products && products.length > 0) {
        //We got at least 1 result
        //Checks if these are the base search results
        if (isBaseSearchResults) {
            //Save to global variable
            searchResults = products;

            //Render brand filters
            renderBrandFilters();
        }

        //Loop through the resuts
        for (let i = 0; i < products.length; i++) {
            //Select the product at the current index
            const product = products[i];

            //Render the product
            const renderedProduct = "<div class='col-3 d-flex'>" + await Product.render.product.card(product.productid, product.name, product.price) + "</div>";

            //Update the DOM
            $("#searchResults").removeClass("justify-content-center");
            $("#searchResults").append(renderedProduct);
        }
    } else {
        //Render a no results message
        const renderedMessage = "<div class='text-center col-8'><h2> Oops, there aren't any results matching your search!</h2><br><h4 class='fw-normal'>Try again with different keywords or filters</h4></div>";

        //Update the DOM
        $("#searchResults").addClass("justify-content-center");
        $("#searchResults").append(renderedMessage);
    }
}

//Retrieves search results
function retrieveSearchResults() {
    //Retrieve search parameters
    const searchParams = new URLSearchParams(window.location.search);

    //Get category if it exists
    let category = null;
    if (searchParams.has('category')) {
        category = searchParams.get('category');
    }

    //Get search terms if it exists
    let searchTerms = null;
    if (searchParams.has('searchterms')) {
        searchTerms = searchParams.get('searchterms');
    }

    //-- Send the appropriate GET request to the server --//
    //Check if we are only searching via searchterms
    if (searchTerms) {
        Product.query.by.searchTerms(searchTerms, (response) => {
            //Retrieve data
            const products = response.data;

            //Check if a category filter is applied
            if (category && products) {
                //A category filter is applied
                let result = [];

                //Loop through the products array
                for (let i = 0; i < products.length; i++) {
                    //Select the product at the current index
                    const product = products[i];

                    //Check if the current product is under the selected category
                    if (product.category == category) {
                        //Add it to the result array
                        result.push(product);
                    }
                }

                //Loops over, render the search results
                renderSearchResults(result, true);
            } else {
                //Render search results
                renderSearchResults(products, true);
            }
        });
    }

    //Check if we are only searching via category filter
    if (category && !searchTerms) {
        Product.query.by.categoryName(category, (response) => {
            //Retrieve data
            const products = response.data;

            //Render search results
            renderSearchResults(products, true);
        });
    }

    //Check if there are no filters used (No search terms and no category filter)
    if (!searchTerms && !category) {
        //Display all products
        Product.query.all()
    }
}

//Applies sort options to the search results
function applySort() {
    //Retrieve selected brands
    const brands = $("#sortBrands input:checked");
    let selectedBrands = [];
    for (let i = 0; i < brands.length; i++) {
        //Get the id of the current input
        const inputId = brands.eq(i).attr("id");

        //Get a reference to the associated label
        const label = $("label[for='" + inputId + "']");

        //Push the value of the label into the selectedBrands array
        selectedBrands.push(label.text());
    }

    //-- Begin filtering/sorting results --//
    //Create a deep copy of the searchResults array
    let filteredResults = JSON.parse(JSON.stringify(searchResults));

    //Check if any brands are selected
    if (brands.length > 0) {
        //There is at least 1 brand selected, filter the results by brands
        //Loop through the base search results
        for (let i = 0; i < filteredResults.length; i++) {
            //Get the search result at the current index
            const product = filteredResults[i];

            //Check if the current product's brand matches either one of the selected brands
            if (!selectedBrands.includes(product.brand)) {
                //It does not match, pop the element
                filteredResults.splice(i, 1);

                //Decrement i
                i--;
            }
        }
    }

    //Check if the user wants to sort the results by price in ascending order
    if ($("#lowToHigh:checked").length > 0) {
        //The user wants to sort the results by price in ascending order
        //Loop through the filteredResults array
        for (let i = 0; i < filteredResults.length - 1; i++) {
            //Select the product at the current index
            const product = filteredResults[i];

            //Select the product at the next index
            const nextProduct = filteredResults[i + 1];

            //Check if the price of the current product is larger than the price of the product at the next index
            if (product.price > nextProduct.price) {
                //Swap the positions of the two products
                filteredResults[i] = nextProduct;
                filteredResults[i + 1] = product;

                //Reset the loop
                i = -1;
            }
        }
    }

    //Check if the user wants to sort the results by price in descending order
    if ($("#highToLow:checked").length > 0) {
        //The user wants to sort the results by price in descending order
        //Loop through the filteredResults array
        for (let i = 0; i < filteredResults.length - 1; i++) {
            //Select the product at the current index
            const product = filteredResults[i];

            //Select the product at the next index
            const nextProduct = filteredResults[i + 1];

            //Check if the price of the current product is less than the price of the product at the next index
            if (product.price < nextProduct.price) {
                //Swap the positions of the two products
                filteredResults[i] = nextProduct;
                filteredResults[i + 1] = product;

                //Reset the loop
                i = -1;
            }
        }
    }
    
    //Re-render products
    renderSearchResults(filteredResults, false);
}

//Renders the brand filters
function renderBrandFilters() {
    //Loops through the search results and create an array of brands
    const brands = [];
    for (let i = 0; i < searchResults.length; i++) {
        //Get the brand of the product at the current index
        const brand = searchResults[i].brand;

        //Check if the brand is already in the brands array
        if (!brands.includes(brand)) {
            //It is not in the array, push to array
            brands.push(brand);
        }
    }

    //Loop over, render the brands
    let renderedBrands = "";
    for (let i = 0; i < brands.length; i++) {
        renderedBrands += (
            `
            <div class="col">
                <input type="checkbox" class="btn-check" id="sort-${brands[i]}" autocomplete="off">
                <label class="btn btn-outline-secondary rounded-pill px-4 text-nowrap" for="sort-${brands[i]}">${brands[i]}</label><br>
            </div>
            `
        )
    }

    //Brands have been rendered, update the DOM
    $("#sortBrands").html(renderedBrands);
}

//-- Handlers --//
//Ensure that only one price sort option can be selected at any time
$("#priceSort input").on("change", (e) => {
    //Get a reference to the checkbox being clicked
    const element = $((e.target) ? e.target: e.srcElement);

    //Get all checkboxes
    const availableOptions = $("#priceSort input");

    //Unselect the checkboxes that are not the ones that triggered the event
    for (let i = 0; i < availableOptions.length; i++) {
        //Select the element at the current index
        const currElement = availableOptions.eq(i);

        //Check if the current element is the one that triggered the event
        if (!currElement.is(element)) {
            //It is not, remove the selected attribute
            currElement.removeAttr("checked");

        }
    }
});

//-- On document ready --//
$(document).ready(async () => {
    //Load required components
	await loadScript("/scripts/User.js");
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/Product.js");

    //Load navbar
    await loadNavbar();

    //Check if there are any search params
    checkSearchParams();

    //Set default search params
    setDefaultSearchParams();

    //Retrieve search results
    retrieveSearchResults();
});
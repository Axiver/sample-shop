//-- Global variables --//
let imageQueue = [];
let deletedImages = [];
newCategoryId = null;

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

//Gets the id of the category the user is currently editing
function getCategoryId() {
    //Retrieve url parameters
    const urlParams = new URLSearchParams(window.location.search);

    //Get category id if it exists
    let categoryid = null;
    if (urlParams.has('categoryid')) {
        categoryid = urlParams.get('categoryid');
    }

    if (newCategoryId)
        categoryid = newCategoryId;

    //Return the result
    return categoryid;
}

//Renders category info
function renderCategoryInfo() {
    //Get the category id if any
    const categoryid = getCategoryId();

    //Checks if we are editing an existing category
    if (categoryid) {
        //Yes we are, retrieve information about this category and use it as the default values
        Category.query.getAll((results) => {
            //Check if we got any results
            if (results.data && results.data.length > 0) {
                //Retrieve categories from results
                const categories = results.data;
                
                //Loop through the categories
                for (let i = 0; i < categories.length; i++) {
                    //Select the category at the current index
                    const category = categories[i];

                    //Check if the id of the category at the current index matches that of the one we are trying to find
                    if (category.categoryid == categoryid) {
                        //This is the category that we want. Use it to set the default values of inputs.
                        $("#categoryNameInput").val(category.category);
                        $("#categoryDescriptionInput").val(category.description);

                        //Edit DOM
                        $("#headerText").text("Edit Category");
                        $("#createButton").text("Modify");
                        
                        //Break the loop
                        break;
                    }
                }
            }
        });
    }
}

//Create category
function createCategory() {
    //Validate user input
    const validator = new Validator("#errorMessage");

    //Validate category name
    const categoryName = validator.validate.category.name("#categoryNameInput");
    if (!categoryName) {
        return;
    }

    //Validate category description
    const categoryDescription = validator.validate.category.description("#categoryDescriptionInput");
    if (!categoryDescription) {
        return;
    }

    //User input is valid, create/update category
    //Obtain bearer token
    User.retrieveSessionData((userData) => {
        const token = userData.token;

        //Determine whether we need to create or edit an existing category
        const categoryid = getCategoryId();
        if (categoryid) {
            //We are editing an existing category
            Category.modify.category(categoryid, categoryName, categoryDescription, token, (err, result) => {
                //Check if there was an error
                if (err) {
                    //There was an error
                    console.log("Error encountered while trying to create category: ", err);
                    
                    //Display a error message
                    //Render a error message
                    $("#errorMessage").removeClass("text-success").addClass("text-danger");
                    $("#errorMessage").text("An error occured. Please try again later");
                    return;
                }

                //There was no error, display a success message
                $("#errorMessage").removeClass("text-danger").addClass("text-success");
                $("#errorMessage").text("Category modified successfully");
            });
        } else {
            //We are creating a new category
            Category.create.category(categoryName, categoryDescription, token, (err, result) => {
                //Check if there was an error
                if (err) {
                    //There was an error
                    console.log("Error encountered while trying to create category: ", err);

                    //Check if the error was caused due to a duplicate entry
                    if (err.response.status == 422) {
                        //Was caused due to duplicate entry
                        //Highlight the categoryname input field with error message
                        validator._setInvalid("#categoryNameInput", "Another category with the same name already exists")
                    } else {
                        //Render a error message
                        $("#errorMessage").removeClass("text-success").addClass("text-danger");
                        $("#errorMessage").text("An error occured. Please try again later");
                    }

                    return;
                }

                //There was no error, display a success message
                $("#errorMessage").removeClass("text-danger").addClass("text-success");
                $("#errorMessage").text("Category created successfully");

                //Modify create button text
                $("#createButton").text("Modify");

                //Add category id to global variable
                newCategoryId = result.data.categoryid;
            })
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

    //Render category info
    renderCategoryInfo();
});
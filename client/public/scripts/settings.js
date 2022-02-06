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
        }
    });
}

//Sets the default values of the user inputs
function setDefaultValues() {
    //Retrieve session data
    User.retrieveSessionData((data) => {
        //Obtain the userid
        const userid = data.userid;

        //Query user information
        User.query.by.id(userid, (data) => {
            //Check if any data was received
            if (data) {
                //Set the default values of the input boxes
                $("#username").val(data.username);
                $("#contactNumber").val(data.contact);
                $("#email").val(data.email);
                $("#profileImage").css("background-image", `url("${User.baseUrl}/uploads/${data.profile_pic_url}`);
            }
        });

        //Query category interests
        User.query.categoryInterests(userid, data.token, (data) => {
            //Check if any data was received
            if (data) {
                //Set the default category interests
                //Get a list of all available category interest buttons
                const categoryButtons = $("#categoryOptions input");

                //Loop through the list
                for (let i = 0; i < categoryButtons.length; i++) {
                    //Select the button at the current index
                    const categoryButton = categoryButtons.eq(i);

                    //Check if the currently selected category button represents one that the user has indicated a interest for
                    const buttonCategoryId = categoryButton.attr("data-categoryid");

                    //Loop through the request data
                    for (let j = 0; j < data.length; j++) {
                        //Select the category at the current index
                        const currCategory = data[j];

                        //Check if the category ids matches
                        if (currCategory.categoryid == buttonCategoryId) {
                            //It matches, mark the button as selected
                            categoryButton.attr("checked", true);

                            //Break the loop
                            break;
                        }
                    }
                }
            }
        });
    });

}

//Submit registration form
function formSubmit() {
    //Create a new validator
    const validator = new Validator("#errorMessage");

    //Get and validate username
    const username = validator.validate.username("#username");
    if (!username) {
        //Username is invalid
        return;
    }

    //Get and validate contact number
    const contact = validator.validate.contact("#contactNumber");
    if (!contact) {
        //Contact number is invalid
        return;
    }

    //Get and validate email address
    const email = validator.validate.email("#email");
    if (!email) {
        //Email address is invalid
        return;
    }

    //Checks if the user wants to change their password
    let oldPassword = null;
    let confirmPassword = null;
    const password = $("#password").val();
    if (password.length > 0) {
        //The user wants to change their password
        //Validate old password
        oldPassword = validator.validate.password("#oldPassword");
        if (!oldPassword) {
            //Password is invalid
            return;
        }

        //Validate password
        if (!validator.validate.password("#password")) {
            //Password is invalid
            return;
        }

        //Get and validate confirm password
        confirmPassword = validator.validate.confirmPassword("#password", "#confirmPassword");
        if (!confirmPassword) {
            //Confirm password is invalid
            return;
        }
    }

    //Obtain the userid
    User.retrieveSessionData((data) => {
        const userid = data.userid;

        //All checks passed, create an account!
        User.update.userInfo(userid, data.token, username, contact, email, oldPassword, confirmPassword, async (err, res) => {
            //Checks if there were any errors
            if (err) {
                //Display the error and mark the affected inputs as invalid
                for (let i = 0; i < err.affectedInputs.length; i++) {
                    validator._setInvalid(`#${err.affectedInputs[i]}`, err.message);
                }

                return;
            }
            
            //Success, turn the error message text into a success message
            $("#errorMessage").removeClass("text-danger").addClass("text-success");
            $("#errorMessage").text("Successfully updated user info");

            //Clear password inputs
            $("#oldPassword").val("");
            $("#password").val("");
            $("#confirmPassword").val("");
        });
    });
}

//Updates profile image
function updateImage() {
    //Create a new validator
    const validator = new Validator("#fileUploadErrorMessage");

    //Check if any file was selected
    const result = validator.validate.fileInput("#newProfileImageUpload");
    if (!result) {
        //Invalid file
        return;
    }

    //Create a form data object and add the file to it
    let formData = new FormData();
    const file = $("#newProfileImageUpload")[0].files[0];
    formData.append("image", file);

    //File is valid, obtain the user's id and bearer token
    User.retrieveSessionData((data) => {
        //update user's proifle pic
        User.update.profilePic(data.userid, data.token, formData, (err, res) => {
            //Checks if there were any errors
            if (!res) {
                //Display the error and mark the affected inputs as invalid
                for (let i = 0; i < err.affectedInputs.length; i++) {
                    validator._setInvalid(`#${err.affectedInputs[i]}`, err.message);
                }

                return;
            }

            //Success, turn the error message text into a success message
            $("#fileUploadErrorMessage").removeClass("text-danger").addClass("text-success");
            $("#fileUploadErrorMessage").text("Successfully uploaded new profile picture");

            //Clear inputs
            $("#newProfileImageUpload").val("");

            //Update the image being displayed
            const newImageUrl = res.data.url;
            console.log("new url: ", newImageUrl);
            $("#profileImage").css("background-image", `url(${User.baseUrl}/uploads/${newImageUrl})`);

            //Update the profile pic url stored in session
            User.updateSessionData("profilepic", newImageUrl);

            //Re-render the profile pic in the navbar
            $("nav .img-profile").attr("src", `${User.baseUrl}/uploads/${newImageUrl}`);
        });
    });
}

//Renders category options
function renderCategoryOptions() {
    //Obtain a list of all the available categories to choose from
    Category.query.getAll((results) => {
        //Check if we got any data back
        if (results.data) {
            //We've got data
            const categories = results.data;
            //Loop through the array and render each one
            for (let i = 0; i < categories.length; i++) {
                //Select the category at the current index
                const category = categories[i];

                //Render the current category
                const renderedCategory = Category.render.optionButton(category.category, category.categoryid);

                //Update the DOM
                $("#categoryOptions").append(renderedCategory);
            }

        } else {
            //No categories available to display
            //Render a message
            const renderedMessage = `<h6>There are no categories available to choose from</h6>`;

            //Update the DOM
            $("#categoryOptions").append(renderedMessage);
        }
    });
}

//Updates category preferences
function updateCategoryPrefs() {
    //Obtain selected categories
    const categories = $("#categoryOptions input:checked");

    //Set border color
    $("#categoryOptions").removeClass("border-success");

    //Set text color
    $("#categoryPrefsErrorMessage").removeClass("text-success");
    $("#categoryPrefsErrorMessage").addClass("text-danger");

    //Get an array of category ids
    const categoryids = [];

    //Loop through the categories array
    for (let i = 0; i < categories.length; i++) {
        //Select the category at the current index
        const category = categories.eq(i);

        //Push the category id of the current category to the array
        categoryids.push(category.attr("data-categoryid"));
    }

    //Get user information
    User.retrieveSessionData((userData) => {
        User.update.categoryPrefs(userData.userid, userData.token, categoryids, (err, response) => {
            //Checks if there was an error
            if (err) {
                //There was an error, display an error message
                $("#categoryPrefsErrorMessage").text("An error occured. Please try again later");

                //Set border color
                $("#categoryOptions").addClass("border-danger");

                return;
            }

            //There was no error
            //Display a success message
            $("#categoryPrefsErrorMessage").text("Successfully updated category preferences");
            $("#categoryPrefsErrorMessage").removeClass("text-danger");
            $("#categoryPrefsErrorMessage").addClass("text-success");

            //Set border color
            $("#categoryOptions").removeClass("border-danger");
            $("#categoryOptions").addClass("border-success");
        });
    });
}


//-- On document ready --//
$(document).ready(async () => {
    //Load required components
	await loadScript("/scripts/User.js");
    await loadScript("/scripts/Category.js");
    await loadScript("/scripts/InputValidation.js");

    //Load navbar
    loadNavbar();

    //Check if the user is logged in
    isLoggedIn();

    //Renders category options
    renderCategoryOptions();

    //Set default values of the user inputs
    setDefaultValues();
});
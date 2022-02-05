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
        User.update(userid, data.token, username, contact, email, oldPassword, confirmPassword, async (err, res) => {
            console.log("error: ", err);
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

    //Set default values of the user inputs
    setDefaultValues();
});
/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
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
    const renderedNavbar = navbar.render("login");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//Submit the login form
function formSubmit() {
    //Create a new validator
    const validator = new Validator("#errorMessage");

    //Get and validate email address
    const email = validator.validate.email("#email");
    if (!email) {
        //Email address is invalid
        return;
    }

    //Get and validate password
    const password = $("#password").val();
    if (password.length == 0) {
        //Password is empty
        validator._setInvalid("#password", "Password cannot be empty");
        return;
    }

    //All checks passed, try to login!
    User.login(email, password, (err, res) => {
        //Checks if there were any errors
        if (err) {
            //Display an error message
            validator._setInvalid("#email", "Email address or Password is invalid");
            validator._setInvalid("#password", "Email address or Password is invalid");
            return;
        }

        //Obtain the JWT Token from the response
        const token = res.data.token;
        const loggedInUserID = res.data.userid;
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUserID", loggedInUserID);

        //Redirect the user to the shop page
        window.location.href = "/shop";
    });
}

//-- On document ready --//
$(document).ready(() => {
    //Check if the user is already logged in
    const token = localStorage.getItem("token");

    if (token) {
        //The user is already logged in, redirect the user back to the shop page
        window.location.href = "/shop";
    }
});

//Load required scripts
loadScript("/scripts/InputValidation.js");
loadScript("/scripts/User.js");

//Initialise components
loadNavbar();
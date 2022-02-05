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
    const renderedNavbar = await navbar.render("register");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

/**
 * Success countdown redirect
 * @param {number} i countdown
 */
function registrationSuccess(i) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            $("#errorMessage").text("Account created! Redirecting you to the login page in " + i);
            resolve();
        }, 1000);
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

    //Validate password
    if (!validator.validate.password("#password")) {
        //Password is invalid
        return;
    }

    //Get and validate confirm password
    const confirmPassword = validator.validate.confirmPassword("#password", "#confirmPassword");
    if (!confirmPassword) {
        //Confirm password is invalid
        return;
    }


    //All checks passed, create an account!
    User.register(username, contact, email, confirmPassword, async (err, res) => {
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

        //Countdown from 3 to 1
        for (let i = 3; i >= 1; i--) {
            await registrationSuccess(i);
        }

        //Countdown over, redirect the user to the login page
        window.location.href = "/login";
    });
}

//-- On document ready --//
$(document).ready(() => {
    //Initialise components
    loadNavbar();

    //Check if the user is already logged in
    User.retrieveSessionData((isLoggedIn) => {
        if (isLoggedIn) {
            //The user is already logged in, redirect the user back to the shop page
            window.location.href = "/shop"; 
        }
    });
});

//Load required scripts
loadScript("/scripts/InputValidation.js");
loadScript("/scripts/User.js");
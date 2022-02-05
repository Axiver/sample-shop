//-- Classes --//
class Validator {
    //-- Constructor --//
    /**
     * Creates a new validator
     * @param {string?} errorMessageSelector Jquery selector to select the element for displaying error messages 
     */
    constructor(errorMessageSelector) {
        this.errorMessageSelector = errorMessageSelector;
    }

    //-- Methods --//
    /**
     * Validates a input field
     * @param {string} selector Selector to the input field
     * @param {()} validator Validator function
     */
    _validateInput = (selector, validator) => {
        //Get value of the input field
        const inputValue = $(selector).val().trim();

        //Run the validator function
        const error = validator(inputValue);

        //Check if the input is valid
        if (error) {
            //The input is invalid
            //Mark the input as invalid
            this._setInvalid(selector, error, () => {
                //Revalidator function
                this._validateInput(selector, validator);
            });

            //Return false
            return false;
        } else {
            //The input is valid
            this._setValid(selector);
            return inputValue;
        }
    }

    /**
     * Marks a input field as invalid
     * @param {string} selector Jquery selector to select the element
     * @param {string} errorMessage The error message to be displayed
     * @param {()} revalidate A function to re-validate the input field on every keypress
     */
    _setInvalid = (selector, errorMessage, revalidate) => {
        //Set the state of the input field
        $(selector).removeClass("is-valid");
        $(selector).addClass("is-invalid");

        //Add danger text
        $(this.errorMessageSelector).removeClass("text-success").addClass("text-danger");

        //Set the error message
        $(this.errorMessageSelector).text(errorMessage);

        //Remove old keyup listener
        $(selector).unbind("keyup");

        //Add a keyup listener to the element
        $(selector).keyup(() => {
            //Invoke revalidation function (if any)
            if (revalidate) {
                revalidate();
            } else {
                //Clear error message on keyup
                this._setValid(selector);
            }
        });

        return;
    }

    /**
     * Marks a input field as valid
     * @param {string} selector Jquery selector to select the element
     */
    _setValid = (selector) => {
        //Sets the state of the input field
        $(selector).removeClass("is-invalid");
        $(selector).addClass("is-valid");
        $(selector).removeClass("text-danger");

        //Clear error message
        $(this.errorMessageSelector).text("");

        //Remove keyup listener
        $(selector).unbind("keyup");

        return;
    }

    /**
     * Validates username
     * @param {string} usernameSelector Jquery selector for the username input field
     * @returns {boolean}
     */
    _validateUsername = (usernameSelector) => {
        //Validate the username input field
        const isValid = this._validateInput(usernameSelector, (username) => {
            //Ensure that the username is not empty
            if (username.length == 0) {
                return "Username cannot be empty";
            }

            //Ensure that the username does not contain special characters
            if (username.match(/[^A-Za-z0-9/ /]/g)) {
                return "Username cannot contain special characters";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates contact number
     * @param {string} contactSelector Jquery selector for the contact number input field 
     * @returns {boolean}
     */
    _validateContact = (contactSelector) => {
        //Validate the username input field
        const isValid = this._validateInput(contactSelector, (contactNumber) => {
            //Ensure that the phone number is not empty
            if (contactNumber.length == 0) {
                return "Contact number cannot be empty";
            }

            //Ensure that the phone number is of a valid format
            if (!contactNumber.match(/[6|8-9]{1}[0-9]{7}/g) || contactNumber.length != 8) {
                return "Contact number must be of a valid format (e.g. 91234567)";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates the email address
     * @param {string} emailSelector Jquery selector for the email input field
     * @returns {boolean}
     */
    _validateEmail = (emailSelector) => {
        //Validate the email address input field
        const isValid = this._validateInput(emailSelector, (email) => {
            //Regex expression for email validation
            const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

            //Ensure that the email address is not empty
            if (email.length == 0) {
                return "Email address cannot be empty";
            }

            //Ensure that the email address is of a valid format
            if(!emailRegex.test(email)) {
                return "Email must be of a valid format (e.g. user@example.com)";
            }

            //Further checking of some things regex can't handle
            //Check if the first section of the email is longer than 64 characters
            const parts = email.split("@");
            if (parts[0].length > 64)
                return "Email must be of a valid format (e.g. user@example.com)";

            //Checks if the domain of the email is more than 63 characters per section
            const domainParts = parts[1].split(".");
            if (domainParts.some((part) => { return part.length > 63; }))
                return "Email must be of a valid format (e.g. user@example.com)";
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates the password input
     * @param {string} passwordSelector Jquery selector for the password input field
     * @returns {boolean}
     */
    _validatePassword = (passwordSelector) => {
        //Validate the password input field
        const isValid = this._validateInput(passwordSelector, (password) => {
            //Ensure that the password is at at least 8 characters long
            if (password.length < 8) {
                return "Password must be at least 8 characters long";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates the confirm password input
     * @param {string} passwordSelector Jquery selector for the password input field
     * @param {string} confirmPasswordSelector Jquery selector for the confirm password input field
     * @returns {boolean}
     */
    _validateConfirmPassword = (passwordSelector, confirmPasswordSelector) => {
        //Validate the confirm password input field
        const isValid = this._validateInput(confirmPasswordSelector, (confirmPassword) => {
            //Ensure that the confirm password field is not empty
            if (confirmPassword.length == 0) {
                return "Confirm password cannot be empty";
            }

            //Ensure that the confirm password matches the password
            if (confirmPassword != $(passwordSelector).val().trim()) {
                return "Confirm password must match password";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates the review input
     * @param {string} reviewSelector Jquery selector for the review input field
     */
    _validateReview = (reviewSelector) => {
        //Validate the review input field
        const isValid = this._validateInput(reviewSelector, (review) => {
            //Ensure that the review field is not empty
            if (review.length == 0) {
                return "Review cannot be empty";
            }

            //Ensure that the review is at least 10 characters long
            if (review.length < 10) {
                return "Review must be at least 10 characters long";
            }
        });

        //Return the outcome
        return isValid;
    }

    //Expose the methods
    validate = {
        username: this._validateUsername,
        contact: this._validateContact,
        email: this._validateEmail,
        password: this._validatePassword,
        confirmPassword: this._validateConfirmPassword,
        review: this._validateReview
    }
}
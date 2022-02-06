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
     * @param {any} rawData Data to validate
     */
    _validateInput = (selector, validator, rawData) => {
        //Get value of the input field
        let inputValue = $(selector).val();

        if (inputValue)
            inputValue = inputValue.trim();

        if (rawData) 
            inputValue = rawData;

        //Run the validator function
        const error = validator(inputValue, $(selector));

        //Check if the input is valid
        if (error) {
            //The input is invalid
            //Mark the input as invalid
            this._setInvalid(selector, error, () => {
                //Revalidator function
                this._validateInput(selector, validator, rawData);
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
        if ($(selector).hasClass("form-control")) {
            //Input supports bootstrap input validation styling
            $(selector).removeClass("is-valid");
            $(selector).addClass("is-invalid");
        } else {
            $(selector).removeClass("border-success");
            $(selector).addClass("border-danger");
        }

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
        if ($(selector).hasClass("form-control")) {
            //Input supports bootstrap input validation styling
            $(selector).removeClass("is-invalid");
            $(selector).addClass("is-valid");
            $(selector).removeClass("text-danger");
        } else {
            $(selector).removeClass("border-danger");
            $(selector).addClass("border-success");
        }

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

    /**
     * Validates the file input
     * @param {string} fileSelector Jquery selector for the file input field
     */
    _validateFileInput = (fileSelector) => {
        //Validate the file input field
        const isValid = this._validateInput(fileSelector, (file, jquerySelector) => {
            //Ensure that the file field is not empty
            if (file.length == 0) {
                return "Please select a file";
            }

            //Ensure that the file extension is of a acceptable type
            const fileExt = file.split(".").at(-1);
            if (fileExt != "png" && fileExt != "jpg" && fileExt != "jpeg") {
                return "Filetype must be either a .png, .jpg or a .jpeg";
            }

            //Ensure that the file size is no larger than 1MB
            if (jquerySelector[0].files[0].size > 1000000) {
                return "File size must not exceed 1MB";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product name
     * @param {string} selector JQuery selector for the product name input field
     */
    _validateProductName = (selector) => {
        //Validate the product name input field
        const isValid = this._validateInput(selector, (productName) => {
            //Ensure that the product name is not empty
            if (productName.length == 0) {
                return "Product name cannot be empty";
            }

            //Ensure that the product name is at least 6 characters long
            if (productName.length < 6) {
                return "Product name must be at least 6 characters long";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product price
     * @param {string} selector JQuery selector for the product price input field
     */
    _validateProductPrice = (selector) => {
        //Validate the product price input field
        const isValid = this._validateInput(selector, (productPrice) => {
            //Ensure that the product price is not empty
            if (productPrice.length == 0) {
                return "Product price cannot be empty";
            }

            //Ensure that the product price is a number
            if (isNaN(productPrice)) {
                return "Product price must be a valid number";
            }

            //Ensure that the product price is more than 0
            if (productPrice <= 0) {
                return "Product price must be more than 0";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product category
     * @param {string} selector JQuery selector for the product category input field
     */
     _validateProductCategory = (selector) => {
        //Validate the product category input field
        const isValid = this._validateInput(selector, (productCategory, jquerySelector) => {
            const selectedCategory = jquerySelector.find("option:selected").eq(0);
            //Ensure that the product category is not empty
            if (selectedCategory.attr("data-categoryid") == null) {
                return "Please select a category";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product description
     * @param {string} selector JQuery selector for the product description input field
     */
     _validateProductDescription = (selector) => {
        //Validate the product description input field
        const isValid = this._validateInput(selector, (productDescription) => {
            //Ensure that the product description is not empty
            if (productDescription.length == 0) {
                return "Product description cannot be empty";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product brand
     * @param {string} selector Jquery selector for the product brand
     */
    _validateProductBrand = (selector) => {
        //Validate the product brand input field
        const isValid = this._validateInput(selector, (productBrand) => {
            //Ensure that the product brand is not empty
            if (productBrand.length == 0) {
                return "Product brand cannot be empty";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates product images
     * @param {string} selector Jquery selector for the product image input
     * @param {[]} productImages An array containing all product images uploaded
     */
    _validateProductImages = (selector, productImages) => {
        //Validate the product images array
        const isValid = this._validateInput(selector, (productImages) => {
            //Ensure that the product images array is not empty
            if (productImages.length == 0) {
                return "Product must have at least 1 image";
            }

            if (productImages.length == 1 && productImages.eq(0).find("img").attr("src").endsWith("/assets/img/blank.png")) {
                return "Product must have at least 1 image";
            }
        }, productImages);

        //Return the outcome
        return isValid;
    }

    /**
     * Validates category name
     * @param {string} selector Jquery selector for the category name input
     */
    _validateCategoryName = (selector) => {
        //Validate the category name input field
        const isValid = this._validateInput(selector, (categoryName) => {
            //Ensure that the category name is not empty
            if (categoryName.length == 0) {
                return "Category name cannot be empty";
            }
        });

        //Return the outcome
        return isValid;
    }

    /**
     * Validates category description
     * @param {string} selector Jquery selector for the category description input
     */
     _validateCategoryDescription = (selector) => {
        //Validate the category description input field
        const isValid = this._validateInput(selector, (categoryDescription) => {
            //Ensure that the category description is not empty
            if (categoryDescription.length == 0) {
                return "Category description cannot be empty";
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
        review: this._validateReview,
        fileInput: this._validateFileInput,
        product: {
            name: this._validateProductName,
            price: this._validateProductPrice,
            category: this._validateProductCategory,
            description: this._validateProductDescription,
            brand: this._validateProductBrand,
            images: this._validateProductImages
        },
        category: {
            name: this._validateCategoryName,
            description: this._validateCategoryDescription
        }
    }
}
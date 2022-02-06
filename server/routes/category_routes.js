/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Category = require("../models/Category");

//Middlewares
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");


//-- Functions --//
/**
 * Trims all properties in a object
 * @param {{}} object The object containing properties to be trimmed
 * @param {*} callback The callback to invoke once the operation is completed
 */
 function trimObject(object, callback) {
    //Try to trim all the properties in a object
    try {
        //Loops through the object
        for (const [key, value] of Object.entries(object)) {
            //Trim the current index in the object
            object[key] = `${value}`.trim();
        }

        //The object has been trimmed, invoke the callback with the result
        callback(null, object);
    } catch (error) {
        //There was an error while trying to perform trim(), most likely encountered a null value
        callback(error, null);
    }
}


//-- POST Request handling --//
/**
 * Creates a new category
 */
router.post("/", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Trims the user input before passing it through to the createCategory method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Create the category
            Category.createCategory(trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Checks if the error was due to a duplicate entry
                    if (err.code == "ER_DUP_ENTRY") {
                        //Error was due to duplicate entry
                        return res.status(422).send();
                    } else {
                        //Unknown error occured
                        return res.status(500).send();
                    }
                } else {
                    //There was no error
                    let response = {"categoryid": result.insertId};
                    return res.status(201).send(response);
                }
            });
        }
    });
});


//-- GET Request handling --//
/**
 * Retrieves all categories
 */
router.get("/", (req, res) => {
    //Retrieves a list of all the users
    Category.getCategories((err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            return res.status(200).send(result);
        }
    });
});


//-- PUT request handling --//
/**
 * Updates an exisitng category
 */
 router.put("/:id", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Retrirve the category id from the url params
    const categoryid = req.params.id;
    //Trims the user input before passing it through to the updateCategory method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Update the category
            Category.updateCategory(categoryid, trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);

                    //Unknown error occured
                    return res.status(500).send();
                } else {
                    //There was no error
                    return res.status(204).send();
                }
            });
        }
    });
});

//Export routes
module.exports = router
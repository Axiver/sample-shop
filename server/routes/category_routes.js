/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Category = require("../models/Category");


//-- POST Request handling --//
/**
 * Creates a new category
 */
router.post("/", (req, res) => {
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
                    return res.status(204).send();
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


//Export routes
module.exports = router
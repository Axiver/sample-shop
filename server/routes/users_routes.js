/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const User = require("../models/User");

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
 * Creates a new user
 */
router.post("/", (req, res) => {
    //Trims the user input before passing it through to the createUser method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Create a new user
            User.createUser(trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Check if the error was due to a duplicate entry
                    if (err.code == "ER_DUP_ENTRY") {
                        //Error was due to duplicate entry
                        return res.status(422).send();
                    } else {
                        //Unknown error occured
                        return res.status(500).send();
                    }
                } else {
                    //There was no error
                    let response = {"userid": result.insertId};
                    return res.status(201).send(response);
                }
            });
        }
    });
});


//-- GET Request handling --//
/**
 * Retrieves data for all user accounts
 */
router.get("/", (req, res) => {
    //Retrieves a list of all the users
    User.getUsers((err, result) => {
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

/**
 * Retrieves data for a specific user account
 */
router.get("/:id", (req, res) => {
    //Get the id supplied in the request parameter
    let userid = req.params.id;
    //Retrieves data for the user with a specific id
    User.getUserById(userid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned
                return res.status(200).send(result[0]);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});


//-- PUT request handling --//
/**
 * Updates the information of a user account that matches a specific userid
 */
router.put("/users/:id", (req, res) => {
    //Get the id supplied in the request parameter
    let userid = req.params.id;
    //Trims the user input before passing it through to the updateUser method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //Updates the information of a user with a specific id
            User.updateUser(userid, trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Check if the error was due to a duplicate entry
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

//Export routes
module.exports = router
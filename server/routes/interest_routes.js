
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Interest = require("../models/Interest");

//Middlewares
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");


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


//-- PUT Request handling --//
/**
 * Updates category interests for a user
 */
router.put("/:userid", isLoggedInMiddleware, (req, res) => {
    //Obtain the user id from the request parameters
    let userid = req.params.userid;

    //Check if the userid supplied matches the userid of the account the user is logged in to
    if (req.decodedToken.userid != userid) {
        //It does not match, this is an unauthorised request
        return res.status(401).send();
    }

    //Create an array of interests from req.body.categoryids
    let interests = req.body.categoryids;

    //Run the array through input sanitation
    trimObject(interests, (err, result) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Indicate category interest for the user
            Interest.createInterest(userid, interests, (err) => {
                //Check if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    return res.status(500).send();
                } else {
                    //There was no error
                    return res.status(201).send();
                }
            });
        }
    });
});


//-- GET Request handling --//
/**
 * Gets all category interests for a particular user
 */
router.get("/:userid", isLoggedInMiddleware, (req, res) => {
    //Obtain the user id from the request parameters
    let userid = req.params.userid;

    //Check if the userid supplied matches the userid of the account the user is logged in to
    if (req.decodedToken.userid != userid) {
        //It does not match, this is an unauthorised request
        return res.status(401).send();
    }

    //Retrieve category interest for the user
    Interest.getAllInterests(userid, (err, result) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, return the result
            return res.status(200).send(result);
        }
    });
});


//Export routes
module.exports = router
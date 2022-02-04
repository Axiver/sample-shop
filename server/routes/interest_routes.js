/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Interest = require("../models/Interest");

//Middlewares
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");


//-- POST Request handling --//
/**
 * Creates new category interests for a user
 */
router.post("/:userid", isLoggedInMiddleware, (req, res) => {
    //Obtain the user id from the request parameters
    let userid = req.params.userid;

    //Check if the userid supplied matches the userid of the account the user is logged in to
    if (req.decodedToken.userid != userid) {
        //It does not match, this is an unauthorised request
        return res.status(401).send();
    }

    //Create an array of interests from req.body.categoryids
    let interests = req.body.categoryids.split(",");

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



//-- PUT request handling --//


//Export routes
module.exports = router
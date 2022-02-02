/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Interest = require("../models/Interest");


//-- POST Request handling --//
/**
 * Creates new category interests for a user
 */
router.post("/:userid", (req, res) => {
    //Obtain the user id from the request parameters
    let userid = req.params.userid;
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
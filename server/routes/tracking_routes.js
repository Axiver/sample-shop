/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Tracking = require("../models/Tracking");


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
 * Increments the number of views of a particular product
 */
router.post("/view/product/:productid", (req, res) => {
    //Obtain the product id from the request parameters
    let productid = req.params.productid;
    
    //Indicate category interest for the user
    Tracking.productViewed(productid, (err) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            return res.status(204).send();
        }
    });
});


//-- GET Request handling --//



//-- PUT request handling --//


//Export routes
module.exports = router
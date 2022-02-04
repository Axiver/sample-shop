/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Tracking = require("../models/Tracking");


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
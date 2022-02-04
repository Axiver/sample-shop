/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();

//Models
const Promotion = require("../models/Promotion");

//Middlewares
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");

//-- POST Request handling --//
/**
 * Creates a new promotional period
 */
router.post("/", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Run the array through input sanitation
    trimObject(req.body, (err, result) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Create a new promotional period
            Promotion.createPromo(result, (err) => {
                //Check if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Checks if the error is due to invalid datetime or invalid discount value or the promotion coincides with a existing one
                    if (err == "INVALID_DATETIME" || err == "INVALID_DISCOUNT_VALUE" || err == "PROMO_OVERLAP") {
                        return res.status(422).send();
                    }
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
 * Gets a list of promotions available for a particular product
 */
router.get("/product/:id", (req, res) => {
    //Get the product id supplied in the request parameter
    let productid = req.params.id;
    //Gets the product image
    Promotion.getPromo(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        }
        //There was no error, check if any results were returned
        if (result.length > 0) {
            //There was at least 1 row returned
            return res.status(200).send(result);
        } else {
            //No results were returned
            return res.status(404).send();
        }
    });
});


//-- PUT request handling --//


//-- DELETE request handling --//
/**
 * Deletes a promotion with a specific id
 */
router.delete("/:id", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Get the id supplied in the request parameter
    let promoid = req.params.id;
    //Deletes the promotion with the promo id
    Promotion.deletePromo(promoid, (err, result) => {
        //Checks if there was an error
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

//Export routes
module.exports = router
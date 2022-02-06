/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const { imageHash } = require("image-hash");

//Models
const Product = require("../models/Product");

//Middlewares
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");


//-- Configure multer --//
const upload = multer({
    limits:{
        //Limit filesize to 1MB
        fileSize: "1MB"
    }
}).single("image");

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
 * Creates a new product
 */
router.post("/", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Trims the user input before passing it through to the createProduct method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Create the product
            Product.createProduct(trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Check if the error was because the user was unauthorised
                    if (err == "unauthorised") {
                        //User is unauthorised, not an admin account
                        return res.status(401).send();
                    }

                    return res.status(500).send();
                } else {
                    //There was no error
                    let response = {"productid": result.insertId};
                    return res.status(201).send(response);
                }
            });
        }
    });
});

/**
 * Creates a new review for a specific product
 */
router.post("/:id/review", isLoggedInMiddleware, (req, res) => {
    //Obtain the product id from the request parameters
    let productid = req.params.id;

    //Check if the user is logged in to the account with the userid that is specified in the request
    if (req.decodedToken.userid != req.body.userid) {
        //Userid does not match, user is unauthorised
        return res.status(401).send();
    }
    
    //Trims the user input before passing it through to the createReview method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //Create a new review
            Product.createReview(productid, trimmedInput, (err, result) => {
                //Check if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    return res.status(500).send();
                } else {
                    //There was no error
                    let response = {"reviewid": result.insertId};
                    return res.status(201).send(response);
                }
            });
        }
    });
});

/**
 * Uploads a image to the server for a specific product
 */
router.post("/:id/image", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Handle the image upload
    upload(req, res, async (err) => {
        //Checks if there was an error
        if (err) {
            console.log(err);
            //Checks if the error is due to filesize limit
            if (err.code == "LIMIT_FILE_SIZE") {
                //The file being uploaded is too large
                return res.status(413).send();
            }
            return res.status(500).send();
        }

        //There was no error, obtain the product id from the request parameters
        let productid = req.params.id;

        //Get the file extension
        const fileExt = req.file.originalname.split(".").at(-1).replace(/ /g, "");

        //Check if the file extension is allowed
        if (fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
            //The file is not allowed
            console.log("Filetype not allowed");
            return res.status(415).send();
        }
        //The file passes the checks, it is allowed
        //Get a hash of the file
        const buffer = req.file.buffer;
        imageHash({
            name: req.file.originalname,
            data: buffer
        }, 16, true, (err, data) => {
            //Check if there was an error
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            //There was no error
            //Write the file to disk with a filepath of /uploads/ and filename of <hash of file> + <file ext>
            let filepath = `./uploads/product_images/${data}.${fileExt}`;
            fs.writeFile(filepath, buffer, (err) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    return res.status(500).send();
                }
                //There was no error, save the filepath to db
                Product.uploadImage(productid, filepath, (err, result) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        console.log(err);
                        //Check if the error was due to a duplicate entry
                        if (err.code == "ER_DUP_ENTRY") {
                            //Error was due to duplicate entry
                            return res.status(422).send();
                        }
                        return res.status(500).send();
                    }
                    //There was no error, send the sequence id and image url back to the client
                    let response = {"sequence": result.sequence, "url": filepath};
                    return res.status(201).send(response);
                });
            });
        });
    })
});


//-- GET Request handling --//
/**
 * Retrieves data for a specific product
 */
router.get("/:id", (req, res) => {
    //Get the id supplied in the request parameter
    let productid = req.params.id;
    //Retrieves data for the product with a specific id
    Product.getProductById(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned, format the response
                let response = result[0];
                response.categoryname = response.category;
                delete response.category;
                return res.status(200).send(response);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves products starting from a particular index
 */
 router.get("/from/:id", (req, res) => {
    //Get the id supplied in the request parameter
    let productid = req.params.id;

    //Retrieves data for the product with a specific id
    Product.getProductFromId(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.results.length > 0) {
                //There was at least 1 row returned, format the response
                for (let i = 0; i < result.results.length; i++) {
                    let element = result.results[i];
                    element.categoryname = element.category;
                    delete element.category;
                    //Update the result array
                    result.results[i] = element;
                }
                //Send the response
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves products based on search terms
 */
router.get("/sort/searchterms/:searchTerms", (req, res) => {
    //Get the search terms supplied in the request parameter
    let searchTerms = req.params.searchTerms;
;
    //Format the searchterms into an array
    searchTerms = searchTerms.split(" ");

    //Retrieves products based on the search terms supplied
    Product.getProductBySearchTerms(searchTerms, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned, format the response
                for (let i = 0; i < result.length; i++) {
                    let element = result[i];
                    element.categoryname = element.category;
                    delete element.category;
                    //Update the result array
                    result[i] = element;
                }
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(404).send();
            }
        }
    });
});

/**
 * Retrieves products based on their ratings (in descending order)
 */
router.get("/sort/ratings/", (req, res) => {
    //Retrieves products based on their ratings
    Product.getProductByRatings((err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned, format the response
                for (let i = 0; i < result.length; i++) {
                    let element = result[i];
                    element.categoryname = element.category;
                    delete element.category;
                    //Update the result array
                    result[i] = element;
                }
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves products under a particular category (id)
 */
router.get("/filter/category/:categoryid", (req, res) => {
    //Retrieves the category id from the request url
    const categoryid = req.params.categoryid;
    //Retrieves products under a particular category
    Product.getProductByCategory(categoryid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves products under a particular category (name)
 */
 router.get("/filter/category/name/:categoryname", (req, res) => {
    //Retrieves the category name from the request url
    const categoryname = req.params.categoryname;
    //Retrieves products under a particular category
    Product.getProductByCategoryName(categoryname, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves all reviews for a product, including the username of the reviewer (sorted by date)
 */
router.get("/:id/reviews", (req, res) => {
    //Get the product id supplied in the request parameter
    let productid = req.params.id;
    //Retrieves all the reviews for the product
    Product.getReviews(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves a specific review for a product, including the username of the reviewer
 */
 router.get("/:productid/review/:reviewid", (req, res) => {
    //Get the product id supplied in the request parameter
    let productid = req.params.productid;

    //Get the review id supplied in the request parameter
    let reviewid = req.params.reviewid;

    //Retrieves the review
    Product.getReview(productid, reviewid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result) {
                //There was at least 1 row returned
                return res.status(200).send(result);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Retrieves the average ratings for a particular product
 */
router.get("/:id/reviews/average", (req, res) => {
    //Get the product id supplied in the request parameter
    let productid = req.params.id;
    //Retrieves the average ratings of the product with the productid supplied
    Product.getProductAverageRatings(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, return the result
            return res.status(200).send(`${result}`);
        }
    });
});

/**
 * Gets the total number of images a product has
 */
router.get("/:id/image", (req, res) => {
    //Get the product id supplied in the request parameter
    let productid = req.params.id;
    //Gets the product image
    Product.getImageCount(productid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        }
        //There was no error, check if any results were returned
        if (result.length > 0) {
            //Send the result to the client
            result = {"count": result.length};
            return res.status(200).send(result);
        } else {
            //No results were returned
            return res.status(500).send();
        }
    });
});

/**
 * Gets a particular image of a particular product
 */
router.get("/:id/image/:sequence", (req, res) => {
    //Get the product id and image id supplied in the request parameter
    let productid = req.params.id;
    let sequence = req.params.sequence;
    //Gets the product image
    Product.getImage(productid, sequence, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        }
        //There was no error, check if any results were returned
        if (result.length > 0) {
            //At least 1 result was returned, send the location of the image to the user
            let response = `${result[0].path.replace("./", "/")}`;
            return res.status(200).send(response);
            //Retrieve the image from the /uploads/ directory and send it to the user
            //res.sendFile(path.resolve(__dirname + "/." + result[0].path));
        } else {
            //No results were returned
            return res.status(404).send();
        }
    });
});


//-- PUT request handling --//
/**
 * Modifies an existing product
 */
 router.put("/:id", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Retrieve the product id from url params
    const productid = req.params.id;
    //Trims the user input before passing it through to the modifyProduct method
    trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Create the product
            Product.modifyProduct(productid, trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    //Check if the error was because the user was unauthorised
                    if (err == "unauthorised") {
                        //User is unauthorised, not an admin account
                        return res.status(401).send();
                    }

                    return res.status(500).send();
                } else {
                    //There was no error
                    return res.status(204).send();
                }
            });
        }
    });
});


//-- DELETE request handling --//
/**
 * Deletes a product with a specific id
 */
router.delete("/:id", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Get the id supplied in the request parameter
    let productid = req.params.id;
    //Deletes the product with the product id
    Product.deleteProduct(productid, (err, result) => {
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

/**
 * Deletes a image with a specific id
 */
 router.delete("/:productid/image/:imageid", [isLoggedInMiddleware, isAdminMiddleware], (req, res) => {
    //Get the id supplied in the request parameter
    const productid = req.params.productid;
    const imageid = req.params.imageid;
    //Deletes the image with a imageid for the product with the product id
    Product.deleteImage(productid, imageid, (err, result) => {
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
module.exports = router;
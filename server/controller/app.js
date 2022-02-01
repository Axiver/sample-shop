/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Import required modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const getStream = require("get-stream");
const { imageHash } = require("image-hash");
const cors = require("cors");

//Models
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Interest = require("../models/Interest");
const Promotion = require("../models/Promotion");

//Hook middlewares
app.use(cors());
app.use(bodyParser.json());

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
        for (let i = 0; i < object.length; i++) {
            //Trim the current index in the object
            object[i] = object[i].trim();
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
app.post("/users/", (req, res) => {
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

/**
 * Creates a new category
 */
app.post("/category", (req, res) => {
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

/**
 * Creates a new product
 */
app.post("/product", (req, res) => {
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
app.post("/product/:id/review", (req, res) => {
    //Obtain the product id from the request parameters
    let productid = req.params.id;
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
app.post("/product/:id/image", (req, res) => {
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

        //Check if the filetype is allowed
        const fileExt = req.file.detectedFileExtension;
        if (fileExt !== '.png' && fileExt !== '.jpg') {
            //The file is not allowed
            console.log("Filetype not allowed");
            return res.status(415).send();
        }
        
        //The file passes the checks, it is allowed
        //Get a hash of the file
        const buffer = await getStream.buffer(req.file.stream);
        imageHash({
            data: buffer
        }, 16, true, (err, data) => {
            //Check if there was an error
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            //There was no error
            //Write the file to disk with a filepath of /uploads/ and filename of <hash of file> + <file ext>
            let filepath = "./uploads/" + data + fileExt;
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
                    //There was no error, send the sequence id back to the client
                    let response = {"sequence": result.sequence};
                    return res.status(201).send(response);
                });
            });
        });
    })
});

/**
 * Creates new category interests for a user
 */
app.post("/interest/:userid", (req, res) => {
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

/**
 * Increments the number of views of a particular product
 */
app.post("/tracking/view/product/:productid", (req, res) => {
    //Obtain the product id from the request parameters
    let productid = req.params.productid;
    //Indicate category interest for the user
    Interest.productViewed(productid, (err) => {
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

/**
 * Creates a new promotional period
 */
app.post("/promotions/", (req, res) => {
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
 * Retrieves data for all user accounts
 */
app.get("/users/", (req, res) => {
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
 app.get("/users/:id", (req, res) => {
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

/**
 * Retrieves all categories
 */
app.get("/category", (req, res) => {
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

/**
 * Retrieves data for a specific product
 */
app.get("/product/:id", (req, res) => {
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
 * Retrieves products based on search terms
 */
 app.get("/product/sort/searchterms/:searchTerms", (req, res) => {
    //Get the search terms supplied in the request parameter
    let searchTerms = req.params.searchTerms;
    console.log(searchTerms);
    //Format the searchterms into an array
    searchTerms = searchTerms.split(",");
    console.log(searchTerms);
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
 app.get("/product/sort/ratings/", (req, res) => {
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
 * Retrieves products under a particular category
 */
 app.get("/product/filter/category/:categoryid", (req, res) => {
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
 * Retrieves all reviews for a product, including the username of the reviewer
 */
app.get("/product/:id/reviews", (req, res) => {
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
 * Gets the total number of images a product has
 */
app.get("/product/:id/image", (req, res) => {
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
 app.get("/product/:id/image/:sequence", (req, res) => {
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
            //Retrieve the image from the /uploads/ directory and send it to the user
            res.sendFile(path.resolve(__dirname + "/." + result[0].path));
        } else {
            //No results were returned
            return res.status(404).send();
        }
    });
});

/**
 * Gets a list of promotions available for a particular product
 */
app.get("/promotions/product/:id", (req, res) => {
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
/**
 * Updates the information of a user account that matches a specific userid
 */
app.put("/users/:id", (req, res) => {
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

//-- DELETE request handling --//
/**
 * Deletes a product with a specific id
 */
app.delete("/product/:id", (req, res) => {
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
 * Deletes a promotion with a specific id
 */
 app.delete("/promotions/:id", (req, res) => {
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

//Export the app
module.exports = app;
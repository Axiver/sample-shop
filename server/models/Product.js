/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Load required modules and configs
const db = require("./databaseConfig");

/* Functions */
/**
 * Establishes a connection to the database
 * @param {{(err: null | any, dbConn: null | object): void}} callback The callback to pass the db connection to
 */
function connectDB(callback) {
    //Connects to the databse
    var dbConn = db.getConnection();
    dbConn.connect((err) => {
        //Checks if there was an error trying to connect to the database
        if (err) {
            //There was an error
            return callback(err, null);
        } else {
            //There was no error, return the db object
            return callback(null, dbConn);
        }
    });
}

/**
 * Sorts returned rows by a particular column (in desc order)
 * @param {string} key Name of the column
 * @param {[]} data Data to sort
 * @param {boolean} reverse Whether or not to sort in asc order instead
 * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
 */
function sortBy(key, data, reverse, callback) {
    //Sort the data array according to the column supplied
    for (let i = 0; i < data.length - 1; i++) {
        //Get the value of the column specified for the item at the current index
        let currValue = data[i][key];
        //Get the value of the column specified for the item one index down
        let nextValue = data[i + 1][key];
        //Check if the value of the current item < value of the item one index down (vice-versa if reverse is set to true)
        if (!reverse && currValue < nextValue || reverse && currValue > nextValue) {
            //Value of the item at the current index is less than that of the item one index down
            //Swap the places of the item at the current index and the item one index down
            let currIndex = data[i];
            data[i] = data[i + 1];
            data[i + 1] = currIndex;

            //Restart the loop
            i = -1;
        }
    }

    //Loop over, return the result
    return callback(null, data);
}

//Declare available methods for interacting with the db
const Product = {
    /**
     * Creates a new product
     * @param {Object} data Information about the product to be created
     * @param {string} data.name The name of the product
     * @param {string} data.description The description of the product
     * @param {number} data.categoryid The id of the category the product falls under
     * @param {string} data.brand The brand of the product
     * @param {number} data.price The price of the product 
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    createProduct: (data, callback) => {
        //Deconstruct the data object
        ({description, categoryid, brand, price} = data);
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "INSERT INTO products (name, description, categoryid, brand, price) VALUES (?, ?, ?, ?, ?)";
                dbConn.query(sqlQuery, [data.name, description, categoryid, brand, price], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        dbConn.end();
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets info of a product with a specific id
     * @param {number} productid The id of the product to lookup
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getProductById: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT name, products.description, products.categoryid, categories.category, brand, price FROM products, categories WHERE productid = ? AND categories.categoryid = products.categoryid";
                dbConn.query(sqlQuery, productid, (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets info of products matching a particular search term
     * @param {[]} searchTerms Search terms 
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getProductBySearchTerms: (searchTerms, callback) => {
        searchTerms = searchTerms.map((i) => "%" + i + "%");
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                //Construct the query
                let sqlQuery = "SELECT productid, name, products.description, products.categoryid, categories.category, brand, price FROM products, categories WHERE categories.categoryid = products.categoryid";
                for (let i = 0; i < searchTerms.length; i++) {
                    sqlQuery += " AND name LIKE ?";
                }
                dbConn.query(sqlQuery, searchTerms, (err, results) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //Closes the db connection
                        dbConn.end();

                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets a product's average ratings
     * @param {number} productid The id of the product
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getProductAverageRatings: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //Proceed with query
                let sqlQuery = "SELECT rating FROM reviews WHERE productid = ?";
                dbConn.query(sqlQuery, productid, (err, ratings) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //Closes the db connection
                        dbConn.end();

                        //There was no error, check if there are any rows returned
                        if (ratings.length > 0) {
                            //There was at least 1 row returned
                            //Add up the ratings for the current product
                            let avgRatings = 0;
                            for (let j = 0; j < ratings.length; j++) {
                                avgRatings += ratings[j].rating;
                            }
                            //Calculate the average ratings for the current product
                            avgRatings /= ratings.length;

                            //Return the result
                            return callback(null, avgRatings);
                        } else {
                            //No rows were returned. This product has 0 ratings, so we just return null
                            return callback(null);
                        }
                    }
                });
            }
        });
    },
    /**
     * Gets info of products based on their ratings (From highest to lowest)
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getProductByRatings: (callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query (Selects all products)
                let sqlQuery = "SELECT name, products.productid, products.description, products.categoryid, categories.category, brand, price FROM products, categories WHERE categories.categoryid = products.categoryid";
                dbConn.query(sqlQuery, (err, results) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, loop through the results and get the ratings for each product
                        for (let i = 0; i < results.length; i++) {
                            //Get a product's average ratings and append it to the results array
                            Product.getProductAverageRatings(results[i].productid, (err, avgRatings) => {
                                //Checks if there was an error
                                if (err)
                                    return callback(err, null);

                                results[i].avgRatings = avgRatings;

                                //Checks if this is the final loop
                                if (i == results.length - 1) {
                                    //This is the final loop, close the db connection
                                    dbConn.end();
                                    //Sort the results array by avg ratings
                                    sortBy("avgRating", results, false, (err, data) => {
                                        //Results array has been sorted, return the result
                                        return callback(null, data);
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    /**
     * Gets info of products under a particular category (id)
     * @param {string} categoryid Id of the category
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getProductByCategory: (categoryid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query 
                let sqlQuery = "SELECT productid, name, products.description, products.categoryid, brand, price FROM products WHERE products.categoryid = ?";
                dbConn.query(sqlQuery, categoryid, (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets info of products under a particular category (name)
     * @param {string} categoryName Name of the category
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
     getProductByCategoryName: (categoryName, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query 
                let sqlQuery = "SELECT productid, name, products.description, products.categoryid, brand, price FROM products, categories WHERE products.categoryid = categories.categoryid AND categories.category = ?";
                dbConn.query(sqlQuery, categoryName, (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Deletes a product with a specific id
     * @param {number} productid The id of the product to lookup
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    deleteProduct: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "DELETE FROM products WHERE productid = ?";
                dbConn.query(sqlQuery, productid, (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Writes a new review for a product
     * @param {number} productid The ID of the product the review is for
     * @param {Object} reviewData Object containing data for the review to be created
     * @param {number} reviewData.userid The id of the user that wrote the review
     * @param {number} reviewData.rating The rating given by the user for the product
     * @param {string} reviewData.review A review of the product
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    createReview: (productid, reviewData, callback) => {
        //Deconstruct the reviewData object
        ({userid, rating, review} = reviewData);
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "INSERT INTO reviews (productid, userid, rating, review) VALUES (?, ?, ?, ?)";
                dbConn.query(sqlQuery, [productid, userid, rating, review], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets all the reviews for a particular product (sorted by date)
     * @param {number} productid The id of the product
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getReviews: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT productid, reviews.userid, users.username, users.profile_pic_url, rating, review, reviews.created_at FROM reviews, users WHERE productid = ? AND users.userid = reviews.userid ORDER BY reviews.created_at DESC";
                dbConn.query(sqlQuery, [productid], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },
    /**
     * Gets a specific review
     * @param {number} productid The id of the product
     * @param {number} reviewid The id of the review
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getReview: (productid, reviewid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT productid, reviews.userid, users.username, users.profile_pic_url, rating, review, reviews.created_at FROM reviews, users WHERE productid = ? AND reviewid = ? AND users.userid = reviews.userid";
                dbConn.query(sqlQuery, [productid, reviewid], (err, result) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the result
                        return callback(null, result[0]);
                    }
                });
            }
        });
    },
    /**
     * Saves the directory of a uploaded image to the database, and associates it with a product
     * @param {number} productid The id of the product the image is intended for
     * @param {string} dir The path to the uploaded image
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    uploadImage: (productid, dir, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Gets the sequence # to use for this image
                const sqlQuery = "SELECT MAX(sequence) FROM product_images WHERE productid = ?";
                dbConn.query(sqlQuery, [productid], (err, results) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, check if any rows were returned
                        let sequenceNumber = 1;
                        if (results[0]["MAX(sequence)"] != null) {
                            //At least a row was returned, select the row with the largest number and increment by 1
                            sequenceNumber = results[0]["MAX(sequence)"] + 1;
                        }

                        //Proceed with insertion
                        const sqlQuery = "INSERT INTO product_images (productid, path, sequence) VALUES (?, ?, ?)";
                        dbConn.query(sqlQuery, [productid, dir, sequenceNumber], (err, results) => {
                            //Closes the db connection
                            dbConn.end();
                            //Checks if there was an error
                            if (err) {
                                //There was an error
                                return callback(err, null);
                            } else {
                                //There was no error, return the results
                                results.sequence = sequenceNumber;
                                return callback(null, results);
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * Retrieves the number of images a particular product has
     * @param {number} productid The ID of the product
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getImageCount: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT * FROM product_images WHERE productid = ?";
                dbConn.query(sqlQuery, [productid], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    },

    /**
     * Retrieves the image of a particular product
     * @param {number} productid The ID of the product
     * @param {number} sequence The sequence id of the image
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getImage: (productid, sequence, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT * FROM product_images WHERE productid = ? AND sequence = ?";
                dbConn.query(sqlQuery, [productid, sequence], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, return the results
                        return callback(null, results);
                    }
                });
            }
        });
    }
}

//Exposes the methods declared
module.exports = Product;
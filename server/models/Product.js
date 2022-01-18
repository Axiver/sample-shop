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
     * Gets all the reviews for a particular product
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
                const sqlQuery = "SELECT productid, reviews.userid, users.username, rating, review FROM reviews, users WHERE productid = ? AND users.userid = reviews.userid";
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
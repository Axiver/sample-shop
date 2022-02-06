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
const Interest = {
    /**
     * Indicates category interest
     * @param {number[]} categoryids An array containing the ids of the categories the user is interested in
     * @param {{(err: null | any): void}} callback The callback to invoke once the operation is completed
     */
    createInterest: (userid, categoryids, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err);
            } else {
                //There was no error
                //Delete all previous category interests
                var sqlQuery = "DELETE FROM user_interests WHERE userid = ?";
                dbConn.query(sqlQuery, userid, (err, results) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err);
                    } else {
                        //There was no error, proceed with inserting the new data
                        //Check if there is any data to insert
                        if (categoryids.length > 0) {
                            //There is at least 1 new data to insert
                            //Loop through the categoryids array to create a new interest for every category id
                            for (let i = 0; i < categoryids.length; i++) {
                                //Post-loop execution is done within the final iteration because dbConn.query is synchronous, so the loop ends before the operation is actually completed. Doing it this way ensures that the callback isn't invoked early.
                                //Get the current category id
                                let categoryid = categoryids[i];
                                //Check if the record already exists
                                var sqlQuery = "SELECT * FROM user_interests WHERE userid = ? AND categoryid = ? LIMIT 1";
                                dbConn.query(sqlQuery, [userid, categoryid], (err, results) => {
                                    //Checks if there was an error
                                    if (err) {
                                        //There was an error
                                        return callback(err);
                                    } else {
                                        //There was no error, check if any rows were returned
                                        if (results.length == 0) {
                                            //No rows were returned, so let's insert the record
                                            sqlQuery = "INSERT INTO user_interests (userid, categoryid) VALUES (?, ?)";
                                            dbConn.query(sqlQuery, [userid, categoryid], (err, results) => {
                                                //Checks if there was an error
                                                if (err) {
                                                    //There was an error
                                                    return callback(err);
                                                } else {
                                                    //There was no error, check if this is the last iteration of the loop
                                                    if (i == categoryids.length - 1) {
                                                        //This is the last iteration, all interests have been created
                                                        //Closes the db connection
                                                        dbConn.end();
                                                        return callback(null);
                                                    }
                                                }
                                            });
                                        } else {
                                            //The entry already exists, check if this is the last iteration
                                            if (i == categoryids.length - 1) {
                                                //This is the last iteration, all interests have been created
                                                //Closes the db connection
                                                dbConn.end();
                                                return callback(null);
                                            }
                                        }
                                    }
                                });
                            }
                        } else {
                            //There is no new data to be inserted, user only wanted to clear all data
                            dbConn.end();
                            return callback(null);
                        }
                    }
                });
            }
        });
    },
    /**
     * Gets all the category interests of a particular user
     * @param {number} userid The id of the user
     * @param {{(err: null | any): void}} callback The callback to invoke once the operation is completed
     */
    getAllInterests: (userid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err);
            } else {
                //Proceed with query
                var sqlQuery = "SELECT categoryid FROM user_interests WHERE userid = ?";
                dbConn.query(sqlQuery, userid, (err, result) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err);
                    } else {
                        //There was no error
                        //End the db conn
                        dbConn.end();
                        
                        //Return the result
                        callback(null, result);
                    }
                });
            }
        });
    },
    /**
     * Indicates product view
     * @param {*} productid The id of the product viewed
     * @param {{(err: null | any, dbConn: null | object): void}} callback The callback to pass the db connection to
     */
    productViewed: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err);
            } else {
                //Proceed with query
                var sqlQuery = "SELECT views FROM products WHERE productid = ?";
                dbConn.query(sqlQuery, productid, (err, result) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err);
                    } else {
                        //There was no error, check if any rows were returned
                        if (result.length > 0) {
                            //At least 1 row was returned. Update the view count
                            sqlQuery = "UPDATE products SET views = ? WHERE productid = ?";
                            dbConn.query(sqlQuery, result[0] + 1, (err, results) => {
                                //Checks if there was an error
                                if (err) {
                                    //There was an error
                                    return callback(err);
                                } else {
                                    //There was no error
                                    //Closes the db connection
                                    dbConn.end();
                                    return callback(null);
                                }
                            });
                        } else {
                            //The product does not exist
                            //Closes the db connection
                            dbConn.end();
                            return callback("Product with given id does not exist");
                        }
                    }
                });
            }
        });
    }
}

//Exposes the methods declared
module.exports = Interest;
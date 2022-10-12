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
const Tracking = {
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
                            console.log("res:", result);
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
module.exports = Tracking;
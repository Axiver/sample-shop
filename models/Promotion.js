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
 * Formats a datetime into the mysql datetime format
 * @param {string} dateTime A valid JS format datetime
 * @returns MySQL-compliant datetime
 */
function formatDateTime(dateTime) {
    //Convert the dateTime to a Date object with a timezone of UTC +0000 as .toISOString() will be unhappy otherwise
    dateTime = new Date(dateTime + "+00:00");
    //Convert the Date object into the mysql datetime format
    dateTime = dateTime.toISOString().slice(0, 19).replace("T", " ");
    //Return the result
    return dateTime;
}

//Declare available methods for interacting with the db
const Promotion = {
    /**
     * Creates a new promotional period for a product
     * @param {Object} data Information about the promotional period to be created
     * @param {number} data.productid The id of the product that will be having a promotion
     * @param {number} data.discount The value of the discount
     * @param {string} data.starttime The time the promotional period starts
     * @param {string} data.endtime The time the promotional period ends
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    createPromo: (data, callback) => {
        //Deconstruct the data object
        ({productid, discount, start_date, end_date} = data);

        //Checks if the discount is a negative or 0 value
        if (discount <= 0) {
            //There was an error
            return callback("INVALID_DISCOUNT_VALUE", null);
        }

        //Format start_date to mysql datetime format
        try {
            start_date = formatDateTime(start_date);
        } catch (err) {
            //There was an error
            return callback("INVALID_DATETIME", null);
        }

        //Check if the promotional period ends after it starts
        if (new Date(start_date) >= new Date(end_date)) {
            //The promotional period starts after it ends
            return callback("INVALID_DATETIME", null);
        }

        //Format end_date to mysql datetime format
        try {
            end_date = formatDateTime(end_date);
        } catch (err) {
            //There was an error
            return callback("INVALID_DATETIME", null);
        }

        //Check if the promotional period hasn't already ended
        if (new Date() >= new Date(end_date)) {
            //The promotional period has already ended
            return callback("INVALID_DATETIME", null);
        }

        //All checks passed, establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error, check if there are any existing promotions that overlap with the one being created
                var sqlQuery = "SELECT * FROM promotions WHERE productid = ? AND start_date BETWEEN ? AND ? OR productid = ? AND end_date BETWEEN ? AND ? OR productid = ? AND ? BETWEEN start_date AND end_date";
                dbConn.query(sqlQuery, [productid, start_date, end_date, productid, start_date, end_date, productid, start_date], (err, results) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, check if any rows were returned
                        if (results.length > 0) {
                            //At least 1 row was returned, this promo cannot be created as we cannot have overlapping promos
                            return callback("PROMO_OVERLAP", null);
                        }
                        //No existing promotions within the stipulated time period, proceed with SQL query
                        sqlQuery = "INSERT INTO promotions (productid, discount, start_date, end_date) VALUES (?, ?, ?, ?)";
                        dbConn.query(sqlQuery, [productid, discount, start_date, end_date], (err, results) => {
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
        });
    },
    /**
     * Retrives the promotional periods and discounts available for a particular product
     * @param {number} productid The id of the product
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getPromo: (productid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT id, productid, discount, start_date, end_date FROM promotions WHERE productid = ?";
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
     * Deletes a particular promotion
     * @param {*} promoid The id of the promotion to be deleted
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    deletePromo: (promoid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "DELETE FROM promotions WHERE id = ?";
                dbConn.query(sqlQuery, [promoid], (err, results) => {
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
module.exports = Promotion;
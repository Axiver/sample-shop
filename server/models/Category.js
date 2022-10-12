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
const Category = {
    /**
     * Creates a new category
     * @param {Object} data Object containing category data
     * @param {string} data.category The name of the category to be created
     * @param {string} data.description The description of the category being created 
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    createCategory: (data, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "INSERT INTO categories (category, description) VALUES (?, ?)";
                dbConn.query(sqlQuery, [data.category, data.description], (err, results) => {
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
     * Updates an existing category
     * @param {number} categoryid The id of the category to be updated
     * @param {Object} data Object containing category data
     * @param {string} data.category The name of the category to be created
     * @param {string} data.description The description of the category being created 
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    updateCategory: (categoryid, data, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "UPDATE categories SET category = ?, description = ? WHERE categoryid = ?";
                dbConn.query(sqlQuery, [data.category, data.description, categoryid], (err, results) => {
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
     * Retrieves the data for all categories
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
     getCategories: (callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT categoryid, category, description FROM categories";
                dbConn.query(sqlQuery, (err, results) => {
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
module.exports = Category;
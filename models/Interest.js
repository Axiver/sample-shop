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
    createInterest(userid, categoryids, callback) {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err);
            } else {
                //There was no error
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
            }
        });
    }
}

//Exposes the methods declared
module.exports = Interest;
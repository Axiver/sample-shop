/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//Load required modules and configs
const bcrypt = require("bcrypt");
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
 * Checks if the email supplied has a valid email format
 * @param {string} email The email to be validated
 */
function validateEmail(email) {
    //Regex expression for email validation
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    //Checks if the email is null
    if (!email)
        return false;

    //Checks if the email is longer than 254 characters
    if (email.length > 254)
        return false;

    //Runs the email against the regex expression
    var valid = emailRegex.test(email);

    //Checks if the expression comes out as invalid
    if (!valid)
        return false;

    //Further checking of some things regex can't handle
    //Check if the first section of the email is longer than 64 characters
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    //Checks if the domain of the email is more than 63 characters per section
    var domainParts = parts[1].split(".");
    if (domainParts.some((part) => { return part.length > 63; }))
        return false;
    
    //All checks passed, return true
    return true;
}

//Declare available methods for interacting with the db
const User = {
    /**
     * Creates a new user with the data supplied
     * @param {Object} userData Object containing the data for the user account to be created
     * @param {string} userData.username The username
     * @param {string} userData.email The email address
     * @param {string} userData.contact The contact number
     * @param {string} userData.password The password
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    createUser: (userData, callback) => {
        //Deconstruct the userData object
        ({username, email, contact, password} = userData);
        
        //Validates the email to check if the format supplied is valid
        if (validateEmail(email)) {
            //The email is valid
            //Hash the plaintext password supplied by the user
            bcrypt.hash(password, 10, function(err, hash) {
                //Check if there was an error
                if (err) {
                    //There was an error
                    return callback(err, null);
                } else {
                    //There was no error
                    //Establish a connection to the database
                    connectDB((err, dbConn) => {
                        //Checks if there was an error
                        if (err) {
                            //There was an error
                            return callback(err, null);
                        } else {
                            //There was no error
                            //Proceed with SQL query
                            const sqlQuery = "INSERT INTO users (username, email, contact, password) VALUES (?, ?, ?, ?)";
                            dbConn.query(sqlQuery, [username, email, contact, hash], (err, results) => {
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
        } else {
            //The email is invalid
            return callback("Invalid email", null);
        }
    },

    /**
     * Retrieves the data for all user accounts
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getUsers: (callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM users";
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
    },
    /**
     * Retrieves the data for a user with a specific id
     * @param {number} userid The ID of the user to be retrieved
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    getUserById: (userid, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM users WHERE userid = ?";
                dbConn.query(sqlQuery, [userid], (err, results) => {
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
     * Updates the account with a specific userid with new data
     * @param {number} userId The userid of the user to be updated
     * @param {Object} userData Object containing the new data for the user account
     * @param {string} userData.username The username
     * @param {string} userData.email The email address
     * @param {string} userData.contact The contact number
     * @param {string} userData.oldPassword The old password
     * @param {string} userData.password The password
     * @param {string} userData.profile_pic_url The url of the profile picture
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    updateUser: (userid, userData, callback) => {
        //Deconstruct the userData object
        ({username, email, contact, oldPassword, password} = userData);
        //Validates the email to check if the format supplied is valid
        if (validateEmail(email)) {
            //The email is valid
            //Check if the user wants to update their password
            if (password) {
                //The user wants to update their password
                //Retrieve the user's old password
                //Establish a connection to the database
                connectDB((err, dbConn) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error
                        //Proceed with SQL query
                        const sqlQuery = "SELECT password FROM users WHERE userid = ?";
                        dbConn.query(sqlQuery, userid, (err, results) => {
                            //Checks if there was an error
                            if (err) {
                                //There was an error
                                return callback(err, null);
                            } else {
                                //There was no error, compare password hashes
                                if (bcrypt.compareSync(oldPassword, results[0].password)) {
                                    //Password matches, check if the new password is the same as the old password
                                    if (!bcrypt.compareSync(password, results[0].password)) {
                                        //New password is different, proceed to update user info
                                        //Hash the plaintext password supplied by the user
                                        bcrypt.hash(password, 10, (err, hash) => {
                                            //Check if there was an error
                                            if (err) {
                                                //There was an error
                                                return callback(err, null);
                                            } else {
                                                //There was no error
                                                //Proceed with SQL query
                                                const sqlQuery = "UPDATE users SET username = ?, email = ?, contact = ?, password = ? WHERE userid = ?";
                                                dbConn.query(sqlQuery, [username, email, contact, hash, userid], (err, results) => {
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
                                    } else {
                                        //New password is the same as the old password, reject
                                        return callback({"code": "same password"});
                                    }
                                } else {
                                    return callback({"code": "unauthorised"});
                                }
                            }
                        });
                    }
                });
            } else {
                //The user does not want to update their old password
                //Establish a connection to the database
                connectDB((err, dbConn) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error
                        //Proceed with SQL query
                        const sqlQuery = "UPDATE users SET username = ?, email = ?, contact = ? WHERE userid = ?";
                        dbConn.query(sqlQuery, [username, email, contact, userid], (err, results) => {
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
        } else {
            //The email is invalid
            return callback("Invalid email", null);
        }
    },
    /**
     * Saves the directory of a uploaded image to the database, and associates it with a user
     * @param {number} userid The id of the user to update the profile picture of
     * @param {string} dir The path to the uploaded image
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    updateProfilePic: (userid, dir, callback) => {
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with update
                const sqlQuery = "UPDATE users SET profile_pic_url = ? WHERE userid = ?";
                dbConn.query(sqlQuery, [dir, userid], (err, results) => {
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
     * Authenticates a user login
     * @param {string} email The user's email address
     * @param {string} password The user's password
     * @param {{(err: null | any, result: null | object): void}} callback The callback to invoke once the operation is completed
     */
    authenticate: (email, password, callback) => {
        //Retrieve the hashed password of the user account matching the email address supplied
        //Establish a connection to the database
        connectDB((err, dbConn) => {
            //Checks if there was an error
            if (err) {
                //There was an error
                return callback(err, null);
            } else {
                //There was no error
                //Proceed with SQL query
                const sqlQuery = "SELECT password, userid, username, type, profile_pic_url FROM users WHERE email = ?";
                dbConn.query(sqlQuery, [email], (err, results) => {
                    //Closes the db connection
                    dbConn.end();
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        return callback(err, null);
                    } else {
                        //There was no error, check if any rows were returned
                        if (results.length > 0) {
                            //An account with the given email address exists
                            const account = results[0];
                            //Verify the password
                            if (bcrypt.compareSync(password, account.password)) {
                                //Password matches, return the userid
                                return callback(null, account);
                            }
                        }

                        //An account with the given email address does not exist
                        return callback("invalid account details", null);
                    }
                });
            }
        });
    }
}

//Exposes the methods declared
module.exports = User;
/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//-- Class --//
class User {
    //-- Static properties --//
    //Query url
    static baseUrl = window.location.origin.replace(":3001", ":3000");

    /**
     * Registers a new user account
     * @param {string} username The username of the account
     * @param {string} contact The contact number of the account
     * @param {string} email The email address of the account
     * @param {string} password The password of the account
     * @param {()} callback Invoked when the request is complete
     * @returns {string?} Error message 
     */
    static register(username, contact, email, password, callback) {
        const reqUrl = User.baseUrl + '/api/users/';
        axios.post(reqUrl, {
            username: username,
            contact: contact,
            email: email,
            password: password
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err.response.data);
            return;
        });
    }

    /**
     * Attemps to login to a user account
     * @param {*} email The email address of the user account
     * @param {*} password The password of the account
     * @param {()} callback Invoked when the request is complete
     * @returns Result
     */
    static login(email, password, callback) {
        const reqUrl = User.baseUrl + '/api/users/authenticate';
        axios.post(reqUrl, {
            email: email,
            password: password
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }
}
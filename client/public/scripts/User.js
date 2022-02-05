/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//-- Class --//
class User {
    //-- Static properties --//
    //Query url
    static baseUrl = window.location.origin.replace(":3001", ":3000");

    //-- POSTS --//
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

    /**
     * Logs out the user
     * @param {()} callback Invoked when the request is complete
     */
    static logout(callback) {
        //Clear both storages
        sessionStorage.clear();
        localStorage.clear();

        //Invoke callback
        if (callback)
            callback();

        return;
    }

    /**
     * Updates an existing user account
     * @param {number} userid The id of the user account to be updated
     * @param {string} bearerToken The bearer token
     * @param {string} username The username of the account
     * @param {string} contact The contact number of the account
     * @param {string} email The email address of the account
     * @param {string} oldPassword The old password of the account
     * @param {string} password The new password of the account
     * @param {()} callback Invoked when the request is complete
     * @returns {string?} Error message 
     */
    static update(userid, bearerToken, username, contact, email, oldPassword, password, callback) {
        const reqUrl = User.baseUrl + '/api/users/' + userid;
        //Craft the payload
        let payload = {
            username: username,
            contact: contact,
            email: email
        }

        //Checks if the user wants to change their old password
        if (oldPassword && password) {
            payload.oldPassword = oldPassword;
            payload.password = password;
        }

        axios.put(reqUrl, payload,
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
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
     * Saves login data to session/local storage
     * @param {string} token JWT token
     * @param {number} userid Userid
     * @param {string} username Username
     * @param {string} profilepic URL to the user's profile pic
     * @param {string} type Account type
     * @param {boolean} persistent Whether or not to use session or local storage
     * @param {()} callback Invoked upon completion
     */
    static saveSessionData(token, userid, username, profilepic, type, persistent, callback) {
        //Determine which storage system to use
        const storageSystem = persistent ? localStorage : sessionStorage;

        //Store the data in the storage system selected
        storageSystem.setItem("token", token);
        storageSystem.setItem("userid", userid);
        storageSystem.setItem("username", username);
        storageSystem.setItem("type", type);
        storageSystem.setItem("profilepic", profilepic);

        //Invoke callback
        if (callback)
            callback();

        return;
    }

    /**
     * Retrieves data from session/local storage
     * @param {()} callback Invoked upon completion
     */
    static retrieveSessionData(callback) {
        //Declare the keys to retrieve
        const keys = ["token", "userid", "username", "type", "profilepic"];

        //Attempt to retrieve data from localstorage
        let localStorageData = {};
        for (let i = 0; i < keys.length; i++) {
            //Get the current key to retrieve
            const key = keys[i];

            //Retrieve the data from localStorage
            const data = localStorage.getItem(key);
            localStorageData[key] = data;

            //Checks if the data retrieved is null
            if (data == null) {
                //Data does not actually exist, just end the loop
                localStorageData = false;
                break;
            }
        }

        //Check if data was stored within localstorage
        if (localStorageData) {
            //Data was within local storage, invoke callback with the data
            return callback(localStorageData);
        }

        //It was not in localstorage, will likely be in session storage instead
        //Attempt to retrieve data from session storage
        let sessionStorageData = {};
        for (let i = 0; i < keys.length; i++) {
            //Get the current key to retrieve
            const key = keys[i];

            //Retrieve the data from session storage
            const data = sessionStorage.getItem(key);
            sessionStorageData[key] = data;

            //Checks if the data retrieved is null
            if (data == null) {
                //Data does not actually exist, just end the loop
                sessionStorageData = false;
                break;
            }
        }

        //Check if data was stored within session storage
        if (sessionStorageData) {
            //Data was within session storage, invoke callback with the data
            return callback(sessionStorageData);
        }

        //User is not logged in at all.
        return callback(false);
    }

    /**
     * Parses the profile pic url 
     * @param {string} url The url
     * @returns The parsed url
     */
    static parseProfilePicUrl(url) {
        return this.baseUrl + "/uploads" + url;
    }


    //-- Queries --//
    /**
     * Queries a user by its userid
     * @param {*} userid The user id
     * @param {()} callback Invoked upon completion
     */
    static _queryById(userid, callback) {
        const reqUrl = User.baseUrl + '/api/users/' + userid;
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Return the result
            if (callback)
                callback(response.data);
            return response.data;
        }).catch((err) => {
            //Error encountered, return null
            if (callback)
                callback(null);
            return null;
        });
    }


    //-- Expose methods --//
    static query = {
        by: {
            id: this._queryById
        }
    }
}
//Import required modules
var mysql = require('mysql');

//Declare a pre-configured getConnection() method
var dbconnect = {
    getConnection: () => {
        var conn = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "password",
            database: "db",
            dateStrings: true
        });     
        return conn;
    }
};

//Export the db config
module.exports = dbconnect;
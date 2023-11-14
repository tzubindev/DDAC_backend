var mysql = require("mysql")
const dotenv = require('dotenv');

//Load the environment variables from the .env
dotenv.config({ path: '../.env' }); 

var connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USERDATABASE,
    password: process.env.PASSWORD,
})

module.exports = connection;
var mysql = require("mysql")
require('dotenv').config();


var connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USERDATABASE,
    password: process.env.PASSWORD,
})

module.exports = connection;